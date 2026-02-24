# Tally Copy - Invoice Generator

A versatile invoice generation tool built with Next.js, allowing you to create, manage, and download GST-compliant tax invoices seamlessly. 

The application utilizes a robust stack consisting of React, Tailwind CSS for styling, and PostgreSQL for secure and efficient raw structured data storage, avoiding ORM overhead.

## Features

- **Create Invoices**: Intuitive interface to enter customer details and line items with automatic tax and total price calculation.
- **GST Compliance**: Features built-in logic for standard 18% GST calculation (split into 9% CGST and 9% SGST), with comprehensive summaries ensuring proper tax invoice formatting.
- **Invoice Dashboard**: Easily view past invoices stored in the relational database.
- **Generate PDF**: Print or download professional, print-ready PDF invoices using HTML to PDF formatting.
- **Dark & Light Mode Integration**: Tailwind CSS styles ensure the app looks great without clashing styles like unreadable dark backgrounds on forms.
- **Full Database Migration**: Smoothly integrates with PostgreSQL via the lightweight `pg` library, employing strict TypeScript types.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL
- **Database Driver**: `pg` (node-postgres)
- **PDF Generation**: `jspdf` & `html2canvas`, `react-to-print`

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- A running PostgreSQL instance (local or clouded like Neon)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd tally-copy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(or `yarn install` / `pnpm install`)*

3. Set up the Database:
   Create a `.env` file in the root directory and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

4. Apply the Database Schema:
   A script has been provided to easily apply the schema directly. Run:
   ```bash
   node migrate.js
   ```
   *Alternatively, you can manually run `psql $DATABASE_URL -f schema.sql`.*

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

Here's an overview of the core project files:

```text
.
├── app
│   ├── api
│   │   └── invoices
│   │       └── route.ts         # Invoice CRUD API endpoints
│   ├── create
│   │   └── page.tsx             # Invoice creation page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Dashboard home (list of invoices)
├── components
│   └── InvoiceTemplate.tsx      # Print-ready UI template for rendering invoices
├── lib
│   ├── db.ts                    # PostgreSQL connection pool setup
│   ├── types.ts                 # Shared Typescript definitions
│   └── utils.ts                 # Formatting utilities
├── public                       # Static assets
├── migrate.js                   # Schema migration script
├── package.json                 # Project configuration
├── schema.sql                   # Raw PostgreSQL table schemas
└── ...
```

## Usage

1. Navigate to the main page to see the dashboard of recent invoices.
2. Click **Create New Invoice** to open the creation form.
3. Fill in the customer name and product items. The system will automatically derive taxable value, CGST, and SGST based on the entered total price (inclusive of tax).
4. After generation, select the invoice from the main dashboard.
5. Use the **Print** or **Download PDF** buttons to get a copy of the tax invoice.
