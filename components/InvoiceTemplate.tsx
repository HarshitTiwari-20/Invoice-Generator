import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { InvoiceWithItems, InvoiceItem } from '@/lib/types';

interface InvoiceTemplateProps {
    invoice: InvoiceWithItems;
}

// Ensure strict printable styles


const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ invoice }, ref) => {
    const totalTaxable = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.taxablevalue, 0);
    const totalCGST = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.cgstamount, 0);
    const totalSGST = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.sgstamount, 0);
    const totalAmount = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.totalprice, 0);

    return (
        <div ref={ref} className="p-8 max-w-[210mm] mx-auto bg-white text-black text-xs font-sans border border-gray-300 print:border-none">
            <div className="text-center font-bold text-lg mb-2">Tax Invoice <span className="text-sm font-normal float-right">(ORIGINAL FOR RECIPIENT)</span></div>

            <div className="border border-black flex flex-col">
                {/* Header Section */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 p-2 border-r border-black">
                        <h1 className="font-bold text-sm">S.S.ENTERPRISE</h1>
                        <p>178, NETAJI SUBHAS ROAD</p>
                        <p>PANIHATI-KOLKATA-700114</p>
                        <p>GSTIN: 19CGYPS4478Q1ZP</p>
                        <p>MSME: UDYAM-WB-10-0026466</p>
                        <p>State Name: West Bengal, Code: 19</p>
                        <p>E-Mail: sailendarsingh794@gmail.com</p>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <div className="flex border-b border-black">
                            <div className="w-1/2 p-1 border-r border-black">
                                <p className="font-bold">Invoice No.</p>
                                <p>{invoice.invoicenumber}</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p className="font-bold">Dated</p>
                                <p>{new Date(invoice.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex border-b border-black">
                            <div className="w-1/2 p-1 border-r border-black">
                                <p className="font-bold">Delivery Note</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p className="font-bold">Mode/Terms of Payment</p>
                            </div>
                        </div>
                        <div className="flex border-b border-black">
                            <div className="w-1/2 p-1 border-r border-black">
                                <p className="font-bold">Buyer's Order No.</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p className="font-bold">Dated</p>
                            </div>
                        </div>
                        <div className="flex flex-1">
                            <div className="w-1/2 p-1 border-r border-black">
                                <p className="font-bold">Dispatched through</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p className="font-bold">Destination</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consignee Section */}
                <div className="flex border-b border-black">
                    <div className="w-1/2 p-2 border-r border-black">
                        <p className="font-bold">Consignee (Ship to)</p>
                        <h2 className="font-bold text-sm uppercase">{invoice.customername}</h2>
                        <p>Address Placeholder...</p>
                    </div>
                    <div className="w-1/2 p-2">
                        <p className="font-bold">Buyer (Bill to)</p>
                        <h2 className="font-bold text-sm uppercase">{invoice.customername}</h2>
                        <p>Address Placeholder...</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black p-1 text-left w-10">Sl No.</th>
                            <th className="border-r border-black p-1 text-left">Description of Goods</th>
                            <th className="border-r border-black p-1 w-20">HSN/SAC</th>
                            <th className="border-r border-black p-1 w-20">Quantity</th>
                            <th className="border-r border-black p-1 w-16">Rate</th>
                            <th className="border-r border-black p-1 w-10">per</th>
                            <th className="p-1 w-24 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item: InvoiceItem, index: number) => (
                            <tr key={index} className="align-top h-64">
                                <td className="border-r border-black p-1 text-center">{index + 1}</td>
                                <td className="border-r border-black p-1">
                                    <span className="font-bold ">{item.productname}</span>
                                    <div className="mt-8 text-right pr-4">
                                        <p>CGST</p>
                                        <p>SGST</p>
                                    </div>
                                </td>
                                <td className="border-r border-black p-1 text-center">392111</td>
                                <td className="border-r border-black p-1 text-center">
                                    <span className="font-bold">{item.quantity.toFixed(3)} KG</span>
                                </td>
                                <td className="border-r border-black p-1 text-center">
                                    {(item.taxablevalue / item.quantity).toFixed(2)}
                                </td>
                                <td className="border-r border-black p-1 text-center">KG</td>
                                <td className="p-1 text-right">
                                    <span className="font-bold">{formatCurrency(item.taxablevalue)}</span>
                                    <div className="mt-8">
                                        <p>{formatCurrency(item.cgstamount)}</p>
                                        <p>{formatCurrency(item.sgstamount)}</p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t border-black">
                        <tr>
                            <td colSpan={3} className="border-r border-black p-1 text-right font-bold">Total</td>
                            <td className="border-r border-black p-1 text-center font-bold">{invoice.items.reduce((s: number, i: InvoiceItem) => s + i.quantity, 0).toFixed(3)} KG</td>
                            <td colSpan={2} className="border-r border-black"></td>
                            <td className="p-1 text-right font-bold">{formatCurrency(totalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Amount in words */}
                <div className="border-b border-black p-2">
                    <p>Amount Chargeable (in words)</p>
                    <p className="font-bold">Indian Rupees {totalAmount} Only</p>
                </div>

                {/* Tax Breakdown */}
                <div className="border-b border-black">
                    <table className="w-full text-center">
                        <thead>
                            <tr className="border-b border-black">
                                <th rowSpan={2} className="border-r border-black">HSN/SAC</th>
                                <th rowSpan={2} className="border-r border-black">Taxable Value</th>
                                <th colSpan={2} className="border-r border-black border-b">CGST</th>
                                <th colSpan={2} className="border-r border-black border-b">SGST/UTGST</th>
                                <th rowSpan={2}>Total Tax Amount</th>
                            </tr>
                            <tr>
                                <th className="border-r border-black">Rate</th>
                                <th className="border-r border-black">Amount</th>
                                <th className="border-r border-black">Rate</th>
                                <th className="border-r border-black">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-r border-black">392111</td>
                                <td className="border-r border-black">{formatCurrency(totalTaxable)}</td>
                                <td className="border-r border-black">9%</td>
                                <td className="border-r border-black">{formatCurrency(totalCGST)}</td>
                                <td className="border-r border-black">9%</td>
                                <td className="border-r border-black">{formatCurrency(totalSGST)}</td>
                                <td>{formatCurrency(totalCGST + totalSGST)}</td>
                            </tr>
                            <tr className="border-t border-black font-bold">
                                <td className="border-r border-black text-right">Total</td>
                                <td className="border-r border-black">{formatCurrency(totalTaxable)}</td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black">{formatCurrency(totalCGST)}</td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black">{formatCurrency(totalSGST)}</td>
                                <td>{formatCurrency(totalCGST + totalSGST)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer / Bank / Sign */}
                <div className="flex min-h-32">
                    <div className="w-1/2 p-2 border-r border-black">
                        <p className="underline mb-2">Declaration</p>
                        <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                    </div>
                    <div className="w-1/2 flex flex-col justify-between p-2">
                        <div>
                            <p className="font-bold">Company's Bank Details</p>
                            <p>A/c Holder's Name: <span className="font-bold">S.S.ENTERPRISE</span></p>
                            <p>Bank Name: <span className="font-bold">Punjab National Bank</span></p>
                            <p>A/c No.: <span className="font-bold">0113208700000680</span></p>
                            <p>IFS Code: <span className="font-bold">PUNB0011320</span></p>
                        </div>
                        <div className="text-right mt-4">
                            <p>for S.S.ENTERPRISE</p>
                            <br />
                            <p className="text-xs mt-4">Authorised Signatory</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-2 text-sm">SUBJECT TO KOLKATA JURISDICTION</div>
            <div className="text-center text-sm">This is a Computer Generated Invoice</div>
        </div>
    );
});

export default InvoiceTemplate;
