import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';

// 1. Mock the modules FIRST. The mock functions are created inside the factory.
//    This ensures the 'vi.fn()' calls are executed when the mock is processed.
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast, // Return the globally defined mockToast
  }),
}));

const mockErrorEmitterOn = vi.fn();
const mockErrorEmitterOff = vi.fn();
vi.mock('@/firebase/error-emitter', () => ({
  errorEmitter: {
    on: mockErrorEmitterOn, // Return the globally defined mockErrorEmitterOn
    off: mockErrorEmitterOff, // Return the globally defined mockErrorEmitterOff
  },
}));

// 2. NOW, import everything else, including the mocked modules.
//    These imports will now resolve to their mocked versions.
import FirebaseErrorListener from '@/components/FirebaseErrorListener';
import { Toaster } from '@/components/ui/toaster';
// We don't need to import useToast or errorEmitter directly here
// as we are referencing the globally defined mock functions.

describe('FirebaseErrorListener', () => {
  // 3. Clear mocks before each test to ensure isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing and attaches error listener on mount', () => {
    const { unmount } = render(
      <>
        <Toaster />
        <FirebaseErrorListener />
      </>
    );
    
    expect(mockErrorEmitterOn).toHaveBeenCalledTimes(1);
    expect(mockErrorEmitterOn).toHaveBeenCalledWith('firebaseError', expect.any(Function));
    expect(screen.queryByRole('status')).not.toBeInTheDocument(); // Toaster content not visible initially

    // Verify detachment on unmount
    unmount();
    expect(mockErrorEmitterOff).toHaveBeenCalledTimes(1);
    expect(mockErrorEmitterOff).toHaveBeenCalledWith('firebaseError', expect.any(Function));
  });

  it('displays a toast when a Firebase error is emitted', () => {
    render(
      <>
        <Toaster />
        <FirebaseErrorListener />
      </>
    );

    // Simulate an error being emitted
    const errorMessage = 'Permission denied to access resource.';
    const errorDetails = { code: 'permission-denied', name: 'FirebaseError' };

    // The callback is the second argument of the first call to the mock
    const registeredCallback = mockErrorEmitterOn.mock.calls[0][1];
    expect(registeredCallback).toBeInstanceOf(Function);

    act(() => {
      registeredCallback(errorMessage, errorDetails);
    });

    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Firebase Error',
      description: errorMessage,
      variant: 'destructive',
    });
  });

  it('does not display a toast for non-Firebase errors', () => {
    render(
      <>
        <Toaster />
        <FirebaseErrorListener />
      </>
    );

    const genericError = 'A generic client error.';
    const registeredCallback = mockErrorEmitterOn.mock.calls[0][1];

    act(() => {
      // Emit a generic error without Firebase-specific details
      registeredCallback(genericError, {}); // Pass an empty object for details
    });

    // Expect no toast to be displayed for generic errors
    expect(mockToast).not.toHaveBeenCalled();
  });
});
