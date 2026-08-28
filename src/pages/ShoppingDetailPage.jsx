import React from 'react';
import DetailPage from './DetailPage.jsx';
import { getShoppingPlaceById } from '../api/shopping.js';

export default function ShoppingDetailPage() {
  return (
    <DetailPage
      type="shopping"
      backLabel="Back to shopping"
      backPath="/shopping"
      fetcher={getShoppingPlaceById}
    />
  );
}
