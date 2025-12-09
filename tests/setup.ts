
import { afterAll, vi } from 'vitest';
import { getApps, deleteApp } from 'firebase/app';
import '@testing-library/jest-dom';

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
