import type { ReactNode } from 'react';

type Props = {
  header?: ReactNode;
  children: ReactNode;
};

export default function AppLayout({ header, children }: Props) {
  return (
    <div className='app'>
      {header ? <header className='app__header'>{header}</header> : null}
      {children}
    </div>
  );
}
