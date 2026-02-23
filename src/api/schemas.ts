export type GoogleBooksVolumesResponse = {
  totalItems?: number;
  items?: Array<{
    id: string;
    volumeInfo: {
      title?: string;
      authors?: string[];
      publishedDate?: string;
      description?: string;
      pageCount?: number;
      categories?: string[];
      language?: string;
      previewLink?: string;
      infoLink?: string;
      industryIdentifiers?: { type: string; identifier: string }[];
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
      };
    };
  }>;
};
