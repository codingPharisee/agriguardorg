
import React from "react";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-900 to-green-800 border-t border-green-700 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-green-500 text-white px-3 py-2 font-bold">
              <div className="flex flex-col items-center">
                <Leaf className="h-5 w-5 mb-1" />
                <span className="text-sm">AgriG</span>
              </div>
            </div>
            <span className="font-semibold text-green-100 text-lg">AgriGuard</span>
          </div>
          <div className="text-green-200 text-center md:text-right">
            <div className="text-sm mb-1">
              &copy; {new Date().getFullYear()} AgriGuard Agricultural Solutions
            </div>
            <div className="text-xs text-green-300">
              Combating agricultural misinformation with AI technology
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
