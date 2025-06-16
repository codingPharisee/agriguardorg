
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FactCheck from "./pages/FactCheck";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import About from "./pages/About";
import ViralFarmPage from "./pages/ViralFarmPage";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fact-check" element={<FactCheck />} />
          <Route path="/news" element={<News />} />
          <Route path="/viral-farm" element={<ViralFarmPage />} />
          <Route path="/myth-buster" element={<ComingSoon title="MythBuster Ag" />} />
          <Route path="/ecosystem" element={<ComingSoon title="Integrated Ecosystem" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
