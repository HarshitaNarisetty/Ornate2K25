
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut } from "lucide-react";
import { ButtonEffect } from "@/components/ui/button-effect";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/App";

const NavigationMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const routes = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Admin", path: "/admin", protected: true },
  ];

  // Filter routes based on authentication status
  const filteredRoutes = routes.filter(route => 
    !route.protected || (route.protected && isAuthenticated)
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
          isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="text-2xl font-semibold tracking-tight transition-colors hover:text-primary"
            >
              TechZeon
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {filteredRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary animated-underline pb-1",
                    location.pathname === route.path ? "text-primary after:w-full" : "text-foreground/80"
                  )}
                >
                  {route.name}
                </Link>
              ))}
              <ButtonEffect 
                variant="primary" 
                size="sm" 
                icon={isAuthenticated ? <LogOut size={16} /> : <User size={16} />} 
                onClick={handleAuthClick}
              >
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </ButtonEffect>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/90 backdrop-blur-sm md:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 p-6 space-y-6">
          {filteredRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "text-lg font-medium py-2 transition-colors border-b border-border",
                location.pathname === route.path
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              )}
            >
              {route.name}
            </Link>
          ))}
          <ButtonEffect 
            variant="primary" 
            className="w-full mt-4" 
            icon={isAuthenticated ? <LogOut size={18} /> : <User size={18} />}
            onClick={() => {
              setIsMenuOpen(false);
              handleAuthClick();
            }}
          >
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </ButtonEffect>
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default NavigationMenu;
