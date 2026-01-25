import { Link } from "react-router-dom";
import { Home, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              A trusted community platform for direct owner-to-tenant rentals in Pune. No brokers, no hassle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Rentals
                </Link>
              </li>
              <li>
                <Link to="/post-property" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Post Property
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Popular Areas</h4>
            <ul className="space-y-2">
              {["Baner", "Wakad", "Hinjewadi", "Kothrud", "Kharadi"].map((area) => (
                <li key={area}>
                  <Link 
                    to={`/?area=${area}`} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Rentals in {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> for Pune residents
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
