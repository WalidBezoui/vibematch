/** @vitest-environment jsdom */

import { render, screen } from '@/test-utils/custom-render';
import { DiscoverPage } from './DiscoverPage';
import { useCollection } from '@/firebase';

// Mock dependencies
vi.mock('@/firebase', async () => {
    const original = await vi.importActual('@/firebase');
    return {
        ...original,
        useCollection: vi.fn(),
    };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn() }),
  usePathname: () => '/',
}));

describe('DiscoverPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render a loading skeleton when data is loading', async () => {
    (useCollection as vi.Mock).mockReturnValue({ isLoading: true, data: [] });

    render(<DiscoverPage />);

    const skeletons = await screen.findAllByTestId('loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render an empty state message when no campaigns are available', async () => {
    (useCollection as vi.Mock).mockReturnValue({ data: [], isLoading: false });

    render(<DiscoverPage />);

    expect(await screen.findByRole('heading', { name: /no open campaigns/i })).toBeInTheDocument();
    expect(await screen.findByText(/check back soon for new opportunities/i)).toBeInTheDocument();
  });

  it('should render a list of campaign cards when campaigns are available', async () => {
    const mockCampaigns = [
      { id: '1', title: 'Test Campaign 1', budget: '100', campaignBrief: 'Brief 1', tags: ['fashion'], numberOfCreators: 2, creatorIds: ['1'] },
      { id: '2', title: 'Test Campaign 2', budget: '200', campaignBrief: 'Brief 2', tags: ['beauty'], numberOfCreators: 1, creatorIds: [] },
    ];
    (useCollection as vi.Mock).mockImplementation((query) => {
        if (query && query._query && query._query.path.segments.join('/') === 'campaigns') {
            return { data: mockCampaigns, isLoading: false };
        }
        return { data: [], isLoading: false }; // for applications and conversations
    });

    render(<DiscoverPage />);

    expect(await screen.findByText('Test Campaign 1')).toBeInTheDocument();
    expect(await screen.findByText('Test Campaign 2')).toBeInTheDocument();
  });
});
