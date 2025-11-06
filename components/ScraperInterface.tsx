'use client';

import { useState } from 'react';

interface ScrapeResult {
  title: string;
  metaDescription: string;
  h1: string;
  status: number;
}

export default function ScraperInterface() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState('');

  const handleScrape = async () => {
    //  validation
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to scrape the page');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error - could not connect to the scraper');
      console.error('Scrape error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScrape();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Web Page Scraper</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This scraper extracts basic page information. 
          It may take up to 20 seconds for complex pages.
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a URL (e.g. https://example.com)..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />
        <button
          onClick={handleScrape}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
          <p className="text-gray-600">Scraping page... This may take a moment.</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Scrape Results
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Title:</label>
              <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded">
                {result.title || '(No title found)'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Meta Description:</label>
              <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded">
                {result.metaDescription || '(No description found)'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">H1 Heading:</label>
              <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded">
                {result.h1 || '(No H1 found)'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status:</label>
              <p className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  result.status === 200 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <p>Try these test URLs:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>https://example.com</li>
          <li>https://www.google.com</li>
          <li>https://github.com</li>
        </ul>
      </div>
    </div>
  );
}
