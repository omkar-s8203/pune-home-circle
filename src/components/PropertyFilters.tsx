import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PUNE_AREAS, PROPERTY_TYPES, RENT_RANGES, type PuneArea, type PropertyType } from "@/lib/constants";
import { Filter, X } from "lucide-react";

interface FilterValues {
  area: PuneArea | null;
  propertyType: PropertyType | null;
  rentRange: [number, number];
}

interface PropertyFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

const PropertyFilters = ({ filters, onFilterChange }: PropertyFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatRent = (value: number) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}k`;
    }
    return `₹${value}`;
  };

  const handleReset = () => {
    onFilterChange({
      area: null,
      propertyType: null,
      rentRange: [RENT_RANGES.min, RENT_RANGES.max],
    });
  };

  const hasActiveFilters = filters.area || filters.propertyType || 
    filters.rentRange[0] !== RENT_RANGES.min || filters.rentRange[1] !== RENT_RANGES.max;

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      {/* Mobile Toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </span>
          <span>{isOpen ? "−" : "+"}</span>
        </Button>
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? "mt-4" : "hidden"} md:block space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Area Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <Select
              value={filters.area || "all"}
              onValueChange={(value) => 
                onFilterChange({ ...filters, area: value === "all" ? null : value as PuneArea })
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Areas</SelectItem>
                {PUNE_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Property Type</label>
            <Select
              value={filters.propertyType || "all"}
              onValueChange={(value) => 
                onFilterChange({ ...filters, propertyType: value === "all" ? null : value as PropertyType })
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Types</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rent Range Slider */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Rent Range</label>
              <span className="text-sm text-muted-foreground">
                {formatRent(filters.rentRange[0])} - {formatRent(filters.rentRange[1])}
              </span>
            </div>
            <Slider
              value={filters.rentRange}
              onValueChange={(value) => 
                onFilterChange({ ...filters, rentRange: value as [number, number] })
              }
              min={RENT_RANGES.min}
              max={RENT_RANGES.max}
              step={RENT_RANGES.step}
              className="py-2"
            />
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;
