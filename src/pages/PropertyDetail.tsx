import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ChevronRight,
  Loader2,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { useProperty } from "@/hooks/useProperties";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PROPERTY_TYPES } from "@/lib/constants";
import { useState } from "react";

const PropertyDetail = () => {
  const { id } = useParams();
  const { data: property, isLoading } = useProperty(id || "");
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [copied, setCopied] = useState(false);

  const propertyUrl = typeof window !== "undefined" ? `${window.location.origin}/property/${id}` : "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

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

  const propertyTypeLabel = PROPERTY_TYPES.find(t => t.value === property.property_type)?.label;
  const images = property.images?.map(img => img.image_url) || [];
  const ownerPhone = property.profile?.phone || "";
  const ownerName = property.profile?.full_name || "Property Owner";

  const handleCall = () => {
    if (ownerPhone) {
      window.location.href = `tel:${ownerPhone}`;
    }
  };

  const handleWhatsApp = () => {
    if (ownerPhone) {
      const message = encodeURIComponent(`Hi, I'm interested in your ${propertyTypeLabel} property in ${property.area} listed on RentCircle Pune.`);
      window.open(`https://wa.me/91${ownerPhone}?text=${message}`, "_blank");
    }
  };

  const handleMap = () => {
    if (property.map_link) {
      window.open(property.map_link, "_blank");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share it with anyone." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Check out this ${propertyTypeLabel} in ${property.area} for ₹${formatRent(property.rent)}/month on RentCircle Pune:\n${propertyUrl}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    setSubmittingReport(true);
    
    try {
      const { error } = await supabase.from("reports").insert({
        property_id: property.id,
        reporter_email: reporterEmail || null,
        reason: reportReason,
      });

      if (error) throw error;
      
      toast({ title: "Report submitted", description: "Thank you for helping keep RentCircle safe." });
      setReportDialogOpen(false);
      setReportReason("");
      setReporterEmail("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmittingReport(false);
    }
  };

  const formatRent = (rent: number) => new Intl.NumberFormat("en-IN").format(rent);
  const formatDate = (date: string) => new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

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
                {images.length > 0 ? (
                  <img
                    src={images[currentImage]}
                    alt={`${property.title} - Image ${currentImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No images available
                  </div>
                )}
                
                {images.length > 1 && (
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
                      {images.map((_, idx) => (
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

                {images.length > 0 && (
                  <Badge className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-foreground">
                    {currentImage + 1} / {images.length}
                  </Badge>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
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

                {property.description && (
                  <div>
                    <h2 className="font-display font-semibold text-lg text-foreground mb-3">
                      Description
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Posted on {formatDate(property.created_at)}
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
                  <p className="font-medium text-foreground">{ownerName}</p>
                  <p className="text-sm text-muted-foreground">
                    Verified owner on RentCircle
                  </p>
                </div>

                <div className="space-y-3">
                  {ownerPhone ? (
                    <>
                      <Button onClick={handleCall} className="w-full gap-2 bg-primary hover:bg-primary/90">
                        <Phone className="w-4 h-4" />
                        Call {ownerPhone}
                      </Button>
                      <Button
                        onClick={handleWhatsApp}
                        variant="outline"
                        className="w-full gap-2 border-success text-success hover:bg-success hover:text-success-foreground"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Contact information not available
                    </p>
                  )}
                  {property.map_link && (
                    <Button onClick={handleMap} variant="outline" className="w-full gap-2">
                      <MapPin className="w-4 h-4" />
                      View on Google Maps
                    </Button>
                  )}
                  
                  {/* Share Buttons */}
                  <div className="flex gap-2">
                    <Button onClick={handleCopyLink} variant="outline" className="flex-1 gap-2">
                      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button onClick={handleShareWhatsApp} variant="outline" className="flex-1 gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
                        <Flag className="w-4 h-4" />
                        Report this listing
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report Listing</DialogTitle>
                        <DialogDescription>
                          Help us keep RentCircle safe. Tell us why this listing is problematic.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reporterEmail">Your Email (optional)</Label>
                          <Input
                            id="reporterEmail"
                            type="email"
                            placeholder="your@email.com"
                            value={reporterEmail}
                            onChange={(e) => setReporterEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason">Reason for Report</Label>
                          <Textarea
                            id="reason"
                            placeholder="Please describe the issue..."
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleReport} 
                          disabled={!reportReason.trim() || submittingReport}
                        >
                          {submittingReport ? "Submitting..." : "Submit Report"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
