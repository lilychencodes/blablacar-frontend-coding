import { useState, useCallback, useEffect } from 'react';

import apiCall from './api-call';

import type { TripProps } from '../components/Trip';

// create a custom hook called "useFetch". Hooks must start with "use".
export default function useFetch(pageNum: number) {
  const [tripList, setTrips] = useState<TripProps[]>([]);
  const [cursor, setCursor] = useState<string>();
  const [totalCount, setTripCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTripsByQuery = useCallback(async () => {
    try {
      setLoading(true);

      const tripsData = await apiCall.fetchTripsFromApi(cursor);

      const { trips, next_cursor, search_info } = tripsData;

      const newTripList = [
        ...tripList,
        ...trips,
      ];

      setTrips(newTripList);
      setCursor(next_cursor);
      setTripCount(search_info.count);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [cursor]);

  useEffect(() => {
    fetchTripsByQuery();
  }, [pageNum]);

  return { loading, tripList, totalCount };
}
