export type Book = {
  id: string;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  isbn13?: string;
};
