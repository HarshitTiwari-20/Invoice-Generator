import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Data structure for the request body
interface InvoiceItemInput {
    productName: string;
    hsnsac?: string;
    quantity: number;
    totalPrice: number; // Inclusive of Tax
}

interface CreateInvoiceRequest {
    invoiceNumber: string;
    customerName?: string;
    motorVehicleNo?: string;
    dispatchDocNo?: string;
    consigneeDetails?: string;
    ewayBillNo?: string;
    items: InvoiceItemInput[];
}

export async function POST(req: NextRequest) {
    try {
        const body: CreateInvoiceRequest = await req.json();
        const { invoiceNumber, customerName, motorVehicleNo, dispatchDocNo, consigneeDetails, ewayBillNo, items } = body;

        if (!invoiceNumber) {
            return NextResponse.json({ error: 'Invoice number is required' }, { status: 400 });
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Items are required' }, { status: 400 });
        }

        // Identify which items need calculation
        // GST Rate assumption: 18%
        const GST_RATE = 0.18;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const insertInvoiceText = `
                INSERT INTO invoices (invoiceNumber, customerName, motorVehicleNo, dispatchDocNo, consigneeDetails, ewayBillNo, is_deleted)
                VALUES ($1, $2, $3, $4, $5, $6, false)
                RETURNING id, invoiceNumber, date, customerName, motorVehicleNo, dispatchDocNo, consigneeDetails, ewayBillNo, is_deleted
            `;
            const invoiceRes = await client.query(insertInvoiceText, [
                invoiceNumber,
                customerName || 'Cash Customer',
                motorVehicleNo || null,
                dispatchDocNo || null,
                consigneeDetails || null,
                ewayBillNo || null
            ]);
            const invoice = invoiceRes.rows[0];

            const insertItemText = `
                INSERT INTO invoice_items 
                (productName, hsnsac, quantity, totalPrice, taxableValue, cgstAmount, sgstAmount, invoiceId)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;

            const createdItems = [];

            for (const item of items) {
                const taxableValue = item.totalPrice / (1 + GST_RATE);
                const totalTax = item.totalPrice - taxableValue;
                const cgst = totalTax / 2;
                const sgst = totalTax / 2;

                const itemRes = await client.query(insertItemText, [
                    item.productName,
                    item.hsnsac || null,
                    item.quantity,
                    item.totalPrice,
                    parseFloat(taxableValue.toFixed(2)),
                    parseFloat(cgst.toFixed(2)),
                    parseFloat(sgst.toFixed(2)),
                    invoice.id
                ]);
                createdItems.push(itemRes.rows[0]);
            }

            await client.query('COMMIT');

            return NextResponse.json({ ...invoice, items: createdItems }, { status: 201 });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Fetch all invoices with their items
        const invoicesQuery = `
            SELECT i.*, 
                   json_agg(ii.*) as items
            FROM invoices i
            LEFT JOIN invoice_items ii ON i.id = ii.invoiceId
            WHERE i.is_deleted = false OR i.is_deleted IS NULL
            GROUP BY i.id
            ORDER BY i.date DESC
        `;
        const result = await pool.query(invoicesQuery);

        // Ensure items array is empty instead of [null] when there are no items
        const invoices = result.rows.map(row => ({
            ...row,
            items: row.items[0] === null ? [] : row.items
        }));

        return NextResponse.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
