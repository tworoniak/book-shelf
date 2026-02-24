import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/main.scss';
import { ShelvesProvider } from './context/ShelvesProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShelvesProvider>
        <App />
      </ShelvesProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
