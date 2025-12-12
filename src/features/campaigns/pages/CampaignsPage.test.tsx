/** @vitest-environment jsdom */

import { render, screen } from '@/test-utils/custom-render';
import { CampaignsPage } from './CampaignsPage';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}));

describe('CampaignsPage', () => {
  it('should render the page title', async () => {
    render(<CampaignsPage />);
    expect(await screen.findByText('Discover Campaigns')).toBeInTheDocument();
  });
});
