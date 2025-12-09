/** @vitest-environment jsdom */

import { render, screen, fireEvent, waitFor } from '@/test-utils/custom-render';
import { LoginPage } from './LoginPage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { mockUseToast } from '@/test-utils/custom-render';

// Mock the Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

// Mock firebase services, keeping original functionalities for the provider
vi.mock('firebase/auth', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        signInWithEmailAndPassword: vi.fn(),
    };
});

describe('LoginPage', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockPush.mockClear();
    (signInWithEmailAndPassword as vi.Mock).mockClear();
    mockUseToast.toasts = [];
  });

  it('should allow a user to log in and be redirected to the dashboard', async () => {
    // Arrange: Mock a successful login
    (signInWithEmailAndPassword as vi.Mock).mockResolvedValue({
      user: { uid: 'test-uid', email: 'test@example.com' },
    });

    render(<LoginPage />);

    // Act: Fill out and submit the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    const loginButton = await screen.findByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    // Assert: Check if Firebase was called and user was redirected
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object), // The auth object
        'test@example.com',
        'password123'
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show an error message on a failed login attempt', async () => {
    // Arrange: Mock a failed login
    const errorMessage = 'Firebase: Error (auth/wrong-password).';
    (signInWithEmailAndPassword as vi.Mock).mockRejectedValue(new Error(errorMessage));

    render(<LoginPage />);

    // Act: Fill out and submit the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong-password' },
    });
    const loginButton = await screen.findByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    // Assert: Check that an error message is displayed
    await waitFor(() => {
      expect(mockUseToast.toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    });

    // Ensure user is not redirected
    expect(mockPush).not.toHaveBeenCalled();
  });
});
