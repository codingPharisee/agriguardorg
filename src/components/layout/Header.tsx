
import React from "react";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary-dark">AgriGuard</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">About</Button>
          <Button variant="default" size="sm">Login</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
