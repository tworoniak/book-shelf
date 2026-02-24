import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import BookSearchBar from '../components/books/BookSearchBar';
import BookGrid from '../components/books/BookGrid';
import ShelvesTabs from '../components/books/ShelvesTabs';
import AppLayout from '../components/layout/AppLayout';
import Header from '../components/layout/Header';

import { useBookSearch } from '../hooks/useBookSearch';
import { useShelves } from '../hooks/useShelves';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const search = useBookSearch(query);
  const shelves = useShelves();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppLayout
      header={
        <Header right={<BookSearchBar value={query} onChange={setQuery} />} />
      }
    >
      <main className='app__main'>
        <section className='panel'>
          <div className='panel__header'>
            <h2 className='panel__title'>Search Results</h2>

            <div className='panel__meta'>
              {search.error ? (
                <span className='badge badge--danger'>{search.error}</span>
              ) : search.isLoading ? (
                <span className='badge'>Loading…</span>
              ) : query.trim() ? (
                <span className='badge'>
                  {search.total.toLocaleString()} results
                </span>
              ) : (
                <span className='badge'>Type to search</span>
              )}
            </div>
          </div>

          <BookGrid
            books={search.books}
            onAdd={(book, shelf) => shelves.add(book, shelf)}
            onRemove={(id) => shelves.remove(id)}
            getShelfFor={(id) => shelves.getShelfFor(id)}
            onSelect={(id) =>
              navigate(`/book/${id}`, {
                state: { backgroundLocation: location },
              })
            }
          />

          {query.trim() && search.total > 0 && (
            <div className='pager'>
              <button
                className='btn'
                onClick={search.prevPage}
                disabled={search.isLoading || search.startIndex === 0}
              >
                Prev
              </button>

              <div className='pager__info'>
                Showing {search.startIndex + 1}–{' '}
                {Math.min(search.startIndex + search.pageSize, search.total)} of{' '}
                {search.total.toLocaleString()}
              </div>

              <button
                className='btn'
                onClick={search.nextPage}
                disabled={
                  search.isLoading ||
                  search.startIndex + search.pageSize >= search.total
                }
              >
                Next
              </button>
            </div>
          )}
        </section>

        <aside className='panel panel--sticky'>
          <div className='panel__header'>
            <h2 className='panel__title'>My Shelves</h2>

            <div className='panel__meta'>
              <span className='badge'>{shelves.items.length} saved</span>

              <button
                className='btn btn--ghost'
                onClick={shelves.clearAll}
                disabled={shelves.items.length === 0}
                title='Clear all shelves'
              >
                Clear
              </button>
            </div>
          </div>

          <ShelvesTabs
            items={shelves.items}
            onRemove={(id) => shelves.remove(id)}
            onMove={(id, shelf) => shelves.move(id, shelf)}
          />
        </aside>
      </main>
    </AppLayout>
  );
}
