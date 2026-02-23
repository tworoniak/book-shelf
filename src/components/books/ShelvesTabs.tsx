import { useMemo, useState } from 'react';
import type { ShelfEntry, ShelfKey } from '../../types/shelf';
import ShelfList from './ShelfList';

type Props = {
  items: ShelfEntry[];
  onRemove: (id: string) => void;
  onMove: (id: string, shelf: ShelfKey) => void;
};

const tabs: Array<{ key: ShelfKey; label: string }> = [
  { key: 'want', label: 'Want to Read' },
  { key: 'reading', label: 'Reading' },
  { key: 'read', label: 'Read' },
];

export default function ShelvesTabs({ items, onRemove, onMove }: Props) {
  const [active, setActive] = useState<ShelfKey>('want');

  const grouped = useMemo(() => {
    const want: ShelfEntry[] = [];
    const reading: ShelfEntry[] = [];
    const read: ShelfEntry[] = [];

    for (const item of items) {
      if (item.shelf === 'want') want.push(item);
      if (item.shelf === 'reading') reading.push(item);
      if (item.shelf === 'read') read.push(item);
    }

    // newest first
    want.sort((a, b) => b.addedAt - a.addedAt);
    reading.sort((a, b) => b.addedAt - a.addedAt);
    read.sort((a, b) => b.addedAt - a.addedAt);

    return { want, reading, read };
  }, [items]);

  const current = grouped[active];

  return (
    <div className='tabs'>
      <div className='tabs__list' role='tablist' aria-label='Book shelves'>
        {tabs.map((t) => {
          const count = grouped[t.key].length;
          const isActive = active === t.key;

          return (
            <button
              key={t.key}
              role='tab'
              aria-selected={isActive}
              className={`tabs__tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              {t.label} <span className='tabs__count'>{count}</span>
            </button>
          );
        })}
      </div>

      <div className='tabs__panel' role='tabpanel'>
        <ShelfList items={current} onRemove={onRemove} onMove={onMove} />
      </div>
    </div>
  );
}
