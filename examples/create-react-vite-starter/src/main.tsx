import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import LegitProviderComponent from './LegitProviderComponent';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LegitProviderComponent>
      <App />
    </LegitProviderComponent>
  </StrictMode>
);
