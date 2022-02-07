import React from 'react';
import { render } from '@testing-library/react';

import App from './App';
import { mockTripsData, act } from './setupTests';

describe('App', () => {
  it('renders the app', async () => {
    const { container } = await act(async () => render(<App />)) as any;
    expect(container.getElementsByClassName('trip-detail').length).toBe(mockTripsData.trips.length);
  });
});
