
import React from 'react';
import { render, screen } from '@/test-utils/custom-render';
import DiscoverPage from './DiscoverPage';

// Mock the AppHeader component
vi.mock('@/components/app-header', () => ({
  AppHeader: () => <header>Mock App Header</header>,
}));

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  useRouter: () => ({}),
}));

describe('DiscoverPage', () => {
  it('renders the page title', () => {
    render(<DiscoverPage />);
    expect(screen.getByText('Discover Campaigns')).toBeInTheDocument();
  });
});
