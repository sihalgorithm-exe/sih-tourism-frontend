import React from 'react';
import ListingPage from './ListingPage.jsx';
import { getAllFoodPlaces } from '../api/food.js';

export default function FoodPage() {
  return (
    <ListingPage
      title="Food"
      subtitle="Local flavors worth seeking out."
      type="food"
      basePath="/food"
      fetcher={getAllFoodPlaces}
    />
  );
}
