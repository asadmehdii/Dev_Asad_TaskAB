# Dev Assessment - Full-Stack Search & Scraper

A full-stack application implementing a search interface and web scraper built with Next.js, TypeScript, and Playwright.

## Overview

This project contains two main features:
- **Task A**: A search interface that queries a local FAQ dataset
- **Task B**: A web scraper that extracts page metadata

## Note to Reviewers

This repository contains **both Task A and Task B** in a single integrated full-stack application, demonstrating end-to-end implementation skills.

- **Task A (Search)**: Located in `app/api/search/` and search UI components
- **Task B (Scraper)**: Located in `app/api/scrape/` and scraper UI components

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── search/
│   │   │   └── route.ts      # Search API endpoint
│   │   └── scrape/
│   │       └── route.ts      # Scraper API endpoint
│   ├── page.tsx             # Main page with tab interface
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── SearchInterface.tsx   # Search UI component
│   └── ScraperInterface.tsx  # Scraper UI component
├── data/
│   └── faqs.json            # FAQ dataset
├── public/                  # Static assets
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd dev-assessment
```

2. Install dependencies:
```bash
npm i
```

3. Install Playwright browsers (required for scraper):
```bash
npx playwright install chromium
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Documentation

### Task A: Search Endpoint

**POST** `/api/search`

#### Request Body
```json
{
  "query": "trust badges"
}
```

#### Success Response (200)
```json
{
  "results": [
    {
      "id": "1",
      "title": "Trust badges near CTA",
      "body": "Adding trust badges near the primary CTA increased signups by 12%."
    }
  ],
  "summary": "Based on your search, here are the key findings...",
  "sources": ["1", "2", "3"]
}
```

#### Error Response (400)
```json
{
  "error": "Query parameter is required and cannot be empty"
}
```

### Task B: Scraper Endpoint

**GET** `/api/scrape?url=https://example.com`

#### Query Parameters
- `url` (required): The URL to scrape

#### Success Response (200)
```json
{
  "title": "Example Domain",
  "metaDescription": "Example Domain. This domain is for use in illustrative examples...",
  "h1": "Example Domain",
  "status": 200
}
```

#### Error Responses
- `400`: Invalid or missing URL
- `504`: Timeout (20 seconds)
- `500`: Scraping failed

## Features Implemented

### Task A - Search
- ✅ Keyword-based search with relevance scoring
- ✅ Returns top 3 matches ordered by relevance
- ✅ Case-insensitive search
- ✅ Empty query validation (400 error)
- ✅ Loading, empty, and error states in UI
- ✅ **Bonus**: Summary generation from top results
- ✅ **Bonus**: Sources field showing result IDs

### Task B - Scraper
- ✅ Extracts title, meta description, and first H1
- ✅ 20-second timeout implementation
- ✅ Waits for network idle state
- ✅ Proper error handling and status codes
- ✅ **Bonus**: Custom user-agent override
- ✅ **Bonus**: Retry mechanism for failed navigations

## Technical Decisions

### Search Implementation
- Used term frequency scoring with weighted matches
- Title matches are weighted 3x more than body matches
- Exact word matches receive bonus points
- Results are filtered and sorted by relevance score

### Scraper Implementation
- Playwright chosen for reliability with JavaScript-heavy sites
- Headless Chromium for minimal resource usage
- Fallback to `og:description` for meta descriptions
- Retry logic for transient network failures

## Testing

The application has been tested with:

### Search Tests
- "trust badges" - Returns item 1 as top result ✓
- "form" - Returns relevant form-related results ✓
- Empty query - Returns 400 error ✓
- No matches - Returns empty array with message ✓

### Scraper Tests
- Valid URLs (example.com, google.com) ✓
- Invalid URLs - Returns 400 error ✓
- Timeout simulation - Returns 504 error ✓
- Sites with/without meta descriptions ✓

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Assumptions Made

1. **Search**: Simple keyword matching is sufficient (no fuzzy matching needed)
2. **Scraper**: First H1 tag is the most relevant heading
3. **Performance**: No caching implemented as this is a demo
4. **Security**: Basic URL validation prevents SSRF attacks
5. **Browser**: Chromium is sufficient for scraping needs

## Known Limitations

- Search is limited to exact keyword matches
- Scraper may fail on sites with aggressive bot protection
- No rate limiting implemented
- Summary generation is basic string concatenation

## Development Notes

Built and tested on Windows with Node.js v18. The scraper has been tested with various sites and handles most common page structures well. 

The search algorithm prioritizes title matches over body matches, which works well for the provided dataset but might need adjustment for different content types.