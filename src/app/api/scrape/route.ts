import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright-core';

export const config = {
  runtime: 'edge', // Usa el runtime Edge para mejor compatibilidad
  regions: ['iad1'], // Región recomendada para serverless con binaries pesados
};

export async function POST(req: NextRequest) {
  let browser;
  try {
    const { url } = await req.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    // Configuración para Vercel
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necesario para entornos serverless
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, // Path del Chromium en Vercel
    });

    const page = await browser.newPage();
    
    // Configura timeout y espera a eventos específicos
    await page.goto(url);
    
    // Espera a elementos dinámicos antes de extraer datos
    await page.waitForSelector('div.d1isfkwk', { timeout: 5000 });
    
    // Extracción de datos optimizada
    const [title, description, price, photos] = await Promise.all([
      page.title(),
      page.$eval('div.d1isfkwk', el => el.textContent?.trim() || ''),
      'No disponible',
      page.$$eval('img', imgs => 
        imgs.map(img => img.src).filter(src => src.includes('im/pictures/'))
      )
    ]);

    return NextResponse.json({ 
      title, 
      description, 
      price: price.replace(/\D/g, ''), // Ejemplo: limpia formato de precio
      photos: photos.slice(0, 10) // Limita a 5 imágenes
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close(); // Cierra el navegador en cualquier caso
  }
}

// Validación básica de URL
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}