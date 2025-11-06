'use client';

import { useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  body: string;
}

interface SearchResponse {
  results: SearchResult[];
  summary?: string;
  sources?: string[];
  message?: string;
}

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);
    
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Something went wrong');
        setResults([]);
        setSummary('');
        setSources([]);
      } else {
        const data: SearchResponse = await res.json();
        setResults(data.results || []);
        setSummary(data.summary || '');
        setSources(data.sources || []);
        
        if (data.message) {
          setError(data.message);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to connect to the search service');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Knowledge Base</h2>
      
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for insights (try 'trust badges')..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={performSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          {summary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
              <p className="text-blue-800">{summary}</p>
              {sources.length > 0 && (
                <p className="text-sm text-blue-600 mt-2">
                  Sources: {sources.join(', ')}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Results ({results.length})
            </h3>
            {results.map((result, index) => (
              <div
                key={result.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <span className="text-sm text-gray-500 mr-3">#{index + 1}</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">
                      {result.title}
                    </h4>
                    <p className="text-gray-600">{result.body}</p>
                    <span className="text-xs text-gray-400 mt-2 inline-block">
                      ID: {result.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          <p>No results found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
