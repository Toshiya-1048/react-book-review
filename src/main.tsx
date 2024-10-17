import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store'; // Reduxストアをインポート
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* Reduxストアをプロバイダーでラップ */}
      <App />
    </Provider>
  </StrictMode>,
);