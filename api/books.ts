import type { VercelRequest, VercelResponse } from '@vercel/node';
import { toBook, type GoogleVolumeItem } from './normalize'; // (see note below)

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

function num(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q)
      return res.status(400).json({ error: 'Missing required query param: q' });

    const startIndex = Math.max(0, num(req.query.startIndex, 0));
    const maxResults = Math.min(40, Math.max(1, num(req.query.maxResults, 20)));

    const key = process.env.GOOGLE_BOOKS_KEY;
    if (!key) {
      return res
        .status(500)
        .json({ error: 'Server misconfigured: GOOGLE_BOOKS_KEY not set' });
    }

    const upstream = new URL(GOOGLE_BOOKS_API);
    upstream.searchParams.set('q', q);
    upstream.searchParams.set('startIndex', String(startIndex));
    upstream.searchParams.set('maxResults', String(maxResults));
    upstream.searchParams.set(
      'fields',
      'totalItems,items(id,volumeInfo(title,authors,publishedDate,description,pageCount,categories,language,previewLink,infoLink,industryIdentifiers,imageLinks))',
    );
    upstream.searchParams.set('key', key);

    const response = await fetch(upstream.toString(), {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Google Books error: ${response.status}` });
    }

    const data = (await response.json()) as {
      totalItems?: number;
      items?: GoogleVolumeItem[];
    };

    const items = (data.items ?? []).map(toBook);

    res.setHeader('Cache-Control', 'max-age=0');
    res.setHeader(
      'CDN-Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400',
    );

    return res.status(200).json({ total: data.totalItems ?? 0, items });
  } catch (err) {
    console.error('api/books crash:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Unknown server error',
    });
  }
}
