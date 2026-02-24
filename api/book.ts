import type { VercelRequest, VercelResponse } from '@vercel/node';
import { toBook, type GoogleVolumeItem } from './_normalize';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

  const id = typeof req.query.id === 'string' ? req.query.id.trim() : '';
  if (!id)
    return res.status(400).json({ error: 'Missing required query param: id' });

  const key = process.env.GOOGLE_BOOKS_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'Server misconfigured: GOOGLE_BOOKS_KEY not set',
    });
  }

  const upstream = new URL(`${GOOGLE_BOOKS_API}/${encodeURIComponent(id)}`);
  upstream.searchParams.set(
    'fields',
    'id,volumeInfo(title,authors,publishedDate,description,pageCount,categories,language,previewLink,infoLink,industryIdentifiers,imageLinks)',
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

  const item = (await response.json()) as GoogleVolumeItem;

  res.setHeader('Cache-Control', 'max-age=0');
  res.setHeader(
    'CDN-Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800',
  );
  res.setHeader('x-books-api-version', '1');

  return res.status(200).json(toBook(item));
}
