import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  fileUrl: string;
  display: 'cover' | 'paginated' | 'full';
  title: string;
}

export default function PdfViewer({ fileUrl, display, title }: PdfViewerProps): React.JSX.Element {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  const downloadLink = (
    <a
      href={fileUrl}
      download
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
      style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
    >
      ⬇ Download PDF
    </a>
  );

  // ── FULL mode: all pages stacked, no modal ────────────────────────────────
  if (display === 'full') {
    return (
      <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: '1px solid hsl(var(--primary) / 0.3)' }}>
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: 'hsl(var(--primary))' }}
        >
          <span className="font-black text-sm" style={{ color: 'hsl(var(--primary-foreground))' }}>
            {title} · {numPages ? `${numPages} pages` : '…'}
          </span>
          {downloadLink}
        </div>
        {/* All pages */}
        <div
          className="flex flex-col items-center gap-4 p-6"
          style={{ background: 'hsl(var(--background))' }}
        >
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages: n }: { numPages: number }) => setNumPages(n)}
            loading={
              <div className="h-64 flex items-center justify-center text-muted-foreground font-semibold">
                Loading PDF…
              </div>
            }
            error={
              <div className="h-32 flex flex-col items-center justify-center gap-3">
                <p className="text-muted-foreground text-sm">Could not load PDF</p>
                {downloadLink}
              </div>
            }
          >
            {Array.from({ length: numPages }, (_: unknown, i: number) => (
              <div key={i} className="shadow-lg rounded overflow-hidden w-full">
                <Page
                  pageNumber={i + 1}
                  width={typeof window !== 'undefined' ? Math.min(760, window.innerWidth - 80) : 760}
                />
              </div>
            ))}
          </Document>
        </div>
        {/* Bottom download */}
        <div
          className="flex justify-center py-5"
          style={{ background: 'hsl(var(--muted))' }}
        >
          {downloadLink}
        </div>
      </div>
    );
  }

  // ── COVER mode: thumbnail + modal ────────────────────────────────────────
  if (display === 'cover') {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: 'hsl(var(--border))' }}>
        <button
          onClick={() => setOpen(true)}
          aria-label={`View ${title}`}
          className="w-full block hover:opacity-90 transition-opacity"
        >
          <Document
            file={fileUrl}
            loading={<div className="h-48 flex items-center justify-center text-muted-foreground">Loading…</div>}
            error={downloadLink}
          >
            <Page pageNumber={1} width={320} renderTextLayer={false} />
          </Document>
        </button>
        <div className="p-4 flex justify-center" style={{ background: 'hsl(var(--muted))' }}>
          {downloadLink}
        </div>
        {open && (
          <div
            role="dialog"
            aria-label={`${title} full view`}
            className="fixed inset-0 z-50 overflow-auto p-6 flex flex-col items-center"
            style={{ background: 'hsl(var(--hero-overlay) / 0.9)' }}
            onClick={(e: React.MouseEvent) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <button
              onClick={() => setOpen(false)}
              className="mb-4 px-4 py-2 rounded-full text-sm font-bold self-end"
              style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
            >
              ✕ Close
            </button>
            <Document
              file={fileUrl}
              onLoadSuccess={({ numPages: n }: { numPages: number }) => setNumPages(n)}
              error={downloadLink}
            >
              {Array.from({ length: numPages }, (_: unknown, i: number) => (
                <Page key={i} pageNumber={i + 1} width={Math.min(800, window.innerWidth - 48)} className="mb-4 shadow-xl rounded" />
              ))}
            </Document>
          </div>
        )}
      </div>
    );
  }

  // ── PAGINATED mode: one page at a time ───────────────────────────────────
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: 'hsl(var(--border))' }}>
      <div
        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold"
        style={{ background: 'hsl(var(--dark-text))', color: 'hsl(var(--cream))' }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          aria-label="Previous page"
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:opacity-80 transition-opacity"
          style={{ background: 'hsl(var(--primary))' }}
          disabled={page <= 1}
        >
          ‹
        </button>
        <span className="flex-1 text-center">
          Page {page} of {numPages || '…'}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(numPages, p + 1))}
          aria-label="Next page"
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:opacity-80 transition-opacity"
          style={{ background: 'hsl(var(--primary))' }}
          disabled={page >= numPages}
        >
          ›
        </button>
        <a
          href={fileUrl}
          download
          className="ml-2 px-3 py-1 rounded-full text-xs font-bold hover:opacity-80 transition-opacity"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
        >
          ⬇ Save
        </a>
      </div>
      <div className="flex justify-center p-4" style={{ background: 'hsl(var(--background))' }}>
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages: n }: { numPages: number }) => setNumPages(n)}
          loading={<div className="h-64 flex items-center justify-center text-muted-foreground">Loading PDF…</div>}
          error={
            <div className="h-32 flex flex-col items-center justify-center gap-3">
              <p className="text-muted-foreground text-sm">Could not load PDF</p>
              {downloadLink}
            </div>
          }
        >
          <Page pageNumber={page} width={Math.min(640, typeof window !== 'undefined' ? window.innerWidth - 80 : 640)} />
        </Document>
      </div>
    </div>
  );
}
