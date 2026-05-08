import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { restoreSession } from '@react-learn/auth';
import { registerAuthFailureHandler } from '@react-learn/api';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/reset.css';
import './styles.css';
import { AppRouter } from './router';
import { initMicroFrontends } from './micro-frontends';

const queryClient = new QueryClient();

restoreSession();
registerAuthFailureHandler(() => {
  window.location.assign('/login');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>
);

initMicroFrontends();
