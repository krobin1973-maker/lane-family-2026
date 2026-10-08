/**
 * Display family PDFs without a JavaScript PDF-rendering engine.
 *
 * The previous react-pdf viewer could throw during text-layer rendering on
 * mobile browsers and crash the entire homepage. Native PDF display and direct
 * file links keep the rest of the site (including RSVP) available even when
 * a browser cannot preview a PDF inline.
 */
interface PdfViewerProps {
  fileUrl: string;
  display: 'cover' | 'paginated' | 'full';
  title: string;
}

export default function PdfViewer({ fileUrl, display, title }: PdfViewerProps): React.JSX.Element {
  const openLink = (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-opacity hover:opacity-85"
      style={{ background: 'hsl(var(--golden))', color: 'hsl(var(--dark-text))' }}
    >
      📄 Open PDF
    </a>
  );

  const downloadLink = (
    <a
      href={fileUrl}
      download
      className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-opacity hover:opacity-85"
      style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
    >
      ⬇ Download PDF
    </a>
  );

  return (
    <div
      className="overflow-hidden rounded-2xl shadow-xl"
      style={{ border: '1px solid hsl(var(--primary) / 0.3)' }}
    >
      <div
        className="flex flex-col items-start justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center"
        style={{ background: 'hsl(var(--dark-text))', color: 'hsl(var(--cream))' }}
      >
        <span className="text-base font-black">{title}</span>
        <div className="flex flex-wrap gap-3">
          {openLink}
          {downloadLink}
        </div>
      </div>

      {display !== 'cover' && (
        <div className="w-full bg-white">
          <iframe
            src={fileUrl}
            title={`Preview of ${title}`}
            loading="lazy"
            className="block w-full border-0"
            style={{ height: display === 'full' ? '78vh' : '68vh', minHeight: '420px' }}
          />
        </div>
      )}

      <div
        className="px-5 py-4 text-center text-sm"
        style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}
      >
        If the preview does not appear on your phone, select “Open PDF” to view all pages.
      </div>
    </div>
  );
}
