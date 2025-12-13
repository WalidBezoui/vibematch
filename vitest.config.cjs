const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './vitest.setup.cjs',
    testTimeout: 10000, // Optional: adjust timeout
  },
});
