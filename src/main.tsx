import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import { App } from './App';
import { bootstrapAuth } from '@lib/auth/bootstrap';
import { AUTH_LOGOUT_EVENT } from '@lib/api/client';
import { useAuthStore } from '@store/authStore';
import { ROUTES } from '@/config/constants';
import { initSentry } from '@lib/sentry';

window.addEventListener(AUTH_LOGOUT_EVENT, () => {
  useAuthStore.getState().clear();
  if (window.location.pathname !== ROUTES.login) {
    window.location.assign(ROUTES.login);
  }
});

void initSentry();

void bootstrapAuth().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
