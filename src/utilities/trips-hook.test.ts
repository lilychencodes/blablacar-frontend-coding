import { renderHook } from '@testing-library/react-hooks';

import { mockTripsData, act } from '../setupTests';

import useFetch from './trips-hook';
import apiCall from './api-call';

describe('useFetch', () => {
  it('fetches trips', async () => {
    const { result } = await act(async () => renderHook(() => useFetch(0))) as any;

    const { tripList, totalCount } = result.current;

    expect(totalCount).toEqual(mockTripsData.search_info.count);
    expect(tripList).toEqual(mockTripsData.trips);
  });

  it('calls api again only if pageNum changes', async () => {
    const apiMock = jest.spyOn(apiCall, 'fetchTripsFromApi').mockImplementation(() => {
      return Promise.resolve(mockTripsData);
    });

    const { result, rerender } = await act(async () => renderHook(() => useFetch(0))) as any;

    rerender([0]);

    expect(apiMock).toHaveBeenCalledTimes(1);
  });

});
