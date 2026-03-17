'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditInvoicePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [motorVehicleNo, setMotorVehicleNo] = useState('');
    const [dispatchDocNo, setDispatchDocNo] = useState('');
    const [ewayBillNo, setEwayBillNo] = useState('');
    const [consigneeDetails, setConsigneeDetails] = useState('');
    const [items, setItems] = useState([
        { productName: '', hsnSac: '', quantity: 1, totalPrice: 0 }
    ]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/invoices/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setInvoiceNumber(data.invoicenumber || '');
                    setCustomerName(data.customername || '');
                    setMotorVehicleNo(data.motorvehicleno || '');
                    setDispatchDocNo(data.dispatchdocno || '');
                    setEwayBillNo(data.ewaybillno || '');
                    setConsigneeDetails(data.consigneedetails || '');
                    
                    if (data.items && data.items.length > 0) {
                        setItems(data.items.map((i: { productname: string; hsnsac: string; quantity: number; totalprice: number }) => ({
                            productName: i.productname,
                            hsnSac: i.hsnsac || '',
                            quantity: i.quantity,
                            totalPrice: i.totalprice
                        })));
                    }
                } else {
                    alert('Invoice not found');
                    router.push('/');
                }
            } catch (err) {
                console.error(err);
                alert('Error fetching invoice');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id, router]);

    const handleAddItem = () => {
        setItems([...items, { productName: '', hsnSac: '', quantity: 1, totalPrice: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        // @ts-expect-error dynamic key assignment
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/invoices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceNumber, customerName, motorVehicleNo, dispatchDocNo, ewayBillNo, consigneeDetails, items }),
            });

            if (res.ok) {
                router.push('/');
            } else {
                alert('Failed to update invoice');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating invoice');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen p-8 text-center text-black bg-white">Loading invoice data...</div>;
    }

    return (
        <div className="min-h-screen premium-bg p-8 flex justify-center items-start">
            <div className="w-full max-w-4xl glass-card p-8 md:p-12 rounded-2xl shadow-2xl relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-wide">Edit Invoice</h1>
                    <div>
                        <button onClick={() => router.push('/')} className="text-white px-6 py-4 bg-blue-500 p-2 rounded hover:bg-blue-600">
                            Cancel
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Invoice Number</label>
                            <input
                                type="text"
                                className="w-full glass-input p-3 rounded-lg transition"
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                required
                                placeholder="Enter invoice number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Customer Name</label>
                            <input
                                type="text"
                                className="w-full glass-input p-3 rounded-lg transition"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                placeholder="Enter customer name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Motor Vehicle No. </label>
                            <input
                                type="text"
                                className="w-full glass-input p-3 rounded-lg transition"
                                value={motorVehicleNo}
                                onChange={(e) => setMotorVehicleNo(e.target.value)}
                                placeholder="Enter vehicle number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Dispatch Doc No. </label>
                            <input
                                type="text"
                                className="w-full glass-input p-3 rounded-lg transition"
                                value={dispatchDocNo}
                                onChange={(e) => setDispatchDocNo(e.target.value)}
                                placeholder="Enter dispatch document number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">e-Way Bill No.</label>
                            <input
                                type="text"
                                className="w-full glass-input p-3 rounded-lg transition"
                                value={ewayBillNo}
                                onChange={(e) => setEwayBillNo(e.target.value)}
                                placeholder="Enter e-Way Bill No. (Optional)"
                            />
                        </div>
                        <div className="col-span-2 w-full">
                            <label className="block text-sm font-medium mb-1">Consignee Details (Ship To)</label>
                            <textarea
                                className="w-full glass-input p-3 rounded-lg h-32 transition"
                                value={consigneeDetails}
                                onChange={(e) => setConsigneeDetails(e.target.value)}
                                placeholder={`e.g.\n235/4, G T ROAD, NORTH, GHUSURI, Howrah,\nWest Bengal, 711107\nGSTIN/UIN : 19ALRPS1105Q1ZD\nState Name : West Bengal, Code : 19`}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium">Items</label>
                        {items.map((item, index) => (
                            <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-white/5 border border-white/10 p-5 rounded-xl text-white">
                                <div className="flex-1 ">
                                    <label className="block text-xs mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        className="w-full glass-input p-3 rounded-lg transition"
                                        value={item.productName}
                                        onChange={(e) => handleChange(index, 'productName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs mb-1">HSN/SAC</label>
                                    <input
                                        type="text"
                                        className="w-full glass-input p-3 rounded-lg transition"
                                        value={item.hsnSac || ''}
                                        onChange={(e) => handleChange(index, 'hsnSac', e.target.value)}
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full glass-input p-3 rounded-lg transition"
                                        value={item.quantity}
                                        onChange={(e) => handleChange(index, 'quantity', parseFloat(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="w-40">
                                    <label className="block text-xs mb-1">Total Price (Inc. Tax)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full glass-input p-3 rounded-lg transition"
                                        value={item.totalPrice}
                                        onChange={(e) => handleChange(index, 'totalPrice', parseFloat(e.target.value))}
                                        required
                                    />
                                </div>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="text-red-500 hover:text-red-700 pb-2"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="text-fuchsia-300 hover:text-fuchsia-200 text-sm font-semibold transition"
                        >
                            + Add Another Item
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-fuchsia-600/90 hover:bg-fuchsia-500 text-white px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition w-full md:w-auto font-bold text-lg disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
