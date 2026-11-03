// Fills the family's fillable menu PDF template with the live food sign-up list.
// Dishes already written on the original PDF are always kept, even when nobody
// has signed up for them on the website yet.
import { PDFDocument, StandardFonts } from 'pdf-lib';

export const TEMPLATE_PATH = '/data/Lane_Family_Thanksgiving_Editable_Menu_Blank_Bottom_Section.pdf';

const SECTIONS = [
  { prefix: 'meat', count: 13, categories: ['Main Dish'] },
  { prefix: 'side', count: 13, categories: ['Side Dish'] },
  { prefix: 'dessert', count: 13, categories: ['Dessert'] },
  { prefix: 'combined', count: 12, categories: ['Appetizer', 'Drinks', 'Other'] },
];

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function readField(form, name) {
  try {
    return (form.getTextField(name).getText() || '').trim();
  } catch {
    return '';
  }
}

function writeField(form, name, value) {
  try {
    form.getTextField(name).setText(value || '');
    return true;
  } catch {
    return false;
  }
}

export async function buildMenuPdf(templateBytes, menuItems) {
  const pdf = await PDFDocument.load(templateBytes);
  const form = pdf.getForm();

  // 1. Start from every dish already on the PDF so nothing gets dropped.
  const sections = SECTIONS.map((section) => {
    const list = [];
    for (let i = 1; i <= section.count; i++) {
      const dish = readField(form, `${section.prefix}_${i}_item`);
      const name = readField(form, `${section.prefix}_${i}_name`);
      if (dish || name) list.push({ dish, names: name ? [name] : [] });
    }
    return { ...section, list };
  });

  // 2. Merge in the live sign-ups: update who is bringing a dish, or add new dishes.
  const overflow = [];
  for (const item of menuItems || []) {
    const dish = String(item.dish || '').trim();
    const person = String(item.name || '').trim();
    if (!dish) continue;
    const key = normalize(dish);

    let row;
    for (const section of sections) {
      row = section.list.find((r) => normalize(r.dish) === key);
      if (row) break;
    }

    if (!row) {
      const section = sections.find((s) => s.categories.includes(item.category)) || sections[3];
      const label = section.prefix === 'combined' && item.category && item.category !== 'Other'
        ? `${dish} (${item.category})`
        : dish;
      row = { dish: label, names: [] };
      if (section.list.length < section.count) {
        section.list.push(row);
      } else {
        overflow.push(row);
      }
    }

    // A sign-up on the website is the most current info about who is bringing it.
    if (person) {
      row.fromSite = row.fromSite || [];
      if (!row.fromSite.some((n) => normalize(n) === normalize(person))) row.fromSite.push(person);
    }
  }

  // 3. Write everything back into the form fields.
  for (const section of sections) {
    for (let i = 1; i <= section.count; i++) {
      const row = section.list[i - 1];
      const names = row ? (row.fromSite?.length ? row.fromSite : row.names) : [];
      writeField(form, `${section.prefix}_${i}_item`, row?.dish || '');
      writeField(form, `${section.prefix}_${i}_name`, names.join(' & '));
    }
  }

  const existingNotes = readField(form, 'notes_updates');
  const extra = overflow.map((r) => {
    const names = r.fromSite?.length ? r.fromSite : r.names;
    return names.length ? `${r.dish} — ${names.join(' & ')}` : r.dish;
  });
  if (extra.length) {
    writeField(form, 'notes_updates', [existingNotes, `Also on the menu: ${extra.join('; ')}`].filter(Boolean).join('\n'));
  }

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  form.updateFieldAppearances(font);
  return pdf.save({ useObjectStreams: false });
}
