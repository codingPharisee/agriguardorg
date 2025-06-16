
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
    { name: "News", href: "/news" },
    { name: "Fact Check", href: "/fact-check" },
    { name: "About", href: "/about" },
  ];

  const toolsItems = [
    { name: "ViralFarm", href: "/viral-farm" },
    { name: "MythBuster Ag", href: "/myth-buster" },
    { name: "Integrated Ecosystem", href: "/ecosystem" },
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
            <div className="bg-green-600 text-white px-3 py-2 font-bold rounded">
              <div className="flex flex-col items-center">
                <Leaf className="h-5 w-5 mb-1" />
                <span className="text-sm">AgriGuard</span>
              </div>
            </div>
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
              <DropdownMenuContent>
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tools</h3>
                  {toolsItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-gray-600 hover:text-green-600 transition-colors py-1"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <Button variant="outline" className="w-full text-green-600 border-green-600 hover:bg-green-50" asChild>
                    <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
                  </Button>
                  
                  {user ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Welcome!</p>
                      <Button onClick={() => { handleSignOut(); setIsOpen(false); }} variant="outline" className="w-full">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
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
