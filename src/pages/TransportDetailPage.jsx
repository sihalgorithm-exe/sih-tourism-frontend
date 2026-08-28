import React from 'react';
import DetailPage from './DetailPage.jsx';
import { getTransportOptionById } from '../api/transport.js';

export default function TransportDetailPage() {
  return (
    <DetailPage
      type="transport"
      backLabel="Back to transport"
      backPath="/transport"
      fetcher={getTransportOptionById}
    />
  );
}
