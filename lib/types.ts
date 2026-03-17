export interface Invoice {
    id: number;
    invoicenumber: string;
    date: Date;
    customername: string | null;
    motorvehicleno: string | null;
    dispatchdocno: string | null;
    consigneedetails: string | null;
    ewaybillno: string | null;
    is_deleted: boolean;
}

export interface InvoiceItem {
    id: number;
    productname: string;
    hsnsac?: string;
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
