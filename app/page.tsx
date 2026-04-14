'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { InvoiceWithItems } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithItems | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handleDownloadPdf = async () => {
    const input = printRef.current;
    if (!input) return;

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pages = input.querySelectorAll('.invoice-page');
      if (pages.length === 0) return;

      for (let i = 0; i < pages.length; i++) {
        const pageNode = pages[i] as HTMLElement;
        const canvas = await html2canvas(pageNode, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const imgWidthInPdf = imgWidth * ratio;
        const imgHeightInPdf = imgHeight * ratio;
        
        const xOffset = (pdfWidth - imgWidthInPdf) / 2;

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', xOffset, 0, imgWidthInPdf, imgHeightInPdf);
      }

      pdf.save(`invoice_${selectedInvoice?.invoicenumber || 'download'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    }
  };

  useEffect(() => {
    fetch('/api/invoices')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setInvoices(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInvoices(invoices.filter(inv => inv.id !== id));
        if (selectedInvoice?.id === id) {
          setSelectedInvoice(null);
        }
      } else {
        alert('Failed to delete invoice');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting invoice');
    }
  };

  return (
    <div className="min-h-screen premium-bg p-8">
      <div className="max-w-10xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide">Invoice Manager</h1>
          <div className="flex gap-4">
            <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
              Create New Invoice
            </Link>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Invoice List */}
          <div className="glass-card p-6 rounded-2xl col-span-1 h-[80vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Invoices</h2>
            {invoices.length === 0 && <p className="text-gray-300">No invoices found.</p>}
            <ul className="space-y-4">
              {invoices.map((inv) => (
                <li
                  key={inv.id}
                  className={`border border-white/10 p-4 rounded-xl cursor-pointer transition-all hover:bg-white/10 ${selectedInvoice?.id === inv.id ? 'bg-white/20 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-black/20'}`}
                  onClick={() => setSelectedInvoice(inv)}
                >
                  <div className="flex justify-between">
                    <span className="font-bold text-white">{inv.invoicenumber}</span>
                    <span className="text-xs text-gray-300">{formatDate(inv.date)}</span>
                  </div>
                  <div className="text-sm text-gray-300 xl:truncate">{inv.customername}</div>
                  <div className="font-semibold text-right mt-2 text-fuchsia-300">
                    ₹{inv.items.reduce((s, i) => s + i.totalprice, 0).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Invoice Preview */}
          <div className="md:col-span-2 col-span-1 glass-card flex flex-col items-center rounded-2xl h-[80vh] overflow-hidden relative border border-white/5">
            {selectedInvoice ? (
              <div className="w-full h-full flex flex-col relative">
                {/* Fixed Header with Controls */}
                <div className="sticky top-0 z-30 w-full flex flex-wrap justify-center gap-2 md:gap-4 p-4 bg-black/50 backdrop-blur-md border-b border-white/10 shadow-lg">
                  <button
                    onClick={() => handlePrint()}
                    className="bg-white/10 border border-white/20 text-white px-4 md:px-6 py-2 rounded-lg shadow-lg hover:bg-white/20 transition font-medium text-sm md:text-base"
                  >
                    Print
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition font-medium text-sm md:text-base"
                  >
                    Download PDF
                  </button>
                  <Link
                    href={`/edit/${selectedInvoice.id}`}
                    className="bg-yellow-500 text-white px-4 md:px-6 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition font-medium flex items-center justify-center text-sm md:text-base"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(selectedInvoice.id)}
                    className="bg-red-500 border border-red-500/50 text-white px-4 md:px-6 py-2 rounded-lg shadow-lg hover:bg-red-600 transition font-medium text-sm md:text-base"
                  >
                    Delete
                  </button>
                </div>
                
                {/* Scrollable invoice area */}
                <div className="flex-1 overflow-auto custom-scrollbar w-full bg-black/20">
                  <div className="w-full min-w-fit flex justify-center p-4 md:p-8">
                    <div className="shadow-2xl shadow-black/50 rounded-sm">
                      <InvoiceTemplate ref={printRef} invoice={selectedInvoice} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/70 text-lg flex items-center justify-center h-full w-full">Select an invoice to preview</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
