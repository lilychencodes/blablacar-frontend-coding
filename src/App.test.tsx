import React from 'react';
import { render } from '@testing-library/react';
import TestUtils from 'react-dom/test-utils'

import App from './App';
import { mockTripsData } from './setupTests';

// Makes sure `act()` returns the container. https://github.com/facebook/react/issues/16366#issuecomment-520794083
async function act(callback){
  let ret;
  await TestUtils.act(async () => {
    ret = await callback();
  });
  return ret;
}

describe('App', () => {
  it('renders the app', async () => {
    const { container } = await act(async () => render(<App />));
    expect(container.getElementsByClassName('trip-detail').length).toBe(mockTripsData.trips.length);
  });
});
