CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoiceNumber VARCHAR(255) UNIQUE DEFAULT gen_random_uuid()::varchar,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customerName VARCHAR(255)
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  productName VARCHAR(255) NOT NULL,
  quantity FLOAT NOT NULL,
  totalPrice FLOAT NOT NULL,
  taxableValue FLOAT NOT NULL,
  cgstAmount FLOAT NOT NULL,
  sgstAmount FLOAT NOT NULL,
  invoiceId INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE
);
