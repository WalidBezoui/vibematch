import { render, screen } from '@/test-utils/custom-render';
import { CampaignsPage } from './CampaignsPage';

describe('CampaignsPage', () => {
  it('should render the page title', () => {
    render(<CampaignsPage />);
    expect(screen.getByText('Discover Campaigns')).toBeInTheDocument();
  });
});
