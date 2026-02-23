import { useEffect, useMemo, useState } from 'react';
import type { Book } from '../types/book';
import { searchBooks } from '../api/googleBooks';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 20;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Something went wrong';
}

export function useBookSearch(query: string) {
  const q = useDebounce(query.trim(), 350);

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = useMemo(() => PAGE_SIZE, []);

  useEffect(() => {
    if (!q) {
      setBooks([]);
      setTotal(0);
      setStartIndex(0);
      setError(null);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await searchBooks(
          { q, startIndex: 0, maxResults: PAGE_SIZE },
          controller.signal,
        );

        setBooks(data.items);
        setTotal(data.total);
        setStartIndex(0);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [q]);

  async function goTo(index: number) {
    if (!q) return;

    const controller = new AbortController();
    try {
      setIsLoading(true);
      setError(null);

      const data = await searchBooks(
        { q, startIndex: index, maxResults: PAGE_SIZE },
        controller.signal,
      );

      setBooks(data.items);
      setStartIndex(index);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  function nextPage() {
    const next = startIndex + PAGE_SIZE;
    if (next >= total) return;
    void goTo(next);
  }

  function prevPage() {
    const prev = Math.max(0, startIndex - PAGE_SIZE);
    if (prev === startIndex) return;
    void goTo(prev);
  }

  return {
    books,
    total,
    startIndex,
    pageSize,
    isLoading,
    error,
    nextPage,
    prevPage,
  };
}
