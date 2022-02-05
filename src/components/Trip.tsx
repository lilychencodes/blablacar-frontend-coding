import moment from 'moment';

import './Trip.css';

type Waypoint = {
  date_time: string;
  place: {
    address: string;
    city: string;
    country_code: string;
  };
}

export type TripProps = {
  distance_in_meters: number;
  duration_in_seconds: number;
  link: string;
  price: {
    amount: string;
    currency: string;
  };
  vehicle: {
    make: string;
    model: string;
  };
  waypoints: Waypoint[];
}

export default function Trip({
  vehicle,
  price,
  waypoints,
  distance_in_meters,
  duration_in_seconds,
  link,
}: TripProps) {
  const [from, to] = waypoints;

  const hours = Math.floor((duration_in_seconds / 60) / 60);
  const remainingMin = Math.floor((duration_in_seconds - hours * 60 * 60)) / 60;

  return (
    <div onClick={() => { window.open(link) }} className="trip">
      <div className="trip-detail">
        <div className="trip-info">
          <div className="waypoints">
            <Waypoint {...from} />
            <div className="flex-center trip-duration">
              <span className="gray-text waypoint-left-width">{hours}h{remainingMin}</span>
              <div className="duration-divider" />
              <span className="gray-text">{Math.round(distance_in_meters / 1000)} km</span>
            </div>
            <Waypoint {...to} />
          </div>
          <div>{price?.amount} {price?.currency}</div>
        </div>
        <div className="driver-info">
          {vehicle ? <div>{vehicle.make} {vehicle.model}</div> : <div>Car information not available</div>}
        </div>
      </div>
    </div>
  )
}

function Waypoint({ place, date_time }: Waypoint) {
  return (
    <div className="waypoint flex-center">
      <span className="waypoint-left-width">
        <b>{moment(date_time).format('HH:mm')}</b>
      </span>
      <div className="waypoint-divider" />
      <span>
        <b>{place.city}</b>
      </span>
    </div>
  )
}
