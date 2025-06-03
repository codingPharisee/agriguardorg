
import React from "react";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-harvest-dark border-t border-amber-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-amber-400 text-amber-900 px-3 py-2 font-bold">
              <div className="flex flex-col items-center">
                <Leaf className="h-5 w-5 mb-1" />
                <span className="text-sm">AGRO</span>
              </div>
            </div>
            <span className="font-semibold text-amber-100 text-lg">AgriGuard</span>
          </div>
          <div className="text-amber-200 text-center md:text-right">
            <div className="text-sm mb-1">
              &copy; {new Date().getFullYear()} AgriGuard Agricultural Solutions
            </div>
            <div className="text-xs text-amber-300">
              Combating agricultural misinformation with AI technology
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
