import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AreaChips from "@/components/AreaChips";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyGrid from "@/components/PropertyGrid";
import { MOCK_PROPERTIES, RENT_RANGES, type PuneArea, type PropertyType } from "@/lib/constants";

interface FilterValues {
  area: PuneArea | null;
  propertyType: PropertyType | null;
  rentRange: [number, number];
}

const Index = () => {
  const [filters, setFilters] = useState<FilterValues>({
    area: null,
    propertyType: null,
    rentRange: [RENT_RANGES.min, RENT_RANGES.max],
  });

  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((property) => {
      if (property.status !== "approved") return false;
      if (filters.area && property.area !== filters.area) return false;
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
      if (property.rent < filters.rentRange[0] || property.rent > filters.rentRange[1]) return false;
      return true;
    });
  }, [filters]);

  const handleAreaChipSelect = (area: PuneArea | null) => {
    setFilters((prev) => ({ ...prev, area }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <HeroSection />

        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Quick Area Chips */}
          <section>
            <h2 className="font-display font-semibold text-lg text-foreground mb-3">
              Popular Areas
            </h2>
            <AreaChips 
              selectedArea={filters.area} 
              onSelectArea={handleAreaChipSelect} 
            />
          </section>

          {/* Filters */}
          <PropertyFilters filters={filters} onFilterChange={setFilters} />

          {/* Results */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-foreground">
                {filters.area ? `Rentals in ${filters.area}` : "All Rentals in Pune"}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
              </span>
            </div>
            <PropertyGrid properties={filteredProperties} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
