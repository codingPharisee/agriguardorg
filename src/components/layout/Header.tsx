
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, Leaf, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "Fact Check", href: "/fact-check" },
    { name: "About", href: "/about" },
  ];

  const toolsItems = [
    { name: "All Tools", href: "/tools" },
    { name: "ViralFarm", href: "/viral-farm" },
    { name: "MythBuster Ag", href: "/myth-buster" },
    { name: "Pest Identification", href: "/pest-identification" },
    { name: "Crop Recommendations", href: "/crop-recommendations" },
    
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/agrifact-logo-professional.png" 
              alt="AgriFact Hub"
              className="h-16 w-auto rounded"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                  Tools <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-green-200 shadow-lg rounded-md z-50 min-w-[180px]">
                {toolsItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.href}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" asChild>
              <Link to="/contact">Contact</Link>
            </Button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome!</span>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] bg-gradient-to-br from-green-50 to-white border-l-4 border-green-400 shadow-xl">
              <div className="flex flex-col space-y-3 mt-4">
                <div className="text-center pb-3 border-b border-green-200">
                  <h2 className="text-lg font-bold text-green-700">Menu</h2>
                </div>
                
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium py-2 px-3 rounded-md text-sm animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="border-t border-green-200 pt-3">
                  <h3 className="font-semibold text-green-700 mb-2 text-sm px-3">Tools</h3>
                  {toolsItems.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 py-1.5 px-3 rounded-md text-sm"
                      style={{ animationDelay: `${(index + 4) * 50}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="border-t border-green-200 pt-3 space-y-2">
                  <Button variant="outline" size="sm" className="w-full text-green-600 border-green-400 hover:bg-green-50 text-xs" asChild>
                    <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
                  </Button>
                  
                  {user ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 text-center">Welcome!</p>
                      <Button onClick={() => { handleSignOut(); setIsOpen(false); }} variant="outline" size="sm" className="w-full text-xs">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-xs" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
