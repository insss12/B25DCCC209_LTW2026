import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

const jsxInJs = () => ({
  name: 'jsx-in-js',
  enforce: 'pre',

  async transform(code, id) {
    const filePath = id
      .split('?')[0]
      .replace(/\\/g, '/');

    if (
      !filePath.includes('/src/') ||
      !filePath.endsWith('.js')
    ) {
      return null;
    }

    const result = await transformWithOxc(
      code,
      id,
      {
        lang: 'jsx'
      }
    );

    return {
      code: result.code,
      map: result.map
    };
  }
});

export default defineConfig({
  plugins: [
    react(),
    jsxInJs()
  ]
});