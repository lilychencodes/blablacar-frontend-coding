import React, { useState, useEffect, useRef, useCallback } from 'react';

import moment from 'moment';

import { fetchTrips } from './utilities/trips';

import type { TripProps } from './components/Trip';
import Trip from './components/Trip';

import './App.css';

const App: React.FC = () => {
  const [tripList, setTrips] = useState<TripProps[]>([]);
  const [cursor, setCursor] = useState<string>();
  const [totalCount, setTripCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState<number>(0);

  const observer: any = useRef();

  const lastTripRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        const hasMore = tripList.length < totalCount;
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, tripList, totalCount]
  );

  const fetchTripsFromApi = async () => {
    setLoading(true);

    const tripsData = await fetchTrips(cursor);

    const { trips, next_cursor, search_info } = tripsData;

    const newTripList = [
      ...tripList,
      ...trips,
    ];

    setTrips(newTripList);
    setCursor(next_cursor);
    setTripCount(search_info.count);
    setLoading(false);
  }

  const numTripsFetched = tripList.length;

  useEffect(() => {
    fetchTripsFromApi();
  }, [pageNum]);

  return (
    <div className="main">
      <div className="container">
        <div>
          From Paris to Lyon for {moment().format('ll')}
        </div>
        <div>
          Currently displaying {numTripsFetched} total trips.
        </div>
        <div className="trip-list">
          {tripList.map((trip, idx) => {
            const isLastTrip = idx === tripList.length - 1;
            return isLastTrip ? (
              <div key={idx} ref={lastTripRef}>
                <Trip key={idx} {...trip} />
              </div>
            ) : (
              <div key={idx}><Trip key={idx} {...trip} /></div>
            )
          })}
        </div>
        <div className="loader">{loading ? 'Loading...' : ''}</div>
      </div>
    </div>
  );

}

export default App;
