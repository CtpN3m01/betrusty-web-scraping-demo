import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extrae el título
    const title = await page.title();

    // Extrae la descripción completa
    const description = await page.$eval('div.d1isfkwk', el => el.textContent?.trim() || '');

    // Extrae el precio
    const price = await page.$eval('div._1jo4hgw', el => el.textContent?.trim() || '');

    // Extrae las URLs de las fotos que contienen 'im/pictures/miso/Hosting-'
    const photos = await page.$$eval('img', imgs =>
        imgs
        .map(img => img.src)
        .filter(src => src.includes('im/pictures/hosting'))
    );

    await browser.close();

    return NextResponse.json({ title, description, price, photos });
  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json({ error: 'Failed to scrape the URL' }, { status: 500 });
  }
}
