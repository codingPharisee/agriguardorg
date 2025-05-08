
import React from "react";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary-dark">AgriGuard</span>
          </div>
          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} AgriGuard. Combating agricultural misinformation with AI.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
