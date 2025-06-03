
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, UserRound, MessageSquare, Info, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: ""
  });

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="bg-amber-400 text-black px-4 py-2 font-bold text-lg">
            <div className="flex flex-col items-center">
              <Leaf className="h-6 w-6 mb-1" />
              <span>AGRO</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-white">
          <Link to="/" className="hover:text-amber-400 transition-colors font-medium tracking-wide">
            HOME
          </Link>
          <Link to="/about" className="hover:text-amber-400 transition-colors font-medium tracking-wide">
            PAGES
          </Link>
          <Link to="/fact-check" className="hover:text-amber-400 transition-colors font-medium tracking-wide">
            SHOP
          </Link>
          <Link to="/viral-farm" className="hover:text-amber-400 transition-colors font-medium tracking-wide">
            BLOG
          </Link>
          <Link to="/about" className="hover:text-amber-400 transition-colors font-medium tracking-wide">
            CONTACT
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <UserRound className="h-5 w-5 text-white hover:text-amber-400 cursor-pointer transition-colors" />
          <ShoppingCart className="h-5 w-5 text-white hover:text-amber-400 cursor-pointer transition-colors" />
          
          <Button 
            className="bg-amber-400 text-black hover:bg-amber-500 px-6 py-2 rounded-full font-medium tracking-wide transition-all"
            onClick={() => setIsSignedIn(!isSignedIn)}
          >
            GET IN TOUCH
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
