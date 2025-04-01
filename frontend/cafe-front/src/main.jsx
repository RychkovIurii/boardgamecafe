import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import AuthProvider from '../context/AuthContext';

createRoot(document.getElementById('root')).render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
);
