
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, UserRound, MessageSquare, Info, ShoppingCart, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ContactFormDialog from "@/components/forms/ContactFormDialog";

const Header = () => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Dynamic button colors based on current page
  const getButtonClasses = () => {
    if (isHomePage) {
      return "bg-amber-400 text-black hover:bg-amber-500";
    }
    return "bg-amber-600 text-white hover:bg-amber-700";
  };

  const getNavLinkClasses = () => {
    if (isHomePage) {
      return "hover:text-amber-400 transition-colors font-medium tracking-wide text-white";
    }
    return "hover:text-amber-400 transition-colors font-medium tracking-wide text-amber-900";
  };

  const getIconClasses = () => {
    if (isHomePage) {
      return "h-5 w-5 text-white hover:text-amber-400 cursor-pointer transition-colors";
    }
    return "h-5 w-5 text-amber-800 hover:text-amber-600 cursor-pointer transition-colors";
  };

  return (
    <header className={`${isHomePage ? 'absolute' : 'relative'} top-0 left-0 right-0 z-20 ${isHomePage ? 'bg-transparent' : 'bg-white shadow-md'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="bg-amber-400 text-black px-4 py-2 font-bold text-lg">
            <div className="flex flex-col items-center">
              <Leaf className="h-6 w-6 mb-1" />
              <span>AgriG</span>
            </div>
          </Link>
          <span className={`ml-3 font-bold text-xl ${isHomePage ? 'text-white' : 'text-amber-900'}`}>
            AgriGuard Company
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={getNavLinkClasses()}>
            HOME
          </Link>
          
          {/* Pages Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`${getNavLinkClasses()} flex items-center gap-1`}>
              PAGES <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-lg border border-amber-200">
              <DropdownMenuItem asChild>
                <Link to="/about" className="text-amber-900 hover:text-amber-600 hover:bg-amber-50">
                  About Us
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/fact-check" className="text-amber-900 hover:text-amber-600 hover:bg-amber-50">
                  Fact Check
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/viral-farm" className="text-amber-900 hover:text-amber-600 hover:bg-amber-50">
                  Viral Farm
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/fact-check" className={getNavLinkClasses()}>
            SHOP
          </Link>
          <Link to="/viral-farm" className={getNavLinkClasses()}>
            BLOG
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <UserRound className={getIconClasses()} />
          <ShoppingCart className={getIconClasses()} />
          
          <Button 
            className={`${getButtonClasses()} px-6 py-2 rounded-full font-medium tracking-wide transition-all`}
            onClick={() => setContactFormOpen(true)}
          >
            CONTACT
          </Button>
        </div>
      </div>

      <ContactFormDialog 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen} 
      />
    </header>
  );
};

export default Header;
