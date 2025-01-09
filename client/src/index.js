import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'simplebar/src/simplebar.css';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';
import AuthProvider from 'contexts/AuthContext';

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
