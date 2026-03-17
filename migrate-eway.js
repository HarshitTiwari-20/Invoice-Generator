/* eslint-disable */
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function migrate() {
    try {
        await client.connect();
        console.log('Applying migration...');
        
        await client.query(`
            ALTER TABLE invoices 
            ADD COLUMN IF NOT EXISTS ewayBillNo TEXT;
        `);
        
        console.log('Migration applied successfully.');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await client.end();
    }
}

migrate();
