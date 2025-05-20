import { Home, Search, Heart, PawPrint, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Sidebar = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: <Home className="mr-3 h-5 w-5" /> },
    { href: "/pets", label: "Pets", icon: <PawPrint className="mr-3 h-5 w-5" /> },
    { href: "/favorites", label: "Favorites", icon: <Heart className="mr-3 h-5 w-5" /> },
    { href: "/adoptions", label: "Adoptions", icon: <Search className="mr-3 h-5 w-5" /> },
  ];

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <div className="flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-semibold text-gray-800">PetAdopt</span>
            </div>
          </div>

          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
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
          </nav>

          <div className="mt-auto px-3 py-4 border-t border-gray-200">
            {user && (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.email}</p>
                  <button
                    onClick={logout}
                    className="text-xs font-medium text-gray-500 hover:text-primary-600 flex items-center mt-1"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
