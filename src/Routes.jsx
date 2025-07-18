import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import KeywordPerformance from "pages/keyword-performance";
import CampaignManagement from "pages/campaign-management";
import Reports from "pages/reports";
import CampaignAnalytics from "pages/campaign-analytics";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/keyword-performance" element={<KeywordPerformance />} />
        <Route path="/campaign-management" element={<CampaignManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/campaign-analytics" element={<CampaignAnalytics />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;