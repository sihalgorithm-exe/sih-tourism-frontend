import React from 'react';
import ListingPage from './ListingPage.jsx';
import { getAllDestinations } from '../api/destinations.js';

export default function DestinationsPage() {
  return (
    <ListingPage
      title="Destinations"
      subtitle="Explore places worth the trip."
      type="destination"
      basePath="/destinations"
      fetcher={getAllDestinations}
    />
  );
}
