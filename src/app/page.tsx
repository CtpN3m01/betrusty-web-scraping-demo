'use client';

import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { saveAs } from 'file-saver';
import Image from 'next/image';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface ScrapeResult {
  title: string;
  description: string | null;
  photos: string[];
  price: string;
}

export default function Home() {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setError('');
    setResult(null);
    setIsLoading(true);

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImages = () => {
    if (result?.photos) {
      const sanitizedTitle = result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      result.photos.forEach((photoUrl, index) => {
        const fileExtension = photoUrl.split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `${sanitizedTitle}_image${index + 1}.${fileExtension}`;
        saveAs(photoUrl, fileName);
      });
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

      {isLoading && <LoadingSpinner />}

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
          <p className="mb-2">{result.description}</p>
          <p className="mb-4">Price: {result.price}</p>
          {result.photos.length > 0 ? (
            <div className="h-64">
              <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={3000}>
                {result.photos.map((photo) => (
                  <Image
                    key={photo} // Usamos la URL de la foto como key
                    src={photo}
                    alt={`Slide ${photo}`}
                    width={720} 
                    height={480} 
                    className="w-full h-full object-cover"
                  />
                ))}
              </Carousel>
              <div className="flex justify-center mt-2">
              <button
                onClick={downloadImages}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Download Images
              </button>
            </div>
            </div>
          )
          : (<p>No photos found</p>)}
        </div>
      )}
    </div>
  );
}
