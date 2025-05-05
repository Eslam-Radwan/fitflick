import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Removed the import of index.css as we're using globals.css from our styles folder

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
