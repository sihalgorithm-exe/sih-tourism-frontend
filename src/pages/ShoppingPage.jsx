import React from 'react';
import ListingPage from './ListingPage.jsx';
import { getAllShoppingPlaces } from '../api/shopping.js';

export default function ShoppingPage() {
  return (
    <ListingPage
      title="Shopping"
      subtitle="Markets, crafts, and souvenirs."
      type="shopping"
      basePath="/shopping"
      fetcher={getAllShoppingPlaces}
    />
  );
}
