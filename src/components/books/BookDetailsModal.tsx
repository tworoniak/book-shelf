import { useEffect } from 'react';
import type { Book } from '../../types/book';
import type { ShelfKey } from '../../types/shelf';
import { useBookDetails } from '../../hooks/useBookDetails';

type Props = {
  bookId: string | null;
  shelf: ShelfKey | null;
  onClose: () => void;
  onAdd: (book: Book, shelf: ShelfKey) => void;
  onRemove: (id: string) => void;
};

export default function BookDetailsModal({
  bookId,
  shelf,
  onClose,
  onAdd,
  onRemove,
}: Props) {
  const { book, isLoading, error } = useBookDetails(bookId);

  // close on ESC
  useEffect(() => {
    if (!bookId) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bookId, onClose]);

  // lock body scroll
  useEffect(() => {
    if (!bookId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [bookId]);

  if (!bookId) return null;

  return (
    <div
      className='modal'
      role='dialog'
      aria-modal='true'
      aria-label='Book details'
    >
      <button
        className='modal__backdrop'
        onClick={onClose}
        aria-label='Close modal'
      />

      <div className='modal__panel'>
        <div className='modal__header'>
          <div className='modal__title'>Book Details</div>
          <button className='btn btn--ghost' onClick={onClose}>
            Close
          </button>
        </div>

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
                  <button className='btn' onClick={() => onAdd(book, 'want')}>
                    Want to Read
                  </button>
                  <button
                    className='btn'
                    onClick={() => onAdd(book, 'reading')}
                  >
                    Reading
                  </button>
                  <button className='btn' onClick={() => onAdd(book, 'read')}>
                    Read
                  </button>

                  {shelf && (
                    <button
                      className='btn btn--danger'
                      onClick={() => onRemove(book.id)}
                    >
                      Remove
                    </button>
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
                {/* Google sometimes returns HTML-ish markup; keep it simple for MVP */}
                <p className='details__desc'>{stripHtml(book.description)}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, '').trim();
}
