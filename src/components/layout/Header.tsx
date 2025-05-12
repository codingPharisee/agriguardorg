
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  // This would typically come from a context or auth service
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "" // Empty string for using the fallback
  });

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary-dark">AgriGuard</h1>
        </div>
        <div className="flex gap-3 items-center">
          <Button variant="outline" size="sm">About</Button>
          
          {isSignedIn ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block">{user.name}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[200px] p-2">
                    <div className="flex flex-col gap-2">
                      <div className="px-2 py-1.5 text-sm text-gray-500">{user.email}</div>
                      <Button variant="ghost" size="sm" className="justify-start">Profile</Button>
                      <Button variant="ghost" size="sm" className="justify-start">Settings</Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <Button variant="default" size="sm" onClick={handleSignIn}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
