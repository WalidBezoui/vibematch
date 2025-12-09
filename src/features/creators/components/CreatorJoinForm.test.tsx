
import { render, screen, fireEvent, waitFor } from '@/test-utils/custom-render';
import { CreatorJoinForm } from './CreatorJoinForm';
import { validateSocialHandle } from '@/ai/flows/validate-social-handle';
import { signInAnonymously } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { mockUseToast } from '@/test-utils/custom-render';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}));

// Mock the AI flow directly
vi.mock('@/ai/flows/validate-social-handle', () => ({
    validateSocialHandle: vi.fn(),
}));

// Mock firebase services, keeping original functionalities for the provider
vi.mock('firebase/auth', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        signInAnonymously: vi.fn(),
    };
});

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal();
    const collectionRef = {}; // A dummy object
    return {
        ...actual,
        addDoc: vi.fn(),
        collection: vi.fn(() => collectionRef),
    };
});


describe('CreatorJoinForm', () => {

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockUseToast.toasts = [];

    // Default mock behavior
    (validateSocialHandle as vi.Mock).mockResolvedValue({ exists: true });
    (signInAnonymously as vi.Mock).mockResolvedValue({ user: { uid: 'test-uid' } });
    (addDoc as vi.Mock).mockResolvedValue({ id: 'test-doc-id' });
  });

  const fillStep1 = () => {
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test Creator' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'creator@test.com' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '1234567890' } });
  };

  const fillStep2 = async () => {
    fireEvent.change(screen.getByLabelText(/instagram/i), { target: { value: 'test-insta' } });
    await waitFor(() => expect(validateSocialHandle).toHaveBeenCalledWith({ platform: 'instagram', handle: 'test-insta' }));
  };

  const fillStep3 = () => {
    // In a real i18n setup, you'd get these from your translation files
    fireEvent.click(screen.getByText(/fashion/i)); 
    fireEvent.click(screen.getByText(/beauty/i));
  };

  const fillStep4 = () => {
    fireEvent.click(screen.getByLabelText(/i commit to meeting deadlines and not using fake engagement/i));
    fireEvent.click(screen.getByLabelText(/i accept the terms of use and i grant vibematch an exclusive mandate to invoice and collect payments on my behalf/i));
  };

  it('should successfully guide a user through the entire form and submit the data', async () => {
    render(<CreatorJoinForm />);

    // Step 1: Personal Info
    expect(screen.getByRole('heading', { name: /become a founding creator/i })).toBeInTheDocument();
    fillStep1();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 2: Social Handles
    await waitFor(() => expect(screen.getByRole('heading', { name: /link your social profiles/i })).toBeInTheDocument());
    await fillStep2();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 3: Niches
    await waitFor(() => expect(screen.getByRole('heading', { name: /define your vibe/i })).toBeInTheDocument());
    fillStep3();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 4: Agreements
    await waitFor(() => expect(screen.getByRole('heading', { name: /our pledge for quality/i })).toBeInTheDocument());
    fillStep4();
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Final Step: Success Screen
    await waitFor(() => {
        expect(signInAnonymously).toHaveBeenCalled();
        expect(addDoc).toHaveBeenCalledWith(
            expect.anything(), // Firestore collection ref
            expect.objectContaining({
                fullName: 'Test Creator',
                email: 'creator@test.com',
                instagram: 'test-insta',
                niches: ['fashion', 'beauty'],
                pledge: true,
                terms: true,
            })
        );
    }, { timeout: 10000 });

    await waitFor(() => {
      expect(screen.getByText(/thank you for your application/i)).toBeInTheDocument();
    });
  }, 15000);

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
      expect(screen.getByRole('textbox', { name: /whatsapp number/i })).toBeInTheDocument();
    });

    fillStep1(); // Fill other fields
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/WhatsApp number is required if different from phone./i)).toBeInTheDocument();
    });
  });
  
  it('should handle social media validation states correctly', async () => {
    (validateSocialHandle as vi.Mock).mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
      return { exists: false };
    });

    render(<CreatorJoinForm />);
    // Navigate to step 1 and fill it
    fillStep1();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Navigate to step 2
    await waitFor(() => expect(screen.getByRole('heading', { name: /link your social profiles/i })).toBeInTheDocument());

    // Test checking and error state
    fireEvent.change(screen.getByLabelText(/instagram/i), { target: { value: 'nonexistent-user' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('loader-spin')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should display an error toast if form submission fails', async () => {
    // Arrange: Mock a failed submission
    const submissionError = new Error('Firestore is down');
    (addDoc as vi.Mock).mockRejectedValue(submissionError);

    render(<CreatorJoinForm />);

    // Act: Fill the entire form correctly
    fillStep1();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: /link your social profiles/i })).toBeInTheDocument());
    await fillStep2();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: /define your vibe/i })).toBeInTheDocument());
    fillStep3();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: /our pledge for quality/i })).toBeInTheDocument());
    fillStep4();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Assert
    await waitFor(() => {
      expect(mockUseToast.toast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: submissionError.message,
      });
    });
    // Ensure we haven't moved to the success screen
    expect(screen.queryByText(/thank you for your application/i)).not.toBeInTheDocument();
  });
});
