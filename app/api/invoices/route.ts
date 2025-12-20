
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// PrismaClient is instantiated once and reused across hot reloads in development
// to prevent multiple instances being created.
declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

// Data structure for the request body
interface InvoiceItemInput {
    productName: string;
    quantity: number;
    totalPrice: number; // Inclusive of Tax
}

interface CreateInvoiceRequest {
    customerName?: string;
    items: InvoiceItemInput[];
}

export async function POST(req: NextRequest) {
    try {
        const body: CreateInvoiceRequest = await req.json();
        const { customerName, items } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Items are required' }, { status: 400 });
        }

        // Identify which items need calculation
        // GST Rate assumption: 18%
        const GST_RATE = 0.18;

        const invoiceData = items.map((item) => {
            // Calculate derived values
            // total = taxable * (1 + rate)
            // taxable = total / (1 + rate)
            const taxableValue = item.totalPrice / (1 + GST_RATE);
            const totalTax = item.totalPrice - taxableValue;
            const cgst = totalTax / 2;
            const sgst = totalTax / 2;

            return {
                productName: item.productName,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                taxableValue: parseFloat(taxableValue.toFixed(2)),
                cgstAmount: parseFloat(cgst.toFixed(2)),
                sgstAmount: parseFloat(sgst.toFixed(2)),
            };
        });

        const invoice = await prisma.invoice.create({
            data: {
                customerName: customerName || 'Cash Customer',
                items: {
                    create: invoiceData,
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(invoice, { status: 201 });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                items: true,
            },
            orderBy: {
                date: 'desc',
            },
        });
        return NextResponse.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
