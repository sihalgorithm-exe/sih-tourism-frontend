import React from 'react';
import DetailPage from './DetailPage.jsx';
import { getDestinationById } from '../api/destinations.js';

export default function DestinationDetailPage() {
  return (
    <DetailPage
      type="destination"
      backLabel="Back to destinations"
      backPath="/destinations"
      fetcher={getDestinationById}
    />
  );
}
