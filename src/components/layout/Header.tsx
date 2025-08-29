import React from "react";
import { Link } from "react-router-dom";
import { Menu, Sprout, ChevronDown, Shield } from "lucide-react";
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
    <header className="bg-background/95 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Professional Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Sprout className="h-6 w-6" />
              </div>
              <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full p-1">
                <Shield className="h-3 w-3" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                AgriGuard
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                Tech Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-4 py-2 text-foreground hover:text-primary transition-all duration-200 font-medium rounded-lg hover:bg-secondary/50 relative group"
              >
                {item.name}
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary hover:bg-secondary/50 font-medium px-4 py-2 rounded-lg"
                >
                  Tools 
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-card/95 backdrop-blur-lg border border-border shadow-lg rounded-xl min-w-[200px] p-2"
                align="center"
              >
                {toolsItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link 
                      to={item.href}
                      className="px-3 py-2 rounded-lg hover:bg-secondary/80 transition-colors duration-200 cursor-pointer"
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 font-medium px-6 rounded-xl" 
              asChild
            >
              <Link to="/contact">Contact</Link>
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Welcome back!</span>
                </div>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline"
                  className="border-muted-foreground/20 hover:bg-secondary/80 rounded-xl px-6"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200" 
                asChild
              >
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-secondary/50 rounded-xl">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[320px] bg-card/95 backdrop-blur-xl border-l border-border"
            >
              <div className="flex flex-col space-y-6 mt-8">
                <div className="text-center pb-4 border-b border-border">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                      <Sprout className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">AgriGuard</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">Navigation Menu</p>
                </div>
                
                <nav className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center text-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200 font-medium py-3 px-4 rounded-xl animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-3 text-sm px-4 uppercase tracking-wide">
                    Agricultural Tools
                  </h3>
                  <div className="space-y-1">
                    {toolsItems.map((item, index) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200 py-2.5 px-4 rounded-lg text-sm"
                        style={{ animationDelay: `${(index + 4) * 50}ms` }}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-border pt-6 space-y-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-primary/20 text-primary hover:bg-primary/5 rounded-xl" 
                    asChild
                  >
                    <Link to="/contact" onClick={() => setIsOpen(false)}>Contact Us</Link>
                  </Button>
                  
                  {user ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        Welcome back!
                      </p>
                      <Button 
                        onClick={() => { handleSignOut(); setIsOpen(false); }} 
                        variant="outline" 
                        size="lg" 
                        className="w-full rounded-xl"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl shadow-md" 
                      asChild
                    >
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Get Started</Link>
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