import moment from 'moment';

const PARIS_COORD = '48.8566,2.3522';
const LYON_COORD = '45.764043,4.835659';

export async function fetchTrips(cursor?: string) {
  const date = moment().format('YYYY-MM-DDTHH:mm:ss');

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
