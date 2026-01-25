import { Search, Shield, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative gradient-hero text-primary-foreground py-12 md:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full" />
        <div className="absolute bottom-10 right-20 w-48 h-48 border border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/20 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 animate-fade-in">
            Find Your Perfect Home in Pune
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in">
            Direct owner-to-tenant rentals. No brokers. No brokerage fees.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 animate-fade-in">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Verified Listings</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Community Trusted</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Search className="w-5 h-5" />
              <span className="text-sm font-medium">100% Free Browsing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
