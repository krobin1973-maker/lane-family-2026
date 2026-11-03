// A read-only snapshot of the existing live menu. Does not alter the food list,
// Netlify Forms, the organizer edits, or the original editable menu PDF.
import { getMenu } from '../lib/menu-data.mjs';

const CATEGORIES = ['Main Dish', 'Side Dish', 'Dessert', 'Appetizer', 'Drinks', 'Other'];

function ascii(value) {
  return String(value ?? '').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x20-\x7e]/g, '?');
}

function pdfEscape(value) {
  return ascii(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapText(value, maxLength = 77) {
  const words = ascii(value).trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (let word of words) {
    while (word.length > maxLength) {
      if (line) { lines.push(line); line = ''; }
      lines.push(word.slice(0, maxLength));
      word = word.slice(maxLength);
    }
    if (!word) continue;
    if (!line) line = word;
    else if (line.length + 1 + word.length <= maxLength) line += ' ' + word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function createPdf(items) {
  const pages = [];
  let commands = [];
  let y = 0;
  const text = (value, x, pos, size = 10, bold = false) => {
    commands.push('0.14 0.12 0.10 rg');
    commands.push('BT /F' + (bold ? 2 : 1) + ' ' + size + ' Tf 1 0 0 1 ' + x + ' ' + pos + ' Tm (' + pdfEscape(value) + ') Tj ET');
  };
  const newPage = () => {
    if (commands.length) pages.push(commands.join('\n'));
    commands = [];
    commands.push('0.18 0.27 0.20 rg 0 752 612 40 re f');
    commands.push('1 1 1 rg');
    commands.push('BT /F2 13 Tf 1 0 0 1 48 765 Tm (LANE FAMILY TAKES ST. LOUIS) Tj ET');
    text('Thanksgiving 2026 - Who Is Bringing What?', 48, 715, 19, true);
    text('Live family sign-up list - updated each time this PDF is downloaded', 48, 691, 10);
    text('November 25-29, 2026', 48, 675, 10);
    commands.push('0.77 0.55 0.24 rg 48 660 516 2 re f');
    y = 636;
  };
  newPage();
  for (const category of CATEGORIES) {
    const group = items.filter(item => (CATEGORIES.includes(item.category) ? item.category : 'Other') === category);
    if (!group.length) continue;
    if (y < 140) newPage();
    commands.push('0.92 0.92 0.87 rg 48 ' + (y - 9) + ' 516 27 re f');
    text(category + ' (' + group.length + ')', 57, y, 12, true);
    y -= 35;
    for (const item of group) {
      const dishLines = wrapText(item.dish, 78);
      const person = 'Bringing it: ' + (item.name || 'Not specified') + (item.serves ? '  |  Serves: ' + item.serves : '');
      const personLines = wrapText(person, 82);
      const height = dishLines.length * 14 + personLines.length * 13 + 14;
      if (y - height < 54) newPage();
      for (const line of dishLines) { text(line, 57, y, 11, true); y -= 14; }
      for (const line of personLines) { text(line, 67, y, 10); y -= 13; }
      commands.push('0.87 0.87 0.84 rg 57 ' + (y + 3) + ' 498 0.6 re f');
      y -= 14;
    }
    y -= 12;
  }
  if (items.length === 0) text('No food sign-ups are available yet.', 54, y, 12);
  pages.push(commands.join('\n'));

  const objects = [
    null,
    '<< /Type /Catalog /Pages 2 0 R >>',
    '',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ];
  const kids = [];
  pages.forEach((pageStream, i) => {
    const footer = '0.45 0.45 0.45 rg\nBT /F1 9 Tf 1 0 0 1 48 27 Tm (Lane Family Thanksgiving 2026  |  Page ' + (i + 1) + ' of ' + pages.length + ') Tj ET';
    const stream = pageStream + '\n' + footer + '\n';
    const streamId = objects.length;
    objects.push('<< /Length ' + Buffer.byteLength(stream, 'ascii') + ' >>\nstream\n' + stream + 'endstream');
    const pageId = objects.length;
    objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + streamId + ' 0 R >>');
    kids.push(pageId + ' 0 R');
  });
  objects[2] = '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + kids.length + ' >>';
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = Buffer.byteLength(pdf, 'ascii');
    pdf += i + ' 0 obj\n' + objects[i] + '\nendobj\n';
  }
  const xref = Buffer.byteLength(pdf, 'ascii');
  pdf += 'xref\n0 ' + objects.length + '\n0000000000 65535 f \n';
  for (let i = 1; i < objects.length; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size ' + objects.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
  return Buffer.from(pdf, 'ascii');
}

export default async function handler(request) {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }
  try {
    const items = await getMenu();
    if (!Array.isArray(items)) throw new Error('Menu data not available');
    const pdf = createPdf(items);
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Lane_Family_Thanksgiving_Current_Menu.pdf"',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Could not generate live family menu PDF:', error.message);
    return Response.json({ error: 'Unable to generate the latest menu. The original menu PDF is still available.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
