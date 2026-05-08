import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { restoreSession } from '@react-learn/auth';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper';
import 'antd/dist/reset.css';
import './styles.css';
import { IamRouter } from './router';

interface MicroAppProps {
  container?: Element | null;
  basename?: string;
}

let root: ReactDOM.Root | null = null;

restoreSession();

function render(props: MicroAppProps = {}): void {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  const queryClient = new QueryClient();

  if (!container) {
    return;
  }

  root = ReactDOM.createRoot(container as HTMLElement);
  root.render(
    <React.StrictMode>
      <ConfigProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename={props.basename}>
            <IamRouter standalone={!qiankunWindow.__POWERED_BY_QIANKUN__} />
          </BrowserRouter>
        </QueryClientProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}

renderWithQiankun({
  mount(props) {
    render(props as MicroAppProps);
  },
  bootstrap() {
    return Promise.resolve();
  },
  update() {
    return Promise.resolve();
  },
  unmount() {
    root?.unmount();
    root = null;
    return Promise.resolve();
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
