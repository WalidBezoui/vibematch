const { afterAll } = require('vitest');
const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');

afterAll(async () => {
  const testEnv = await initializeTestEnvironment({});
  await testEnv.cleanup();
});
