'use client';

import { useState } from 'react';
import SearchInterface from '../components/SearchInterface';
import ScraperInterface from '../components/ScraperInterface';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'scraper'>('search');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Developer Assessment
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Full-Stack Search & Scraper Implementation by Muhammad Asad
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Task A: Search
            </button>
            <button
              onClick={() => setActiveTab('scraper')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'scraper'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Task B: Scraper
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {activeTab === 'search' ? (
            <SearchInterface />
          ) : (
            <ScraperInterface />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Built with Next.js, TypeScript, and Playwright</p>
        </footer>
      </div>
    </main>
  );
}