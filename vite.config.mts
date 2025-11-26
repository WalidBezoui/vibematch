 import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    globals: true, // Allows using describe, it, expect without importing
    include: [
      'src/**/*.{test,spec}.{ts,tsx}', // Only include files following this pattern
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Configure path alias for Vitest
    },
  },
});
