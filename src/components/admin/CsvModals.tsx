'use client';

import React, { useState } from 'react';

export function exportProductsToCsv(products: any[]) {
  if (!products || products.length === 0) {
    alert('No products to export.');
    return;
  }

  const headers = [
    'ID',
    'Name',
    'Slug',
    'Category',
    'Price_INR',
    'Stock_Status',
    'Purity',
    'Net_Weight_Grams',
    'Gross_Weight_Grams',
    'BIS_HUID',
    'Images'
  ];

  const rows = products.map(p => {
    const priceInr = Math.round(p.price / 100);
    const imagesStr = Array.isArray(p.images) ? p.images.join(' | ') : '';
    return [
      `"${p.id || ''}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.slug || ''}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      priceInr,
      `"${p.stock_status || 'in_stock'}"`,
      `"${p.purity || '22K'}"`,
      p.weight_grams || 10,
      p.gross_weight_grams || 10.5,
      `"${p.huid || ''}"`,
      `"${imagesStr.replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ambika_jewels_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: any[]) => Promise<void>;
  isImporting: boolean;
}

export function CsvImportModal({ isOpen, onClose, onImport, isImporting }: CsvImportModalProps) {
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);
    const reader = new FileReader();

    reader.onload = evt => {
      try {
        const text = evt.target?.result as string;
        if (!text) {
          setParseError('The uploaded file is empty.');
          return;
        }

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setParseError('CSV must contain a header row and at least one product row.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
        const nameIdx = headers.findIndex(h => h.includes('name'));
        const catIdx = headers.findIndex(h => h.includes('category'));
        const priceIdx = headers.findIndex(h => h.includes('price'));

        if (nameIdx === -1 || priceIdx === -1) {
          setParseError('CSV must include "Name" and "Price" columns.');
          return;
        }

        const items: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          // Simple regex-safe CSV row split
          const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
          const name = row[nameIdx];
          const rawPrice = parseFloat(row[priceIdx]);

          if (name && !isNaN(rawPrice) && rawPrice > 0) {
            items.push({
              name,
              category: (catIdx !== -1 && row[catIdx]) ? row[catIdx] : 'Necklaces',
              price: rawPrice.toString(),
              description: `Imported from catalog CSV batch on ${new Date().toLocaleDateString('en-IN')}`,
              stock_status: 'in_stock',
              images: ['/hero-clean.png']
            });
          }
        }

        if (items.length === 0) {
          setParseError('No valid product rows found in CSV.');
          return;
        }

        setParsedItems(items);
      } catch (err: any) {
        setParseError(`Failed to parse CSV file: ${err.message}`);
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (parsedItems.length === 0) return;
    await onImport(parsedItems);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[var(--border-color)]">
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--gold-primary)]">
              Import Products from CSV
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Upload a spreadsheet with Name, Category, and Price columns.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center bg-[var(--bg-primary)] hover:border-[var(--gold-primary)] transition-colors">
            <input
              type="file"
              accept=".csv,text/csv"
              id="csv-file-upload-input"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="csv-file-upload-input" className="cursor-pointer flex flex-col items-center space-y-2">
              <svg className="w-8 h-8 text-[var(--gold-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="font-medium text-xs text-[var(--text-primary)]">
                Select CSV Spreadsheet from Device
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Format: Name, Category, Price_INR, Stock_Status
              </p>
            </label>
          </div>

          {parseError && (
            <div className="p-3 bg-red-900/20 border border-red-500 text-red-300 text-xs rounded-lg">
              {parseError}
            </div>
          )}

          {parsedItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-emerald-500">✓ Parsed {parsedItems.length} Products Successfully</span>
                <button
                  type="button"
                  onClick={() => setParsedItems([])}
                  className="text-zinc-500 hover:text-zinc-300 text-[11px]"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto border border-[var(--border-color)] rounded-lg divide-y divide-[var(--border-color)] text-xs">
                {parsedItems.slice(0, 10).map((it, idx) => (
                  <div key={idx} className="p-2 flex justify-between bg-[var(--bg-primary)]">
                    <span className="font-medium text-[var(--text-primary)] truncate max-w-[200px]">{it.name}</span>
                    <span className="text-[var(--text-secondary)]">{it.category}</span>
                    <span className="font-mono text-[var(--gold-primary)]">₹{parseInt(it.price, 10).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                {parsedItems.length > 10 && (
                  <div className="p-2 text-center text-zinc-500 text-[11px] bg-[var(--bg-surface)]">
                    ...and {parsedItems.length - 10} more items
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[var(--border-color)] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={parsedItems.length === 0 || isImporting}
              onClick={handleConfirmImport}
              className="px-5 py-2 bg-[var(--gold-primary)] hover:opacity-90 text-black font-bold rounded-lg text-xs transition-all shadow disabled:opacity-50"
            >
              {isImporting ? 'Importing Products...' : `Import ${parsedItems.length} Products`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

