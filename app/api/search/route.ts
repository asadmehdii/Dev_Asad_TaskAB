import { NextRequest, NextResponse } from 'next/server';
import faqsData from '@/data/faqs.json';

interface SearchResult {
  id: string;
  title: string;
  body: string;
  score: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json(
        { error: 'Query parameter is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const results = faqsData.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const bodyLower = item.body.toLowerCase();
      
      searchTerms.forEach(term => {
        if (titleLower.includes(term)) {
          score += 3;
          if (titleLower.split(' ').includes(term)) {
            score += 2;
          }
        }
        
        if (bodyLower.includes(term)) {
          score += 1;
          if (bodyLower.split(' ').includes(term)) {
            score += 1;
          }
        }
      });
      
      return {
        ...item,
        score
      };
    });
    
    const topMatches = results
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    if (topMatches.length === 0) {
      return NextResponse.json({
        results: [],
        message: 'No matches found for your search query'
      });
    }
    
    const finalResults = topMatches.map(({ score, ...item }) => item);
    
    let summary = '';
    let sources: string[] = [];
    
    if (topMatches.length > 0) {
      const summaryParts = topMatches.map(item => {
        const snippet = item.body.substring(0, 60) + (item.body.length > 60 ? '...' : '');
        return snippet;
      });
      
      summary = `Based on your search, here are the key findings: ${summaryParts.join(' Additionally, ')}`;
      sources = topMatches.map(item => item.id);
    }
    
    return NextResponse.json({
      results: finalResults,
      summary,
      sources
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
