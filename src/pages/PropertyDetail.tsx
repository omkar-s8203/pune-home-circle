import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  IndianRupee, 
  ArrowLeft, 
  Flag,
  Calendar,
  Home,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { MOCK_PROPERTIES, PROPERTY_TYPES } from "@/lib/constants";
import { useState } from "react";

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  const property = MOCK_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Home className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-2">
            Property Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const propertyTypeLabel = PROPERTY_TYPES.find(t => t.value === property.propertyType)?.label;

  const handleCall = () => {
    window.location.href = `tel:${property.ownerPhone}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your ${propertyTypeLabel} property in ${property.area} listed on RentCircle Pune.`);
    window.open(`https://wa.me/91${property.ownerPhone}?text=${message}`, "_blank");
  };

  const handleMap = () => {
    if (property.mapLink) {
      window.open(property.mapLink, "_blank");
    }
  };

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat("en-IN").format(rent);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                <img
                  src={property.images[currentImage]}
                  alt={`${property.title} - Image ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {property.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImage ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <Badge className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-foreground">
                  {currentImage + 1} / {property.images.length}
                </Badge>
              </div>

              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImage ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Property Details */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{propertyTypeLabel}</Badge>
                    {property.featured && (
                      <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                    )}
                  </div>
                  <h1 className="font-display font-bold text-2xl text-foreground mb-2">
                    {property.title}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.area}, Pune
                  </p>
                </div>

                <div className="flex items-center gap-1 py-4 border-y border-border">
                  <IndianRupee className="w-6 h-6 text-primary" />
                  <span className="font-display font-bold text-3xl text-foreground">
                    {formatRent(property.rent)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <div>
                  <h2 className="font-display font-semibold text-lg text-foreground mb-3">
                    Description
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Posted on {formatDate(property.createdAt)}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Actions */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4 sticky top-24">
                <h2 className="font-display font-semibold text-lg text-foreground">
                  Contact Owner
                </h2>
                
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{property.ownerName}</p>
                  <p className="text-sm text-muted-foreground">
                    Verified owner on RentCircle
                  </p>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleCall} className="w-full gap-2 bg-primary hover:bg-primary/90">
                    <Phone className="w-4 h-4" />
                    Call {property.ownerPhone}
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="w-full gap-2 border-success text-success hover:bg-success hover:text-success-foreground"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  {property.mapLink && (
                    <Button onClick={handleMap} variant="outline" className="w-full gap-2">
                      <MapPin className="w-4 h-4" />
                      View on Google Maps
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
                    <Flag className="w-4 h-4" />
                    Report this listing
                  </button>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-secondary rounded-xl p-5">
                <h3 className="font-display font-semibold text-foreground mb-3">
                  Safety Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Visit the property in person before paying</li>
                  <li>• Never pay advance without a proper agreement</li>
                  <li>• Verify owner's identity and documents</li>
                  <li>• Meet in safe, public areas if possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
