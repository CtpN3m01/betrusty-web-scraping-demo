'use client';

import { useState } from 'react';

interface ScrapeResult {
  title: string;
  description: string | null;
  headings: string[];
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Web Scraper Demo</h1>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          border: '1px solid #ccc',
          color: 'black',
        }}
      />
      <button
        onClick={fetchData}
        style={{
          backgroundColor: '#0070f3',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Fetch Info
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h2>Results:</h2>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Description:</strong> {result.description}</p>
          <h3>Headings:</h3>
          <ul>
            {result.headings.map((heading, index) => (
              <li key={index}>{heading}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
