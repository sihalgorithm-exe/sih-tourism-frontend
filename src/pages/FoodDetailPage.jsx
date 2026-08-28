import React from 'react';
import DetailPage from './DetailPage.jsx';
import { getFoodPlaceById } from '../api/food.js';

export default function FoodDetailPage() {
  return (
    <DetailPage type="food" backLabel="Back to food" backPath="/food" fetcher={getFoodPlaceById} />
  );
}
