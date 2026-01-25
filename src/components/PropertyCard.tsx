import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, MapPin, Home, IndianRupee } from "lucide-react";
import { type Property, PROPERTY_TYPES } from "@/lib/constants";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const propertyTypeLabel = PROPERTY_TYPES.find(t => t.value === property.propertyType)?.label;

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `tel:${property.ownerPhone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(`Hi, I'm interested in your ${propertyTypeLabel} property in ${property.area} listed on RentCircle Pune.`);
    window.open(`https://wa.me/91${property.ownerPhone}?text=${message}`, "_blank");
  };

  const handleMap = (e: React.MouseEvent) => {
    e.preventDefault();
    if (property.mapLink) {
      window.open(property.mapLink, "_blank");
    }
  };

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat("en-IN").format(rent);
  };

  return (
    <Link to={`/property/${property.id}`}>
      <article className="bg-card rounded-xl border border-border overflow-hidden card-hover group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {property.featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              Featured
            </Badge>
          )}
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-foreground"
          >
            {propertyTypeLabel}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title & Area */}
          <div>
            <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {property.area}, Pune
            </p>
          </div>

          {/* Rent */}
          <div className="flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">
              {formatRent(property.rent)}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={handleCall}
              className="flex-1 bg-primary hover:bg-primary/90 gap-1.5"
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleWhatsApp}
              className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            {property.mapLink && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMap}
                className="px-3"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PropertyCard;
