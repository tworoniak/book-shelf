import type { Book } from '../src/types/book';

type IndustryIdentifier = { type?: string; identifier?: string };

type VolumeInfo = {
  title?: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  previewLink?: string;
  infoLink?: string;
  industryIdentifiers?: IndustryIdentifier[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
};

export type GoogleVolumeItem = {
  id: string;
  volumeInfo: VolumeInfo;
};

function pickIsbn13(ids?: IndustryIdentifier[]): string | undefined {
  const match = ids?.find((x) => x?.type === 'ISBN_13');
  return match?.identifier ?? undefined;
}

function httpsify(url?: string) {
  return url?.replace('http://', 'https://');
}

export function toBook(item: GoogleVolumeItem): Book {
  const v = item.volumeInfo ?? {};

  const thumb =
    httpsify(v.imageLinks?.thumbnail) ?? httpsify(v.imageLinks?.smallThumbnail);

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
