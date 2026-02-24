import type { ReactNode } from 'react';

type Props = {
  right?: ReactNode;
};

export default function Header({ right }: Props) {
  return (
    <>
      <div className='app__brand'>
        <div className='app__title'>Book Shelf</div>
        <div className='app__subtitle'>Google Books search + your shelves</div>
      </div>

      {right}
    </>
  );
}
