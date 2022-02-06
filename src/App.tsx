import React, { useState, useEffect, useRef, useCallback } from 'react';

import moment from 'moment';

import useFetch from './utilities/trips';

import Trip from './components/Trip';
import type { TripProps } from './components/Trip';

import './App.css';

const App: React.FC = () => {
  const [pageNum, setPageNum] = useState<number>(0);

  const { loading, tripList, totalCount }: {
    loading: boolean;
    tripList: TripProps[];
    totalCount: number;
  } = useFetch(pageNum);

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

  const numTripsFetched = tripList.length;

  return (
    <div className="main">
      <div className="container">
        <div className="header-text">
          <div>
            From Paris to Lyon for {moment().format('ll')}
          </div>
          <div>
            Currently displaying {numTripsFetched} trips.
          </div>
        </div>
        <div className="trip-list-container">
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
    </div>
  );

}

export default App;
