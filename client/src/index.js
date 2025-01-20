import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'simplebar/src/simplebar.css';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';
import AuthProvider from 'contexts/AuthContext';
import * as Sentry from '@sentry/react';
import { getEnvs } from 'api/getEnv';
const { REACT_APP_API_PREFIX } = getEnvs();

Sentry.init({
  dsn: 'https://671e8e55a4069ee0261561cfcd17fefb@o4507859402096640.ingest.us.sentry.io/4508668072886272',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [
    'localhost',
    `${window.location.protocol}//${window.location.host}`,
    `${window.location.protocol}//${window.location.host}/${REACT_APP_API_PREFIX}`
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <AuthProvider>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReduxProvider>
    </AuthProvider>
  </StrictMode>
);
reportWebVitals();
