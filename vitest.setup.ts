import { afterAll } from 'vitest';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

afterAll(async () => {
  const testEnv = await initializeTestEnvironment({});
  await testEnv.cleanup();
});
