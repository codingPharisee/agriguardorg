
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Hourglass, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 p-5 rounded-full mb-6">
            <Hourglass className="h-12 w-12 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title} is Coming Soon
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're working hard to bring this feature to life. Please check back later for updates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComingSoon;
