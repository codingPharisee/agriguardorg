
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import FactCheck from "./pages/FactCheck";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import About from "./pages/About";
import ViralFarmPage from "./pages/ViralFarmPage";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import useScrollPosition from "@/hooks/useScrollPosition";

const queryClient = new QueryClient();

const AppContent = () => {
  useScrollPosition();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/fact-check" element={<FactCheck />} />
      <Route path="/news" element={<News />} />
      <Route path="/viral-farm" element={<ViralFarmPage />} />
      <Route path="/myth-buster" element={<ComingSoon title="MythBuster Ag" />} />
      <Route path="/ecosystem" element={<ComingSoon title="Integrated Ecosystem" />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
