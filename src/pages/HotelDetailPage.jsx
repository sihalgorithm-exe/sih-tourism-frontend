import React from 'react';
import DetailPage from './DetailPage.jsx';
import { getHotelById } from '../api/hotels.js';

export default function HotelDetailPage() {
  return (
    <DetailPage type="hotel" backLabel="Back to hotels" backPath="/hotels" fetcher={getHotelById} />
  );
}
