import React from 'react';
import ListingPage from './ListingPage.jsx';
import { getAllTransportOptions } from '../api/transport.js';

export default function TransportPage() {
  return (
    <ListingPage
      title="Transport"
      subtitle="Ways to get around."
      type="transport"
      basePath="/transport"
      fetcher={getAllTransportOptions}
    />
  );
}
