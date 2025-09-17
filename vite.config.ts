import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  envDir: '.',
  envPrefix: 'VITE_',
  // Load environment files based on mode
  define: {
    __MODE__: JSON.stringify(mode),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3001,
    strictPort: false,
    host: true,
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: mode === 'development',
    outDir: 'dist',
    assetsDir: 'assets',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-alert-dialog', '@radix-ui/react-select'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          icons: ['lucide-react'],
        },
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    reportCompressedSize: true,
  },
}));
