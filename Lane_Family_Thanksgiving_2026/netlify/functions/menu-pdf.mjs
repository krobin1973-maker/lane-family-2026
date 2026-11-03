// Serves the Thanksgiving menu PDF filled in with the current food sign-ups.
// Dishes already on the original PDF are kept even if no one has claimed them online.
import { getMenu } from '../lib/menu-data.mjs';
import { buildMenuPdf, TEMPLATE_PATH } from '../lib/menu-pdf.mjs';

export default async function handler(request) {
  const templateUrl = new URL(TEMPLATE_PATH, request.url);
  const templateResponse = await fetch(templateUrl);
  if (!templateResponse.ok) {
    return new Response('Menu PDF is unavailable right now.', { status: 502 });
  }
  const templateBytes = await templateResponse.arrayBuffer();

  let items = [];
  try {
    items = await getMenu();
  } catch (error) {
    // Still return the menu with the dishes already on the PDF.
    console.error('Menu PDF sign-up lookup failed:', error.message);
  }

  try {
    const bytes = await buildMenuPdf(templateBytes, items);
    return new Response(bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Lane_Family_Thanksgiving_Menu_2026.pdf"',
        'Cache-Control': 'public, max-age=0, s-maxage=30',
      },
    });
  } catch (error) {
    console.error('Menu PDF build failed:', error.message);
    return Response.redirect(templateUrl, 302);
  }
}

export const config = { path: '/data/thanksgiving-menu.pdf' };
