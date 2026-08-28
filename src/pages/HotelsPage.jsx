import React from 'react';
import ListingPage from './ListingPage.jsx';
import { getAllHotels } from '../api/hotels.js';

export default function HotelsPage() {
  return (
    <ListingPage
      title="Hotels"
      subtitle="Places to stay."
      type="hotel"
      basePath="/hotels"
      fetcher={getAllHotels}
    />
  );
}
