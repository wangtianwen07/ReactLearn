import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [react(), qiankun('ticket', { useDevMode: true })],
  server: {
    host: '0.0.0.0',
    port: 5175,
    cors: true,
    origin: 'http://localhost:5175',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/antd') || id.includes('node_modules/@ant-design')) {
            return 'antd-vendor';
          }
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')
          ) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'query-vendor';
          }
        },
      },
    },
  },
});
