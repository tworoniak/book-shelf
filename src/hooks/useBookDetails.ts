import { useEffect, useState } from 'react';
import type { Book } from '../types/book';
import { getBookById } from '../services/googleBooks';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Something went wrong';
}

function isAbortError(err: unknown) {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.name === 'AbortError')
  );
}

export function useBookDetails(bookId: string | null) {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) {
      setBook(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getBookById(bookId, controller.signal);
        setBook(data);
      } catch (err: unknown) {
        if (isAbortError(err)) return;
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [bookId]);

  return { book, isLoading, error };
}
