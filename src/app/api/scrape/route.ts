import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

interface ScrapeResponse {
  title: string;
  description: string | null;
  headings: string[];
}

const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export async function POST(req: Request): Promise<Response> {
  const { url }: { url: string } = await req.json();

  if (!url || !isValidUrl(url)) {
    return NextResponse.json(
      { error: 'Invalid URL' },
      { status: 400 }
    );
  }

  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);

    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || null;
    const headings = $('h1, h2, h3')
      .map((_, el) => $(el).text().trim())
      .get();

    const response: ScrapeResponse = { title, description, headings };

    return NextResponse.json(response);
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.statusText || 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch the URL: ${message}` },
      { status: statusCode }
    );
  }
}
