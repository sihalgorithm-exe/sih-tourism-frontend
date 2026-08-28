import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import DestinationsPage from './pages/DestinationsPage.jsx';
import DestinationDetailPage from './pages/DestinationDetailPage.jsx';
import FoodPage from './pages/FoodPage.jsx';
import FoodDetailPage from './pages/FoodDetailPage.jsx';
import HotelsPage from './pages/HotelsPage.jsx';
import HotelDetailPage from './pages/HotelDetailPage.jsx';
import ShoppingPage from './pages/ShoppingPage.jsx';
import ShoppingDetailPage from './pages/ShoppingDetailPage.jsx';
import TransportPage from './pages/TransportPage.jsx';
import TransportDetailPage from './pages/TransportDetailPage.jsx';

import GroupsPage from './pages/GroupsPage.jsx';
import GroupDetailPage from './pages/GroupDetailPage.jsx';
import PreferencesPage from './pages/PreferencesPage.jsx';
import RecommendationsPage from './pages/RecommendationsPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/food/:id" element={<FoodDetailPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/shopping/:id" element={<ShoppingDetailPage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/transport/:id" element={<TransportDetailPage />} />

          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <GroupsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <ProtectedRoute>
                <GroupDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preferences"
            element={
              <ProtectedRoute>
                <PreferencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
