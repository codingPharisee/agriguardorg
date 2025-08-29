import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import ContactFormDialog from "@/components/forms/ContactFormDialog";
import { 
  Menu, 
  ChevronDown, 
  Leaf, 
  Microscope, 
  Sprout, 
  Shield, 
  Video, 
  Users,
  LogOut,
  UserCircle
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Blogs", path: "/blogs" },
  ];

  const aiToolsMenu = [
    { 
      name: "Fact Check", 
      path: "/fact-check", 
      icon: Shield,
      description: "Verify agricultural claims"
    },
    { 
      name: "Pest Detection", 
      path: "/pest-identification", 
      icon: Microscope,
      description: "Identify crop threats"
    },
    { 
      name: "Crop Recommendations", 
      path: "/crop-recommendations", 
      icon: Sprout,
      description: "Smart farming advice"  
    },
    { 
      name: "Video Generation", 
      path: "/myth-buster", 
      icon: Video,
      description: "Create educational content"
    },
    { 
      name: "ViralFarm Monitor", 
      path: "/viral-farm", 
      icon: Users,
      description: "Track misinformation"
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse-soft"></div>
              </div>
              <div>
                <span className="text-2xl font-bold ag-text-gradient">AgriGuard</span>
                <div className="text-xs text-muted-foreground font-medium">Tech Solutions</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link key={item.name} to={item.path}>
                  <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 font-medium transition-all duration-300">
                    {item.name}
                  </Button>
                </Link>
              ))}

              {/* AI Tools Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/5 px-4 py-2 font-medium transition-all duration-300">
                    AI Tools
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-2">
                  {aiToolsMenu.map((tool) => (
                    <DropdownMenuItem key={tool.name} asChild className="p-0">
                      <Link 
                        to={tool.path} 
                        className="flex items-start space-x-3 rounded-lg p-3 hover:bg-primary/5 transition-colors duration-300"
                      >
                        <div className="ag-feature-icon w-10 h-10 p-2">
                          <tool.icon className="h-full w-full" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{tool.name}</div>
                          <div className="text-sm text-muted-foreground">{tool.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center space-x-3 ml-6">
                <Button 
                  variant="outline" 
                  onClick={() => setContactFormOpen(true)}
                  className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Get Started
                </Button>

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <UserCircle className="h-4 w-4" />
                        <span className="text-sm">{user.email?.split('@')[0]}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/auth">
                    <Button className="ag-btn-primary py-3 px-6">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <span className="text-xl font-bold ag-text-gradient">AgriGuard</span>
                        <div className="text-xs text-muted-foreground">Tech Solutions</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto">
                    <nav className="p-6 space-y-1">
                      {navigationItems.map((item) => (
                        <Link 
                          key={item.name} 
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-foreground hover:bg-primary/5 hover:text-primary transition-all duration-300 font-medium"
                        >
                          {item.name}
                        </Link>
                      ))}

                      <div className="pt-4">
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
                          AI Tools
                        </div>
                        {aiToolsMenu.map((tool) => (
                          <Link 
                            key={tool.name}
                            to={tool.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-start space-x-3 px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                          >
                            <div className="ag-feature-icon w-8 h-8 p-1.5">
                              <tool.icon className="h-full w-full" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{tool.name}</div>
                              <div className="text-xs text-muted-foreground">{tool.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </nav>
                  </div>

                  {/* Mobile Footer */}
                  <div className="p-6 border-t border-border space-y-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setContactFormOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Get Started
                    </Button>

                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
                          <UserCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{user.email}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={handleSignOut}
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        <Button className="ag-btn-primary w-full">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <ContactFormDialog
        open={contactFormOpen}
        onOpenChange={setContactFormOpen}
      />
    </>
  );
};

export default Header;