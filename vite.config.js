import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// './' — относительные пути в сборке. Страница GitHub может лежать в подпапке
// (https://user.github.io/имя-репозитория/), а её путь известен заранее только
// для пользовательской страницы. HashRouter меняет лишь хэш в URL, поэтому
// базовый путь страницы не меняется и относительные ссылки остаются валидными.
export default defineConfig({
  base: './',
  plugins: [react()],
});
