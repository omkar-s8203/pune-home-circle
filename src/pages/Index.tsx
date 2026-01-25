import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AreaChips from "@/components/AreaChips";
import PropertyFilters from "@/components/PropertyFilters";
import PropertyGrid from "@/components/PropertyGrid";
import { useApprovedProperties } from "@/hooks/useProperties";
import { RENT_RANGES, type PuneArea, type PropertyType } from "@/lib/constants";

interface FilterValues {
  area: PuneArea | null;
  propertyType: PropertyType | null;
  rentRange: [number, number];
}

const Index = () => {
  const { data: properties, isLoading } = useApprovedProperties();
  
  const [filters, setFilters] = useState<FilterValues>({
    area: null,
    propertyType: null,
    rentRange: [RENT_RANGES.min, RENT_RANGES.max],
  });

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    return properties.filter((property) => {
      if (filters.area && property.area !== filters.area) return false;
      if (filters.propertyType && property.property_type !== filters.propertyType) return false;
      if (property.rent < filters.rentRange[0] || property.rent > filters.rentRange[1]) return false;
      return true;
    });
  }, [properties, filters]);

  const handleAreaChipSelect = (area: PuneArea | null) => {
    setFilters((prev) => ({ ...prev, area }));
  };

  // Transform properties to match PropertyCard interface
  const displayProperties = filteredProperties.map(p => ({
    id: p.id,
    title: p.title,
    propertyType: p.property_type as PropertyType,
    rent: p.rent,
    area: p.area as PuneArea,
    description: p.description || "",
    images: p.images?.map(img => img.image_url) || [],
    ownerName: p.profile?.full_name || "Property Owner",
    ownerPhone: p.profile?.phone || "",
    ownerEmail: p.profile?.email || "",
    mapLink: p.map_link || undefined,
    createdAt: new Date(p.created_at),
    status: p.status,
    featured: false,
  }));

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
                {displayProperties.length} {displayProperties.length === 1 ? "property" : "properties"} found
              </span>
            </div>
            <PropertyGrid properties={displayProperties} loading={isLoading} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
