import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './app/routes';
import './styles/globals.css';

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
