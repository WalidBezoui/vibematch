
import { afterAll, vi, expect } from 'vitest';
import { getApps, deleteApp } from 'firebase/app';
import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Teardown Firebase apps
afterAll(async () => {
  await Promise.all(getApps().map(app => deleteApp(app)));
});
