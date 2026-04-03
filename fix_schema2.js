require('dotenv').config();
const { Client } = require('pg');
const c = new Client({connectionString: process.env.DATABASE_URL});
async function fix() {
  await c.connect();
  let res;
  
  console.log("Adding hsnsac to invoice_items...");
  await c.query('ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS hsnsac VARCHAR(255);');
  console.log("Adding features to invoices...");
  await c.query('ALTER TABLE invoices ADD COLUMN IF NOT EXISTS consigneeDetails TEXT, ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;');
  console.log("Adding eway to invoices...");
  await c.query('ALTER TABLE invoices ADD COLUMN IF NOT EXISTS ewayBillNo TEXT;');
  
  res = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices'");
  console.log("invoices columns:", res.rows.map(r => r.column_name));
  
  res = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'invoice_items'");
  console.log("invoice_items columns:", res.rows.map(r => r.column_name));
  
  await c.end();
}
fix().catch(err => { console.error(err); c.end(); });
