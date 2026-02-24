export interface Invoice {
    id: number;
    invoicenumber: string;
    date: Date;
    customername: string | null;
}

export interface InvoiceItem {
    id: number;
    productname: string;
    quantity: number;
    totalprice: number;
    taxablevalue: number;
    cgstamount: number;
    sgstamount: number;
    invoiceid: number;
}

// Full type for UI and endpoints
export interface InvoiceWithItems extends Invoice {
    items: InvoiceItem[];
}
