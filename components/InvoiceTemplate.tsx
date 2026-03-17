import React from 'react';
import { formatCurrency, formatDate, numberToWords } from '@/lib/utils';
import { InvoiceWithItems, InvoiceItem } from '@/lib/types';

interface InvoiceTemplateProps {
    invoice: InvoiceWithItems;
}

const SingleInvoice = ({ invoice, copyType }: { invoice: InvoiceWithItems, copyType: string }) => {
    const totalTaxable = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.taxablevalue, 0);
    const totalCGST = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.cgstamount, 0);
    const totalSGST = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.sgstamount, 0);
    const totalAmount = invoice.items.reduce((sum: number, item: InvoiceItem) => sum + item.totalprice, 0);

    // Quick rounded off calculation wrapper if decimals exist. For simplicity rounding to nearest integer
    const finalRoundedAmount = Math.round(totalAmount);
    const roundOff = finalRoundedAmount - totalAmount;

    return (
        <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', letterSpacing: 'normal' }} className="invoice-page bg-[#ffffff] text-[#000000] text-[10px] w-[210mm] min-h-[297mm] mx-auto p-4 mb-8 border border-white">
            {/* Title */}
            <div className="flex justify-between items-end mb-1 px-2">
                <div className="w-1/3"></div>
                <div className="w-1/3 text-center font-bold text-lg">Tax Invoice</div>
                <div className="w-1/3 text-right text-xs italic">{copyType}</div>
            </div>

            {/* Main Outer Box */}
            <div className="border-2 border-[#000000] flex flex-col">

                {/* Top Section */}
                <div className="flex border-b-2 border-[#000000]">
                    {/* Left Col (Seller + Consignee + Buyer) */}
                    <div className="w-1/2 flex flex-col border-r-2 border-[#000000]">
                        <div className="p-1 min-h-[140px]">
                            <h1 className="font-bold text-sm">S.S.ENTERPRISE</h1>
                            <p>178, NETAJI SUBHAS ROAD</p>
                            <p>PANIHATI-KOLKATA-700114</p>
                            <p>GSTIN - 19CGYPS4478Q1ZP</p>
                            <p>MSME - UDYAM - WB - 10 - 0026466</p>
                            <p>UDYAM : UDYAM-WB-10-0026466 (Micro)</p>
                            <p>GSTIN/UIN : 19CGYPS4478Q1ZP</p>
                            <p>State Name : West Bengal, Code : 19</p>
                            <p>Contact : +91-6291897054</p>
                            <p>E-Mail : sailendarsingh794@gmail.com</p>
                        </div>
                        <div className="border-t-2 border-[#000000] p-1 flex-1">
                            <p>Consignee (Ship to)</p>
                            <h2 className="font-bold text-sm">{invoice.customername}</h2>
                            {invoice.consigneedetails ? (
                                invoice.consigneedetails.split('\n').map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))
                            ) : (
                                <>
                                    <p>235/4, G T ROAD, NORTH, GHUSURI, Howrah,</p>
                                    <p>West Bengal, 711107</p>
                                    <p>GSTIN/UIN : 19ALRPS1105Q1ZD</p>
                                    <p>State Name : West Bengal, Code : 19</p>
                                </>
                            )}
                        </div>
                        <div className="border-t-2 border-[#000000] p-1 flex-1">
                            <p>Buyer (Bill to)</p>
                            <h2 className="font-bold text-sm">{invoice.customername}</h2>
                            {invoice.consigneedetails ? (
                                invoice.consigneedetails.split('\n').map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))
                            ) : (
                                <>
                                    <p>235/4, G T ROAD, NORTH, GHUSURI, Howrah,</p>
                                    <p>West Bengal, 711107</p>
                                    <p>GSTIN/UIN : 19ALRPS1105Q1ZD</p>
                                    <p>State Name : West Bengal, Code : 19</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Col (Metadata Grid) */}
                    <div className="w-1/2 flex flex-col">
                        <div className="flex border-b border-[#000000]">
                            <div className="w-1/3 p-1 border-r border-[#000000]">
                                <p>Invoice No.</p>
                                <p className="font-bold">{invoice.invoicenumber}</p>
                            </div>
                            <div className="w-1/3 p-1 border-r border-[#000000]">
                                <p>e-Way Bill No.</p>
                                <p className="font-bold">{invoice.ewaybillno}</p>
                            </div>
                            <div className="w-1/3 p-1">
                                <p>Dated</p>
                                <p className="font-bold">{formatDate(invoice.date)}</p>
                            </div>
                        </div>
                        <div className="flex border-b border-[#000000]">
                            <div className="w-1/2 p-1 border-r border-[#000000]">
                                <p>Delivery Note</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p>Mode/Terms of Payment</p>
                            </div>
                        </div>
                        <div className="flex border-b border-[#000000]">
                            <div className="w-1/2 p-1 border-r border-[#000000]">
                                <p>Reference No. & Date.</p>
                                <p className="font-bold">{invoice.id} {formatDate(invoice.date)}</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p>Other References</p>
                            </div>
                        </div>
                        <div className="flex border-b border-[#000000]">
                            <div className="w-1/2 p-1 border-r border-[#000000]">
                                <p>Buyer&apos;s Order No.</p>
                                <p className="font-bold">VERBAL</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p>Dated</p>
                                <p className="font-bold">{formatDate(invoice.date)}</p>
                            </div>
                        </div>
                        <div className="flex border-b border-[#000000]">
                            <div className="w-1/2 p-1 border-r border-[#000000]">
                                <p>Dispatch Doc No.</p>
                                <p className="font-bold">{invoice.dispatchdocno}</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p>Delivery Note Date</p>
                            </div>
                        </div>
                        <div className="flex border-b border-[#000000]">
                            <div className="w-1/2 p-1 border-r border-[#000000]">
                                <p>Dispatched through</p>
                                <p className="font-bold">BY ROAD</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p>Destination</p>
                                <p className="font-bold">235/4, G T ROAD, NORTH, GHUSURI</p>
                            </div>
                        </div>
                        <div className="flex border-b-2 border-[#000000]">
                            <div className="w-1/2 p-1 border-r border-[#000000]">
                                <p>Bill of Lading/LR-RR No.</p>
                            </div>
                            <div className="w-1/2 p-1">
                                <p>Motor Vehicle No.</p>
                                <p className="font-bold">{invoice.motorvehicleno}</p>
                            </div>
                        </div>
                        <div className="p-1 flex-1">
                            <p>Terms of Delivery</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-[#000000]">
                            <th className="border-r border-[#000000] p-[2px] w-6 font-normal">Sl<br />No.</th>
                            <th className="border-r border-[#000000] p-1 font-normal">Description of Goods</th>
                            <th className="border-r border-[#000000] p-1 w-16 font-normal">HSN/SAC</th>
                            <th className="border-r border-[#000000] p-1 w-20 font-normal">Quantity</th>
                            <th className="border-r border-[#000000] p-1 w-12 font-normal">Rate</th>
                            <th className="border-r border-[#000000] p-1 w-8 font-normal">per</th>
                            <th className="p-1 w-24 font-normal">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item: InvoiceItem, index: number) => (
                            <tr key={index} className="align-top border-b-2 border-[#000000]">
                                <td className="border-r border-[#000000] p-1 text-center font-bold">{index + 1}</td>
                                <td className="border-r border-[#000000] p-1 h-[270px]">
                                    <div className="font-bold mb-8">{item.productname}</div>
                                    <div className="text-right italic font-bold pr-16 mb-2">CGST</div>
                                    <div className="text-right italic font-bold pr-16 mb-2">SGST</div>
                                    <div className="text-right italic font-bold pr-16 mb-8">ROUNDED OFF(+/-)</div>
                                    {/* Optional Bill details block from screenshot */}
                                </td>
                                <td className="border-r border-[#000000] p-1 text-center">{item.hsnsac || ''}</td>
                                <td className="border-r border-[#000000] p-1 text-right font-bold">
                                    {item.quantity.toFixed(3)} KG
                                </td>
                                <td className="border-r border-[#000000] p-1 text-right">
                                    {(item.taxablevalue / item.quantity).toFixed(2)}
                                </td>
                                <td className="border-r border-[#000000] p-1 text-center">KG</td>
                                <td className="p-1 text-right font-bold">
                                    <div className="mb-8">{formatCurrency(item.taxablevalue).replace('₹', '')}</div>
                                    <div className="mb-2">{formatCurrency(item.cgstamount).replace('₹', '')}</div>
                                    <div className="mb-2">{formatCurrency(item.sgstamount).replace('₹', '')}</div>
                                    <div className="mb-8">{roundOff !== 0 ? roundOff.toFixed(2) : '0.00'}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-[#000000]">
                        <tr>
                            <td colSpan={3} className="border-r border-[#000000] p-1 text-right">Total</td>
                            <td className="border-r border-[#000000] p-1 text-right font-bold">
                                {invoice.items.reduce((s: number, i: InvoiceItem) => s + i.quantity, 0).toFixed(3)} KG
                            </td>
                            <td colSpan={2} className="border-r border-[#000000]"></td>
                            <td className="p-1 text-right font-bold">₹ {formatCurrency(finalRoundedAmount).replace('₹', '')}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Amount in words */}
                <div className="border-t-2 border-b-2 border-[#000000] p-1 flex justify-between">
                    <div>
                        <p>Amount Chargeable (in words)</p>
                        <p className="font-bold text-sm">INR {numberToWords(finalRoundedAmount)} Only</p>
                    </div>
                    <div className="italic text-right pt-[2px]">E. & O.E</div>
                </div>

                {/* Tax Breakdown */}
                <div className="border-b-2 border-[#000000]">
                    <table className="w-full text-center">
                        <thead>
                            <tr className="border-b border-[#000000]">
                                <th rowSpan={2} className="border-r border-[#000000] font-normal">HSN/SAC</th>
                                <th rowSpan={2} className="border-r border-[#000000] font-normal">Taxable<br />Value</th>
                                <th colSpan={2} className="border-r border-[#000000] border-b font-normal">CGST</th>
                                <th colSpan={2} className="border-r border-[#000000] border-b font-normal">SGST/UTGST</th>
                                <th rowSpan={2} className="font-normal">Total<br />Tax Amount</th>
                            </tr>
                            <tr className="border-b border-[#000000]">
                                <th className="border-r border-[#000000] font-normal w-12">Rate</th>
                                <th className="border-r border-[#000000] font-normal">Amount</th>
                                <th className="border-r border-[#000000] font-normal w-12">Rate</th>
                                <th className="border-r border-[#000000] font-normal">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-r border-[#000000] text-left p-1">{Array.from(new Set(invoice.items.map((i: InvoiceItem) => i.hsnsac).filter(Boolean))).join(', ')}</td>
                                <td className="border-r border-[#000000] text-right p-1">{formatCurrency(totalTaxable).replace('₹', '')}</td>
                                <td className="border-r border-[#000000] p-1">9%</td>
                                <td className="border-r border-[#000000] text-right p-1">{formatCurrency(totalCGST).replace('₹', '')}</td>
                                <td className="border-r border-[#000000] p-1">9%</td>
                                <td className="border-r border-[#000000] text-right p-1">{formatCurrency(totalSGST).replace('₹', '')}</td>
                                <td className="text-right p-1">{formatCurrency(totalCGST + totalSGST).replace('₹', '')}</td>
                            </tr>
                            <tr className="border-t-2 border-[#000000] font-bold">
                                <td className="border-r border-[#000000] text-right p-1">Total</td>
                                <td className="border-r border-[#000000] text-right p-1">{formatCurrency(totalTaxable).replace('₹', '')}</td>
                                <td className="border-r border-[#000000]"></td>
                                <td className="border-r border-[#000000] text-right p-1">{formatCurrency(totalCGST).replace('₹', '')}</td>
                                <td className="border-r border-[#000000]"></td>
                                <td className="border-r border-[#000000] text-right p-1">{formatCurrency(totalSGST).replace('₹', '')}</td>
                                <td className="text-right p-1">{formatCurrency(totalCGST + totalSGST).replace('₹', '')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Tax Words */}
                <div className="border-b-2 border-[#000000] p-1">
                    Tax Amount (in words) : <span className="font-bold">INR {numberToWords(totalCGST + totalSGST)} Only</span>
                </div>

                {/* Footer block */}
                <div className="flex h-32">
                    <div className="w-1/2 p-1 border-r-2 border-[#000000] flex flex-col justify-end">
                        <p className="underline mb-1">Declaration</p>
                        <p>We declare that this invoice shows the actual price of</p>
                        <p>the goods described and that all particulars are true</p>
                        <p>and correct.</p>
                    </div>
                    <div className="w-1/2 flex flex-col justify-between p-1">
                        <div>
                            <table className="text-xs">
                                <tbody>
                                    <tr>
                                        <td colSpan={2} className="pb-1">Company&apos;s Bank Details</td>
                                    </tr>
                                    <tr>
                                        <td className="pr-2 w-28">A/c Holder&apos;s Name</td>
                                        <td>: <span className="font-bold">S.S.ENTERPRISE</span></td>
                                    </tr>
                                    <tr>
                                        <td>Bank Name</td>
                                        <td>: <span className="font-bold">Punjab National Bank-0680</span></td>
                                    </tr>
                                    <tr>
                                        <td>A/c No.</td>
                                        <td>: <span className="font-bold">0113208700000680</span></td>
                                    </tr>
                                    <tr>
                                        <td>Branch & IFS Code</td>
                                        <td>: <span className="font-bold">ALAMBAZAR & PUNB0011320</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="text-right">
                            <p className="font-bold mb-6">for S.S.ENTERPRISE</p>
                            <p>Authorised Signatory</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-1">SUBJECT TO KOLKATA JURISDICTION</div>
            <div className="text-center">This is a Computer Generated Invoice</div>
        </div>
    );
};

const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ invoice }, ref) => {
    return (
        <div ref={ref} className="bg-gray-100 flex flex-col gap-8 py-8 items-center" style={{ minWidth: '220mm' }}>
            <SingleInvoice invoice={invoice} copyType="(ORIGINAL FOR RECIPIENT)" />
            <SingleInvoice invoice={invoice} copyType="(DUPLICATE FOR TRANSPORTER)" />
            <SingleInvoice invoice={invoice} copyType="(TRIPLICATE FOR SUPPLIER)" />
        </div>
    );
});
InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
