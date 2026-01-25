import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Plus, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-foreground leading-tight">
                RentCircle
              </span>
              <span className="text-xs text-primary font-medium -mt-0.5">Pune</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Browse Rentals
            </Link>
            <Link 
              to="/guidelines" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Guidelines
            </Link>
            <Link to="/post-property">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Post Property
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Rentals
              </Link>
              <Link 
                to="/guidelines" 
                className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guidelines
              </Link>
              <Link 
                to="/post-property"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Post Property
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
