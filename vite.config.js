// import { defineConfig } from 'vite'
// import path from "path"
// import react from '@vitejs/plugin-react'
// // import tailwindcss from '@tailwindcss'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve( "./src"),
//     },
//   },
//   compilerOptions: {
//     baseUrl: ".",
//     paths: {
//       "@/*": ["src/*"]
//     }
//   },
//   include: ["src"]
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@shadcn/ui': path.resolve(__dirname, 'node_modules/@shadcn/ui/dist'),
    },
  },
});
