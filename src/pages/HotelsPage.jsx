import React from 'react';
import ListingPage from './ListingPage.jsx';
import { getAllHotels } from '../api/hotels.js';
import { getAllTravelEstimates } from '../api/travelEstimates.js';


  const [budgetPreset, setBudgetPreset] = useState(''); // '' | 'budget' | 'moderate' | 'premium'
  const [customBudget, setCustomBudget] = useState('');

  const BUDGET_PRESETS = {
    budget: 5000,
    moderate: 15000,
    premium: 35000,
  };

  function handlePresetClick(preset) {
    setBudgetPreset(preset);
    setCustomBudget(String(BUDGET_PRESETS[preset]));
  }

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
