import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Inicia Playwright con Chromium
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navega a la página y espera a que se cargue todo el contenido dinámico
    await page.goto(url);

    // Extrae el título
    const title = await page.title();

    // Extrae la descripción (ajusta el selector según el HTML generado)
    const description = await page.$eval('div.d1isfkwk', el => el.textContent?.trim() || '');
    //const description = "description";
    // Extrae el precio (ajusta el selector según el HTML generado)
    //const price = await page.$eval('span[data-testid="price"]', el => el.textContent?.trim() || 'No price available');
    const price = "price";
    // Extrae las imágenes
    const photos = await page.$$eval('img', imgs =>
      imgs.map(img => img.src).filter(src => src.includes('im/pictures/hosting'))
    );

    await browser.close();

    return NextResponse.json({ title, description, price, photos });
  } catch (error: any) {
    console.error('Error during scraping:', error.message);
    return NextResponse.json({ error: 'Failed to scrape the URL', details: error.message }, { status: 500 });
  }
}
