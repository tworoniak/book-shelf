import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookDetailsPage from '../../pages/BookDetailsPage';

export default function BookDetailsRouteModal() {
  const nav = useNavigate();

  // ESC closes modal
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') nav(-1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nav]);

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className='modal'
      role='dialog'
      aria-modal='true'
      aria-label='Book details'
    >
      <button
        className='modal__backdrop'
        onClick={() => nav(-1)}
        aria-label='Close modal'
      />
      <div className='modal__panel'>
        <BookDetailsPage />
      </div>
    </div>
  );
}
