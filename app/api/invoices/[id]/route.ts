import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });

        const client = await pool.connect();
        try {
            await client.query('UPDATE invoices SET is_deleted = true WHERE id = $1', [id]);
            return NextResponse.json({ success: true }, { status: 200 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });

        const client = await pool.connect();
        try {
            const invoiceQuery = `
                SELECT i.*, json_agg(ii.*) as items
                FROM invoices i
                LEFT JOIN invoice_items ii ON i.id = ii.invoiceId
                WHERE i.id = $1 AND (i.is_deleted = false OR i.is_deleted IS NULL)
                GROUP BY i.id
            `;
            const result = await client.query(invoiceQuery, [id]);
            
            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
            }

            const invoice = result.rows[0];
            invoice.items = invoice.items[0] === null ? [] : invoice.items;
            
            return NextResponse.json(invoice, { status: 200 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        if (!id) return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });

        const body = await req.json();
        const { invoiceNumber, customerName, motorVehicleNo, dispatchDocNo, consigneeDetails, ewayBillNo, items } = body;

        const GST_RATE = 0.18;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const updateInvoiceText = `
                UPDATE invoices 
                SET invoiceNumber = $1, customerName = $2, motorVehicleNo = $3, 
                    dispatchDocNo = $4, consigneeDetails = $5, ewayBillNo = $6
                WHERE id = $7 AND (is_deleted = false OR is_deleted IS NULL)
                RETURNING *
            `;
            const invoiceRes = await client.query(updateInvoiceText, [
                invoiceNumber, customerName || 'Cash Customer', motorVehicleNo || null,
                dispatchDocNo || null, consigneeDetails || null, ewayBillNo || null, id
            ]);

            if (invoiceRes.rows.length === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
            }
            const invoice = invoiceRes.rows[0];

            // Delete old items and insert new ones
            await client.query('DELETE FROM invoice_items WHERE invoiceId = $1', [id]);

            const insertItemText = `
                INSERT INTO invoice_items 
                (productName, hsnsac, quantity, totalPrice, taxableValue, cgstAmount, sgstAmount, invoiceId)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;

            const updatedItems = [];

            for (const item of items) {
                const taxableValue = item.totalPrice / (1 + GST_RATE);
                const totalTax = item.totalPrice - taxableValue;
                const cgst = totalTax / 2;
                const sgst = totalTax / 2;

                const itemRes = await client.query(insertItemText, [
                    item.productName, item.hsnsac || null, item.quantity, item.totalPrice,
                    parseFloat(taxableValue.toFixed(2)), parseFloat(cgst.toFixed(2)), 
                    parseFloat(sgst.toFixed(2)), id
                ]);
                updatedItems.push(itemRes.rows[0]);
            }

            await client.query('COMMIT');

            return NextResponse.json({ ...invoice, items: updatedItems }, { status: 200 });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
