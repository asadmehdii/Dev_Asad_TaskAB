import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  // Validate URL parameter
  if (!url) {
    return NextResponse.json(
      { error: 'Invalid URL' },
      { status: 400 }
    );
  }

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: 'Invalid URL' },
      { status: 400 }
    );
  }

  let browser = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    page.setDefaultTimeout(20000);

    try {
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 20000 
      });

      const title = await page.title();
      
      const metaDescription = await page.evaluate(() => {
        const metaTag = document.querySelector('meta[name="description"]') || 
                       document.querySelector('meta[property="og:description"]');
        return metaTag ? metaTag.getAttribute('content') || '' : '';
      });

      const h1 = await page.evaluate(() => {
        const h1Element = document.querySelector('h1');
        return h1Element ? h1Element.textContent?.trim() || '' : '';
      });

      await browser.close();

      return NextResponse.json({
        title,
        metaDescription,
        h1,
        status: 200
      });

    } catch (navigationError: any) {
      if (navigationError.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Timeout' },
          { status: 504 }
        );
      }
      
      try {
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 20000 
        });

        const title = await page.title();
        const metaDescription = await page.evaluate(() => {
          const metaTag = document.querySelector('meta[name="description"]') || 
                         document.querySelector('meta[property="og:description"]');
          return metaTag ? metaTag.getAttribute('content') || '' : '';
        });
        const h1 = await page.evaluate(() => {
          const h1Element = document.querySelector('h1');
          return h1Element ? h1Element.textContent?.trim() || '' : '';
        });

        await browser.close();

        return NextResponse.json({
          title,
          metaDescription,
          h1,
          status: 200
        });

      } catch (retryError) {
        throw retryError;
      }
    }

  } catch (error: any) {
    if (browser) {
      await browser.close();
    }

    if (error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Timeout' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to scrape the page' },
      { status: 500 }
    );
  }
}
