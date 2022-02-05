import React from 'react';
import moment from 'moment';

import { fetchTrips } from './utilities/trips';

import type { TripProps } from './components/Trip';
import Trip from './components/Trip';

import './App.css';

type AppProps = {};
type AppState = {
  tripList: TripProps[];
  cursor?: string;
  totalCount: number;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      tripList: [],
      cursor: undefined,
      totalCount: 0,
    };
  }

  componentDidMount() {
    this.fetchTripsFromApi();

    // Add event listener so that when page is scrolled to the bottom, we fetch more (infinite scroll)
  }

  fetchTripsFromApi = async () => {
    const { tripList, cursor } = this.state;

    const tripsData = await fetchTrips(cursor);

    const { trips, next_cursor, search_info } = tripsData;

    const newTripList = [
      ...tripList,
      ...trips,
    ];

    this.setState({
      tripList: newTripList,
      cursor: next_cursor,
      totalCount: search_info.count,
    });
  }

  render() {
    const { tripList, totalCount } = this.state;
    return (
      <div className="main">
        <div className="container">
          <div>
            From Paris to Lyon for {moment().format('ll')}
          </div>
          <div>
            Currently displaying {tripList.length} out of {totalCount} total trips.
          </div>
          <div className="trip-list">
            {tripList.map((trip, idx) => (
              <Trip key={idx} {...trip} />
            ))}
          </div>
        </div>
      </div>
    );
  }

}

export default App;
