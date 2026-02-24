import { useEffect, useMemo, useRef, useState } from 'react';
import type { Book } from '../types/book';
import { searchBooks } from '../services/googleBooks';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 20;

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

export function useBookSearch(query: string) {
  const q = useDebounce(query.trim(), 350);

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = useMemo(() => PAGE_SIZE, []);

  // NEW: abort in-flight requests (pagination + new searches)
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!q) {
      inFlight.current?.abort();
      inFlight.current = null;

      setBooks([]);
      setTotal(0);
      setStartIndex(0);
      setError(null);
      setIsLoading(false);
      return;
    }

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

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
        if (isAbortError(err)) return;
        setError(getErrorMessage(err));
      } finally {
        // only clear loading if this is the latest request
        if (inFlight.current === controller) setIsLoading(false);
      }
    })();

    return () => {
      controller.abort();
      if (inFlight.current === controller) inFlight.current = null;
    };
  }, [q]);

  async function goTo(index: number) {
    if (!q) return;

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const data = await searchBooks(
        { q, startIndex: index, maxResults: PAGE_SIZE },
        controller.signal,
      );

      setBooks(data.items);
      setStartIndex(index);
      // (optional) keep total fresh in case API differs by page
      setTotal(data.total);
    } catch (err: unknown) {
      if (isAbortError(err)) return;
      setError(getErrorMessage(err));
    } finally {
      if (inFlight.current === controller) setIsLoading(false);
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
