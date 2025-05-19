import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { PawPrint, Menu, X, Home, Heart, Search, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const MobileNav = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: <Home className="h-5 w-5 mr-3" /> },
    { href: "/pets", label: "Pets", icon: <PawPrint className="h-5 w-5 mr-3" /> },
    { href: "/favorites", label: "Favorites", icon: <Heart className="h-5 w-5 mr-3" /> },
    { href: "/adoptions", label: "Adoptions", icon: <Search className="h-5 w-5 mr-3" /> },
  ];

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const closeSheet = () => setIsOpen(false);

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <PawPrint className="h-5 w-5 text-primary-600" />
            <span className="text-lg font-semibold text-gray-800">PetAdopt</span>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="text-gray-500 focus:outline-none">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px] pt-12">
              <SheetHeader>
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button 
                    onClick={closeSheet}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </SheetHeader>
              <div className="flex-1 px-2 space-y-1 mt-6">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      onClick={closeSheet}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        location === item.href
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  </Link>
                ))}
              </div>

              {user && (
                <div className="px-3 py-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                      <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{user.email}</p>
                      <button
                        onClick={() => {
                          logout();
                          closeSheet();
                        }}
                        className="text-xs font-medium text-gray-500 hover:text-primary-600 flex items-center mt-1"
                      >
                        <LogOut className="h-3 w-3 mr-1" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden border-t border-gray-200 fixed bottom-0 left-0 right-0 bg-white z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`inline-flex flex-col items-center justify-center px-3 py-2 ${
                  location === item.href ? "text-primary-600" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <div className="flex-shrink-0">{item.icon.props.children}</div>
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNav;
