import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Phone, MessageCircle, MapPin, IndianRupee, Share2, Copy, Check, Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Property, PROPERTY_TYPES } from "@/lib/constants";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const propertyTypeLabel = PROPERTY_TYPES.find(t => t.value === property.propertyType)?.label;
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [flagging, setFlagging] = useState(false);

  const propertyUrl = `${window.location.origin}/property/${property.id}`;
  const ownerPhone = (property as any).phone || property.profile?.phone || property.ownerPhone;

  const handleFlagForReview = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (flagging) return;
    setFlagging(true);

    try {
      const { error } = await supabase.from("reports").insert({
        property_id: property.id,
        reason: "Flagged for review",
      });

      if (error) throw error;

      toast({
        title: "Property flagged",
        description: "This listing has been sent to admin for review.",
      });
    } catch (error) {
      toast({
        title: "Failed to flag",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setFlagging(false);
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ownerPhone) {
      window.location.href = `tel:${ownerPhone}`;
    } else {
      toast({ title: "Phone number not available", variant: "destructive" });
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ownerPhone) {
      const message = encodeURIComponent(`Hi, I'm interested in your ${propertyTypeLabel || "property"} property in ${property.area} listed on RentCircle Pune.`);
      window.open(`https://wa.me/91${ownerPhone}?text=${message}`, "_blank");
    } else {
      toast({ title: "Phone number not available", variant: "destructive" });
    }
  };

  const handleMap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.mapLink) {
      window.open(property.mapLink, "_blank");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share it with anyone." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Check out this ${propertyTypeLabel} in ${property.area} for ₹${new Intl.NumberFormat("en-IN").format(property.rent)}/month on RentCircle Pune:\n${propertyUrl}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat("en-IN").format(rent);
  };

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden card-hover group">
      {/* Image - wrapped in Link */}
      <Link to={`/property/${property.id}`}>
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
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Area - wrapped in Link */}
        <Link to={`/property/${property.id}`}>
          <div>
            <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {property.area}, Pune
            </p>
          </div>
        </Link>

        {/* Rent */}
        <div className="flex items-center gap-1">
          <IndianRupee className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-xl text-foreground">
            {formatRent(property.rent)}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>

        {/* Actions - NOT wrapped in Link */}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="px-3"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareWhatsApp} className="gap-2 cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                Share on WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFlagForReview} disabled={flagging} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                <Flag className="w-4 h-4" />
                {flagging ? "Flagging..." : "Flag for Review"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
