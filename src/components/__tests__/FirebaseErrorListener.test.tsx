import React from 'react';
import { render, screen, act } from '@testing-library/react';
import FirebaseErrorListener from '../FirebaseErrorListener';
import { Toaster } from '../ui/toaster';

// Mock the useToast hook
const mockToast = jest.fn();
jest.mock('../ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock the error emitter to spy on its methods
const mockErrorEmitterOn = jest.fn();
const mockErrorEmitterOff = jest.fn();
jest.mock('../../firebase/error-emitter', () => ({
  errorEmitter: {
    on: mockErrorEmitterOn,
    off: mockErrorEmitterOff,
  },
}));

// Import the actual errorEmitter for type inference in tests, though the mock will be used.
// This is a common pattern for Jest mocks where you need to reference the original type.
import { errorEmitter } from '../../firebase/error-emitter';

describe('FirebaseErrorListener', () => {
  // Clear mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
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

    // Find the registered callback from the mock
    const registeredCallback = mockErrorEmitterOn.mock.calls[0][1];
    expect(registeredCallback).toBeInstanceOf(Function);

    // Act to simulate the error emission and ensure state updates are batched
    act(() => {
      registeredCallback(errorMessage, errorDetails);
    });

    // Verify that toast was called with the correct message and description
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Firebase Error',
      description: errorMessage,
      variant: 'destructive',
    });
  });

  it('does not display a toast for non-Firebase errors (e.g., generic errors from client)', () => {
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
