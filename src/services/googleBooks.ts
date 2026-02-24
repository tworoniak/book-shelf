import type { Book } from '../types/book';

export type SearchParams = {
  q: string;
  startIndex?: number;
  maxResults?: number; // 1-40
};

type SearchResponse = {
  total: number;
  items: Book[];
};

async function readJsonOrThrow(res: Response) {
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    if (isJson) {
      const body = (await res.json()) as { error?: string };
      throw new Error(body.error ?? `Request failed: ${res.status}`);
    }
    throw new Error(`Request failed: ${res.status}`);
  }

  if (!isJson) {
    const preview = await res.text();
    throw new Error(
      `Expected JSON but got ${contentType || 'unknown'}. Preview: ${preview.slice(
        0,
        120,
      )}…`,
    );
  }

  return res.json();
}

export async function searchBooks(params: SearchParams, signal?: AbortSignal) {
  const url = new URL('/api/books', window.location.origin);
  url.searchParams.set('q', params.q);
  url.searchParams.set('startIndex', String(params.startIndex ?? 0));
  url.searchParams.set('maxResults', String(params.maxResults ?? 20));

  const res = await fetch(url.toString(), { signal });
  return (await readJsonOrThrow(res)) as SearchResponse;
}

export async function getBookById(
  id: string,
  signal?: AbortSignal,
): Promise<Book> {
  const url = new URL('/api/book', window.location.origin);
  url.searchParams.set('id', id);

  const res = await fetch(url.toString(), { signal });
  return (await readJsonOrThrow(res)) as Book;
}
