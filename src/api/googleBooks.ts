import type { Book } from '../types/book';
import type { GoogleBooksVolumesResponse } from './schemas';

const API = 'https://www.googleapis.com/books/v1/volumes';

function pickIsbn13(
  ids?: { type: string; identifier: string }[],
): string | undefined {
  return ids?.find((x) => x.type === 'ISBN_13')?.identifier;
}

function toBook(
  item: NonNullable<GoogleBooksVolumesResponse['items']>[number],
): Book {
  const v = item.volumeInfo;

  const thumb =
    v.imageLinks?.thumbnail?.replace('http://', 'https://') ??
    v.imageLinks?.smallThumbnail?.replace('http://', 'https://');

  return {
    id: item.id,
    title: v.title ?? '(Untitled)',
    authors: v.authors ?? [],
    publishedDate: v.publishedDate,
    description: v.description,
    pageCount: v.pageCount,
    categories: v.categories,
    thumbnail: thumb,
    language: v.language,
    previewLink: v.previewLink,
    infoLink: v.infoLink,
    isbn13: pickIsbn13(v.industryIdentifiers),
  };
}

export type SearchParams = {
  q: string;
  startIndex?: number;
  maxResults?: number; // 1-40
};

export async function searchBooks(params: SearchParams, signal?: AbortSignal) {
  const key = import.meta.env.VITE_GOOGLE_BOOKS_KEY as string | undefined;

  const url = new URL(API);
  url.searchParams.set('q', params.q);
  url.searchParams.set('startIndex', String(params.startIndex ?? 0));
  url.searchParams.set('maxResults', String(params.maxResults ?? 20));
  url.searchParams.set(
    'fields',
    'totalItems,items(id,volumeInfo(title,authors,publishedDate,description,pageCount,categories,language,previewLink,infoLink,industryIdentifiers,imageLinks))',
  );
  if (key) url.searchParams.set('key', key);

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Google Books error: ${res.status}`);

  const data = (await res.json()) as GoogleBooksVolumesResponse;

  return {
    total: data.totalItems ?? 0,
    items: (data.items ?? []).map(toBook),
  };
}
