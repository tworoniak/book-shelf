import { Routes, Route, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import BookDetailsRouteModal from './components/books/BookDetailsRouteModal';

type LocationState = {
  backgroundLocation?: Location;
};

export default function App() {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      {/* Primary routes: render Home behind the modal if backgroundLocation exists */}
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<HomePage />} />
        <Route path='/book/:id' element={<BookDetailsPage />} />
      </Routes>

      {/* Modal routes: only render when we have background */}
      {backgroundLocation && (
        <Routes>
          <Route path='/book/:id' element={<BookDetailsRouteModal />} />
        </Routes>
      )}
    </>
  );
}
