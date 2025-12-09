import { test, afterAll } from 'vitest';
import { getApps, deleteApp } from 'firebase/app';

afterAll(async () => {
  await Promise.all(getApps().map(app => deleteApp(app)));
});
