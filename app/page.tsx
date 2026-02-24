'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { InvoiceWithItems } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Home() {
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
          windowWidth: pageNode.scrollWidth,
          windowHeight: pageNode.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = pdfWidth / imgWidth;
        const imgHeightInPdf = imgHeight * ratio;

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInPdf);
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tally Copy - Invoice Manager</h1>
          <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create New Invoice
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Invoice List */}
          <div className="bg-white p-6 rounded shadow col-span-1 h-[80vh] overflow-y-auto text-black">
            <h2 className="text-xl font-semibold mb-4 text-black">Recent Invoices</h2>
            {invoices.length === 0 && <p className="text-gray-900">No invoices found.</p>}
            <ul className="space-y-4">
              {invoices.map((inv) => (
                <li
                  key={inv.id}
                  className={`border p-4 rounded cursor-pointer hover:bg-gray-200 ${selectedInvoice?.id === inv.id ? 'border-blue-500 bg-blue-50' : ''}`}
                  onClick={() => setSelectedInvoice(inv)}
                >
                  <div className="flex justify-between">
                    <span className="font-bold">{inv.invoicenumber}</span>
                    <span className="text-xs text-gray-500">{formatDate(inv.date)}</span>
                  </div>
                  <div className="text-sm text-gray-600 truncate">{inv.customername}</div>
                  <div className="font-semibold text-right mt-2">
                    ₹{inv.items.reduce((s, i) => s + i.totalprice, 0).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Invoice Preview */}
          <div className="col-span-2 bg-gray-200 p-8 flex flex-col items-center justify-center rounded border overflow-auto h-[110vh] lg:w-[50vw] w-[180vw]">
            {selectedInvoice ? (
              <div className="w-full flex flex-col items-center lg:mt-250 mt-350">
                <div className="flex gap-4 mt-400">
                  <button
                    onClick={() => handlePrint()}
                    className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-gray-900"
                  >
                    Print
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
                  >
                    Download PDF
                  </button>
                </div>
                <div className="scale-75 origin-top shadow-lg">
                  {/* Render the template for viewing */}
                  <InvoiceTemplate ref={printRef} invoice={selectedInvoice} />
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-lg">Select an invoice to preview</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
