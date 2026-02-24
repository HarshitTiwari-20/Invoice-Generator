require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function migrate() {
    try {
        await client.connect();
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        console.log('Applying schema...');
        await client.query(schema);
        console.log('Schema applied successfully.');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await client.end();
    }
}

migrate();
