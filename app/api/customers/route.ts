import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');

        if (!name) {
            return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
        }

        const client = await pool.connect();

        try {
            const query = `
                SELECT consigneedetails
                FROM invoices
                WHERE customername ILIKE $1 AND consigneedetails IS NOT NULL AND consigneedetails != ''
                ORDER BY date DESC
                LIMIT 1
            `;
            const result = await client.query(query, [name]);

            if (result.rows.length > 0) {
                return NextResponse.json({ consigneeDetails: result.rows[0].consigneedetails });
            } else {
                return NextResponse.json({ consigneeDetails: null });
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching customer details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
