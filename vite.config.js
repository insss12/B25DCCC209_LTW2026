import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

function transformJsxInJs() {
  return {
    name: 'transform-jsx-in-js',
    enforce: 'pre',

    async transform(code, id) {
      const filePath = id.split('?')[0].replace(/\\/g, '/');

      if (!filePath.endsWith('/src/App.js')) {
        return null;
      }

      return transformWithOxc(code, id, {
        lang: 'jsx'
      });
    }
  };
}

export default defineConfig({
  plugins: [
    transformJsxInJs(),
    react()
  ]
});