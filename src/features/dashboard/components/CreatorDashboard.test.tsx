
import { render, screen, fireEvent, waitFor } from '@/test-utils/custom-render';
import { CreatorDashboard } from './CreatorDashboard';
import { vi } from 'vitest';

// Mocks
const mockUseUserProfile = vi.fn();
const mockUseUser = vi.fn();
const mockUseFirestore = vi.fn();
const mockUseCollection = vi.fn();
const mockUseToast = vi.fn();
const mockGetNicheLabel = vi.fn();
const mockGetDocs = vi.fn();
const mockDeleteDoc = vi.fn();

vi.mock('@/firebase', () => ({
  useUserProfile: () => mockUseUserProfile(),
  useUser: () => mockUseUser(),
  useFirestore: () => mockUseFirestore(),
  useCollection: (query: any) => mockUseCollection(query),
  useMemoFirebase: (cb: any, deps: any) => cb(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockUseToast }),
}));

vi.mock('@/context/language-context', async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        useLanguage: () => ({
            t: (key: string, options?: any) => {
                if (options) {
                    return `${key} with ${JSON.stringify(options)}`;
                }
                return key;
            },
            dir: 'ltr'
        }),
    };
});

vi.mock('@/hooks/use-niche-translation', () => ({
    useNicheTranslation: () => ({ getNicheLabel: mockGetNicheLabel })
}));

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        collection: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
        getDocs: (...args: any[]) => mockGetDocs(...args),
        doc: vi.fn(),
        deleteDoc: (...args: any[]) => mockDeleteDoc(...args),
        collectionGroup: vi.fn(),
        documentId: vi.fn(),
    };
});

const mockCampaigns = {
    pending: [
        { id: 'campaign1', title: 'Pending Campaign', status: 'OPEN_FOR_APPLICATIONS', budget: 100, campaignBrief: 'Brief for pending' },
    ],
    active: [
        { id: 'campaign2', title: 'Active Campaign', status: 'IN_PROGRESS', budget: 200, campaignBrief: 'Brief for active' },
    ]
};

describe('CreatorDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ user: { uid: 'test-user' } });
    mockUseUserProfile.mockReturnValue({ userProfile: { displayName: 'Test Creator', tags: ['fashion'] } });
    mockUseFirestore.mockReturnValue({});
    // Default mock for getDocs to avoid hanging tests
    mockGetDocs.mockResolvedValue({ docs: [] });
    mockUseCollection.mockImplementation(query => {
        if (query?.toString().includes('creatorIds')) {
            return { data: mockCampaigns.active, isLoading: false };
        }
        return { data: [], isLoading: false };
    });
    mockDeleteDoc.mockResolvedValue(undefined); // Default success behavior
  });

  it('renders the dashboard with greeting and stats', async () => {
    render(<CreatorDashboard />);
    
    await waitFor(() => {
        expect(screen.getByText(/greetings.morning/)).toBeInTheDocument();
    });
    expect(screen.getByText('creatorDashboard.stats.matching')).toBeInTheDocument();
  });

  it('shows pending campaigns and allows withdrawing', async () => {
    // Special setup for this test to inject pending campaigns
    (mockGetDocs as vi.Mock).mockResolvedValueOnce({
        docs: [
            { data: () => ({ campaignId: 'campaign1', creatorId: 'test-user' }) }
        ]
    }).mockResolvedValueOnce({ // for allOpenCampaignsQuery
        docs: [
            { id: 'campaign1', data: () => mockCampaigns.pending[0] }
        ]
    });
    
    render(<CreatorDashboard />);

    await waitFor(() => {
        expect(screen.getByText('Pending Campaign')).toBeInTheDocument();
    });

    const withdrawButton = screen.getByText('creatorDashboard.actions.withdraw');
    fireEvent.click(withdrawButton);

    expect(screen.getByText('creatorDashboard.deleteDialog.title')).toBeInTheDocument();
    expect(screen.getByText(/creatorDashboard.deleteDialog.description/)).toBeInTheDocument();

    const confirmButton = screen.getByText('creatorDashboard.deleteDialog.confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
        expect(mockDeleteDoc).toHaveBeenCalled();
        expect(mockUseToast).toHaveBeenCalledWith({
            title: 'Application Withdrawn',
            description: 'You can apply again in the future if you change your mind.',
        });
    });

    expect(screen.queryByText('Pending Campaign')).not.toBeInTheDocument();
  });

  it('handles withdrawal cancellation', async () => {
    // Setup pending campaigns again
     (mockGetDocs as vi.Mock).mockResolvedValueOnce({
        docs: [
            { data: () => ({ campaignId: 'campaign1', creatorId: 'test-user' }) }
        ]
    }).mockResolvedValueOnce({ // for allOpenCampaignsQuery
        docs: [
            { id: 'campaign1', data: () => mockCampaigns.pending[0] }
        ]
    });

    render(<CreatorDashboard />);

    await waitFor(() => {
        expect(screen.getByText('Pending Campaign')).toBeInTheDocument();
    });

    const withdrawButton = screen.getByText('creatorDashboard.actions.withdraw');
    fireEvent.click(withdrawButton);

    const cancelButton = screen.getByText('brandDashboard.deleteDialog.cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
        expect(mockDeleteDoc).not.toHaveBeenCalled();
    })
    expect(screen.getByText('Pending Campaign')).toBeInTheDocument();
  });

  it('handles API error on withdrawal', async () => {
    const errorMessage = 'Permission denied';
    (mockDeleteDoc as vi.Mock).mockRejectedValue(new Error(errorMessage));

    // Setup pending campaigns
     (mockGetDocs as vi.Mock).mockResolvedValueOnce({
        docs: [
            { data: () => ({ campaignId: 'campaign1', creatorId: 'test-user' }) }
        ]
    }).mockResolvedValueOnce({ // for allOpenCampaignsQuery
        docs: [
            { id: 'campaign1', data: () => mockCampaigns.pending[0] }
        ]
    });

    render(<CreatorDashboard />);

    await waitFor(() => {
        expect(screen.getByText('Pending Campaign')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('creatorDashboard.actions.withdraw'));
    fireEvent.click(screen.getByText('creatorDashboard.deleteDialog.confirm'));

    await waitFor(() => {
      expect(mockUseToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error',
        description: `Could not withdraw application: ${errorMessage}`,
      });
    });

    expect(screen.getByText('Pending Campaign')).toBeInTheDocument(); // Still there because it failed
  });

});
