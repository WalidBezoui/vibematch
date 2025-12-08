
import { render, screen, fireEvent, waitFor } from '../../test-utils/custom-render';
import LoginPage from './LoginPage';
import * as Auth from 'firebase/auth';

// Mock the Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the Firebase auth functions
jest.mock('firebase/auth');

describe('LoginPage', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockPush.mockClear();
    (Auth.signInWithEmailAndPassword as jest.Mock).mockClear();
  });

  it('should allow a user to log in and be redirected to the dashboard', async () => {
    // Arrange: Mock a successful login
    (Auth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
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
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Assert: Check if Firebase was called and user was redirected
    await waitFor(() => {
      expect(Auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
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
    (Auth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<LoginPage />);

    // Act: Fill out and submit the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Assert: Check that an error message is displayed
    await waitFor(() => {
        expect(screen.getByText(/wrong-password/i)).toBeInTheDocument();
    });

    // Ensure user is not redirected
    expect(mockPush).not.toHaveBeenCalled();
  });
});
