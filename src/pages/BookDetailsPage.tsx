import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBookDetails } from '../hooks/useBookDetails';
import { useShelves } from '../hooks/useShelves';
import type { ShelfKey } from '../types/shelf';

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, '').trim();
}

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = id ?? null;

  const nav = useNavigate();
  const shelves = useShelves();
  const shelf = useMemo(
    () => (bookId ? shelves.getShelfFor(bookId) : null),
    [bookId, shelves],
  );

  const { book, isLoading, error } = useBookDetails(bookId);

  return (
    <div className='detailsPage'>
      <div className='detailsPage__header'>
        <button className='btn btn--ghost' onClick={() => nav(-1)}>
          ← Back
        </button>

        <div className='detailsPage__title'>Book Details</div>

        <div />
      </div>

      <div className='panel'>
        {error && <div className='notice notice--danger'>{error}</div>}
        {isLoading && <div className='notice'>Loading…</div>}

        {book && (
          <div className='details'>
            <div className='details__top'>
              <div className='details__cover'>
                {book.thumbnail ? (
                  <img src={book.thumbnail} alt={`Cover of ${book.title}`} />
                ) : (
                  <div className='details__coverFallback'>No cover</div>
                )}
              </div>

              <div className='details__meta'>
                <h3 className='details__bookTitle'>{book.title}</h3>

                <div className='details__authors'>
                  {book.authors.length
                    ? book.authors.join(', ')
                    : 'Unknown author'}
                </div>

                <div className='details__facts'>
                  {book.publishedDate && (
                    <span>Published: {book.publishedDate}</span>
                  )}
                  {book.pageCount && <span>Pages: {book.pageCount}</span>}
                  {book.language && (
                    <span>Lang: {book.language.toUpperCase()}</span>
                  )}
                </div>

                {book.categories?.length ? (
                  <div className='details__chips'>
                    {book.categories.slice(0, 6).map((c) => (
                      <span key={c} className='chip'>
                        {c}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className='details__actions'>
                  <button
                    className='btn'
                    onClick={() => shelves.add(book, 'want')}
                  >
                    Want to Read
                  </button>
                  <button
                    className='btn'
                    onClick={() => shelves.add(book, 'reading')}
                  >
                    Reading
                  </button>
                  <button
                    className='btn'
                    onClick={() => shelves.add(book, 'read')}
                  >
                    Read
                  </button>

                  {shelf && (
                    <button
                      className='btn btn--danger'
                      onClick={() => shelves.remove(book.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className='detailsPage__shelfMeta'>
                  {shelf ? (
                    <span className='badge'>On shelf: {labelShelf(shelf)}</span>
                  ) : (
                    <span className='badge'>Not on a shelf</span>
                  )}
                </div>

                {(book.previewLink || book.infoLink) && (
                  <div className='details__links'>
                    {book.previewLink && (
                      <a
                        href={book.previewLink}
                        target='_blank'
                        rel='noreferrer'
                      >
                        Preview
                      </a>
                    )}
                    {book.infoLink && (
                      <a href={book.infoLink} target='_blank' rel='noreferrer'>
                        Google Books
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {book.description ? (
              <div className='details__section'>
                <div className='details__sectionTitle'>Description</div>
                <p className='details__desc'>{stripHtml(book.description)}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function labelShelf(s: ShelfKey) {
  if (s === 'want') return 'Want to Read';
  if (s === 'reading') return 'Reading';
  return 'Read';
}
