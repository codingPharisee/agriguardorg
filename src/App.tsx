
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ServiceWorkerProvider } from "@/components/ServiceWorkerProvider";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import FactCheck from "./pages/FactCheck";
import Blogs from "./pages/Blogs";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import About from "./pages/About";
import ViralFarmPage from "./pages/ViralFarmPage";
import Contact from "./pages/Contact";
import VideoGeneration from "./pages/VideoGeneration";
import Tools from "./pages/Tools";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";
import PestIdentification from "./pages/PestIdentification";
import CropRecommendations from "./pages/CropRecommendations";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/fact-check" element={<FactCheck />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/viral-farm" element={<ViralFarmPage />} />
      <Route path="/myth-buster" element={<VideoGeneration />} />
      <Route path="/tools" element={<Tools />} />
      
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/pest-identification" element={<PestIdentification />} />
      <Route path="/crop-recommendations" element={<CropRecommendations />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ServiceWorkerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </ServiceWorkerProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
