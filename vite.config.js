import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shadcn/ui': path.resolve(fileURLToPath(new URL('.', import.meta.url)), 'node_modules/@shadcn/ui/dist'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  build: {
    sourcemap: false, // Disable sourcemaps in production for better performance
    minify: 'terser', // Use terser for better minification
    chunkSizeWarningLimit: 600,
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore "use client" directive warnings
        if (warning.message.includes('Module level directives cause errors when bundled, "use client"')) {
          return;
        }
        // Ignore sourcemap warnings for problematic files
        if (warning.message.includes("Can't resolve original location of error")) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: (id) => {
          // Core React dependencies
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          
          // UI Libraries
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
          
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-components';
          }
          
          // Icons
          if (id.includes('react-icons') || id.includes('@tabler/icons')) {
            return 'icons';
          }
          
          // Firebase
          if (id.includes('firebase')) {
            return 'firebase';
          }
          
          // Other third-party libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  // Enable compression and caching
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
});
