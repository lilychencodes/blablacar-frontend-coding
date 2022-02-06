import { useState, useCallback, useEffect } from 'react';
import moment from 'moment';

import type { TripProps } from '../components/Trip';

const PARIS_COORD = '48.8566,2.3522';
const LYON_COORD = '45.764043,4.835659';

async function fetchTripsFromApi(cursor?: string) {
  // const date = moment().format('YYYY-MM-DDTHH:mm:ss');
  const date = moment().format('2022-02-07T08:00:00');

  const url = new URL(
    `https://public-api.blablacar.com/api/v3/trips?key=YzbiA8L6DcqxTvSna1lOFQQU66FosDVs&from_coordinate=${PARIS_COORD}&to_coordinate=${LYON_COORD}&from_country=FR&to_country=FR&locale=en-GB&start_date_local=${date}&currency=EUR`
  );

  // used for pagination (fetch results of next page)
  if (cursor) {
    url.searchParams.set('from_cursor', cursor);
  }

  const urlStr = url.toString();

  const response = await fetch(urlStr);

  const tripsData = await response.json();

  return tripsData;
}

// create a custom hook called "useFetch". Hooks must start with "use".
export default function useFetch(pageNum: number) {
  const [tripList, setTrips] = useState<TripProps[]>([]);
  const [cursor, setCursor] = useState<string>();
  const [totalCount, setTripCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTripsByQuery = useCallback(async () => {
    try {
      setLoading(true);

      const tripsData = await fetchTripsFromApi(cursor);

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
  }, [pageNum]);

  useEffect(() => {
    fetchTripsByQuery();
  }, [pageNum]);

  return { loading, tripList, totalCount };
}
