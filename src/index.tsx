import React from 'react';
import ReactDOM from 'react-dom/client';
import AppTokPlatform from './apptok-platform';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppTokPlatform />
  </React.StrictMode>
);