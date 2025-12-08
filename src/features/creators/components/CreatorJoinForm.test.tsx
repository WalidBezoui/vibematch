
import { render, screen, fireEvent, waitFor, act } from '../../../test-utils/custom-render';
import { CreatorJoinForm } from './CreatorJoinForm';
import * as AI from '@/ai/flows/validate-social-handle';
import * as Auth from 'firebase/auth';
import * as Firestore from 'firebase/firestore';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/ai/flows/validate-social-handle');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

const mockUseToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockUseToast }),
}));

describe('CreatorJoinForm', () => {
  let mockValidateSocialHandle: jest.SpyInstance;
  let mockSignInAnonymously: jest.SpyInstance;
  let mockAddDoc: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock implementations
    mockValidateSocialHandle = jest.spyOn(AI, 'validateSocialHandle');
    mockSignInAnonymously = jest.spyOn(Auth, 'signInAnonymously');
    mockAddDoc = jest.spyOn(Firestore, 'addDoc');

    // Default mock behavior
    mockValidateSocialHandle.mockResolvedValue({ exists: true });
    mockSignInAnonymously.mockResolvedValue({ user: { uid: 'test-uid' } });
    mockAddDoc.mockResolvedValue({ id: 'test-doc-id' });
  });

  const fillStep1 = () => {
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test Creator' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'creator@test.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
  };

  const fillStep2 = async () => {
    fireEvent.change(screen.getByLabelText(/instagram/i), { target: { value: 'test-insta' } });
    await waitFor(() => expect(mockValidateSocialHandle).toHaveBeenCalled());
  };

  const fillStep3 = () => {
    // In a real i18n setup, you'd get these from your translation files
    fireEvent.click(screen.getByText(/fashion/i)); 
    fireEvent.click(screen.getByText(/beauty/i));
  };

  const fillStep4 = () => {
    fireEvent.click(screen.getByLabelText(/i agree to the professionalism pledge/i));
    fireEvent.click(screen.getByLabelText(/i agree to the terms and agreements/i));
  };

  it('should successfully guide a user through the entire form and submit the data', async () => {
    render(<CreatorJoinForm />);

    // Step 1: Personal Info
    expect(screen.getByText(/contact details/i)).toBeInTheDocument();
    fillStep1();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 2: Social Handles
    await waitFor(() => expect(screen.getByText(/connect your socials/i)).toBeInTheDocument());
    await fillStep2();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 3: Niches
    await waitFor(() => expect(screen.getByText(/choose your niche/i)).toBeInTheDocument());
    fillStep3();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 4: Agreements
    await waitFor(() => expect(screen.getByText(/professionalism pledge/i)).toBeInTheDocument());
    fillStep4();
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Final Step: Success Screen
    await waitFor(() => {
        expect(mockSignInAnonymously).toHaveBeenCalled();
        expect(mockAddDoc).toHaveBeenCalledWith(
            expect.any(Object), // Firestore collection ref
            expect.objectContaining({
                fullName: 'Test Creator',
                email: 'creator@test.com',
                instagram: 'test-insta',
                niches: ['fashion', 'beauty'],
                pledge: true,
                terms: true,
            })
        );
    });

    await waitFor(() => {
      expect(screen.getByText(/application submitted/i)).toBeInTheDocument();
    });
  });

  it('should show validation errors if required fields are missed', async () => {
    render(<CreatorJoinForm />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/a valid email is required/i)).toBeInTheDocument();
    });
  });

  it('should show and require WhatsApp field only when the checkbox is ticked', async () => {
    render(<CreatorJoinForm />);
    const whatsappCheckbox = screen.getByLabelText(/my whatsapp number is different/i);
    fireEvent.click(whatsappCheckbox);

    await waitFor(() => {
      expect(screen.getByLabelText(/whatsapp number/i)).toBeInTheDocument();
    });

    fillStep1(); // Fill other fields
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/whatsapp number is required/i)).toBeInTheDocument();
    });
  });
  
  it('should handle social media validation states correctly', async () => {
    mockValidateSocialHandle.mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
      return { exists: false };
    });

    render(<CreatorJoinForm />);
    fireEvent.click(screen.getByRole('button', { name: /next/i })); // Go to step 2
    await waitFor(() => expect(screen.getByText(/connect your socials/i)).toBeInTheDocument());

    // Test checking and error state
    fireEvent.change(screen.getByLabelText(/instagram/i), { target: { value: 'nonexistent-user' } });
    expect(screen.getByTestId('loader-spin')).toBeInTheDocument(); // You'd need to add a data-testid to your Loader

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should display an error toast if form submission fails', async () => {
    // Arrange: Mock a failed submission
    const submissionError = new Error('Firestore is down');
    mockAddDoc.mockRejectedValue(submissionError);

    render(<CreatorJoinForm />);

    // Act: Fill the entire form correctly
    fillStep1();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => { /* wait for step 2 */ });
    await fillStep2();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => { /* wait for step 3 */ });
    fillStep3();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => { /* wait for step 4 */ });
    fillStep4();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Assert
    await waitFor(() => {
      expect(mockUseToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: submissionError.message,
      });
    });
    // Ensure we haven't moved to the success screen
    expect(screen.queryByText(/application submitted/i)).not.toBeInTheDocument();
  });
});
