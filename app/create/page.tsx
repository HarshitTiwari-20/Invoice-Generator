'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateInvoicePage() {
    const router = useRouter();
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [motorVehicleNo, setMotorVehicleNo] = useState('');
    const [dispatchDocNo, setDispatchDocNo] = useState('');
    const [items, setItems] = useState([
        { productName: '', quantity: 1, totalPrice: 0 }
    ]);
    const [loading, setLoading] = useState(false);

    const handleAddItem = () => {
        setItems([...items, { productName: '', quantity: 1, totalPrice: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleChange = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceNumber, customerName, motorVehicleNo, dispatchDocNo, items }),
            });

            if (res.ok) {
                router.push('/');
            } else {
                alert('Failed to create invoice');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Invoice Number</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
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
                                className="w-full border p-2 rounded"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                placeholder="Enter customer name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Motor Vehicle No. (Optional)</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={motorVehicleNo}
                                onChange={(e) => setMotorVehicleNo(e.target.value)}
                                placeholder="Enter vehicle number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Dispatch Doc No. (Optional)</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={dispatchDocNo}
                                onChange={(e) => setDispatchDocNo(e.target.value)}
                                placeholder="Enter dispatch document number"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium">Items</label>
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-end border p-4 rounded bg-gray-50 text-black">
                                <div className="flex-1 ">
                                    <label className="block text-xs mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={item.productName}
                                        onChange={(e) => handleChange(index, 'productName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full border p-2 rounded"
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
                                        className="w-full border p-2 rounded"
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
                            className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                            + Add Another Item
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Invoice'}
                    </button>
                </form>
            </div>
        </div>
    );
}
