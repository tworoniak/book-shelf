import type { ShelfEntry, ShelfKey } from '../../types/shelf';

type Props = {
  items: ShelfEntry[];
  onRemove: (id: string) => void;
  onMove: (id: string, shelf: ShelfKey) => void;
};

export default function ShelfList({ items, onRemove, onMove }: Props) {
  if (!items.length) {
    return (
      <div className='empty empty--compact'>
        <div className='empty__title'>Nothing here yet</div>
        <div className='empty__text'>Add books from search results.</div>
      </div>
    );
  }

  return (
    <ul className='shelf'>
      {items.map((b) => (
        <li key={b.id} className='shelf__item'>
          <div className='shelf__left'>
            {b.thumbnail ? (
              <img className='shelf__thumb' src={b.thumbnail} alt='' />
            ) : (
              <div className='shelf__thumb shelf__thumb--fallback' />
            )}

            <div className='shelf__info'>
              <div className='shelf__title'>{b.title}</div>
              <div className='shelf__authors'>
                {b.authors.length ? b.authors.join(', ') : 'Unknown author'}
              </div>
            </div>
          </div>

          <div className='shelf__right'>
            <select
              className='select'
              value={b.shelf}
              onChange={(e) => onMove(b.id, e.target.value as ShelfKey)}
              aria-label='Move shelf'
            >
              <option value='want'>Want</option>
              <option value='reading'>Reading</option>
              <option value='read'>Read</option>
            </select>

            <button
              className='btn btn--small btn--danger'
              onClick={() => onRemove(b.id)}
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
