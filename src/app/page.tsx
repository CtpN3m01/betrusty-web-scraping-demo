'use client';

import { useState } from 'react';
import { Carousel } from 'flowbite-react';

interface ScrapeResult {
  title: string;
  description: string | null;
  photos: string[];
}

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string>('');

  const fetchData = async () => {
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching data');
      }

      const data: ScrapeResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">BeTrusty - Web Scraper</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-md"
          style={{ color: 'black' }}
        />
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          Fetch Info
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
          <p className="mb-4">{result.description}</p>
          {result.photos.length > 0 && (
            <Carousel>
              {result.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              ))}
            </Carousel>
          )}
        </div>
      )}
    </div>
  );
}
