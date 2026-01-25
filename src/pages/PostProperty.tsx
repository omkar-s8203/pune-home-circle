import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useCreateProperty, useUploadPropertyImages } from "@/hooks/useProperties";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle, Home, Loader2, Upload, X } from "lucide-react";
import { PUNE_AREAS, PROPERTY_TYPES } from "@/lib/constants";

const PostProperty = () => {
  const { user, loading: authLoading } = useAuth();
  const createProperty = useCreateProperty();
  const uploadImages = useUploadPropertyImages();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    rent: "",
    area: "",
    description: "",
    mapLink: "",
    phone: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({ title: "Maximum 5 images allowed", variant: "destructive" });
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length < 2) {
      toast({ title: "Please upload at least 2 images", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const property = await createProperty.mutateAsync({
        title: formData.title,
        property_type: formData.propertyType,
        rent: parseInt(formData.rent),
        area: formData.area,
        description: formData.description,
        map_link: formData.mapLink || undefined,
        phone: formData.phone,
      });

      await uploadImages.mutateAsync({ propertyId: property.id, files: images });

      setSuccess(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="bg-card rounded-xl border border-border p-8 text-center max-w-md mx-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-3">
              Submitted Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your property has been submitted for review. Our team will approve it within 24-48 hours.
            </p>
            <Link to="/my-listings">
              <Button className="gap-2">
                <Home className="w-4 h-4" />
                View My Listings
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-2xl text-foreground mb-2">Post Your Property</h1>
          <p className="text-muted-foreground mb-6">List your property for free. No brokers.</p>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(v) => setFormData(p => ({ ...p, propertyType: v }))} required>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent (₹) *</Label>
                <Input type="number" placeholder="15000" value={formData.rent} onChange={(e) => setFormData(p => ({ ...p, rent: e.target.value }))} required min="1000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Area/Location *</Label>
              <Select value={formData.area} onValueChange={(v) => setFormData(p => ({ ...p, area: v }))} required>
                <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {PUNE_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Property Title *</Label>
              <Input placeholder="e.g., Spacious 2BHK near IT Park" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} required />
            </div>

            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input type="tel" placeholder="9876543210" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} required pattern="[0-9]{10}" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe amenities, nearby facilities..." value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={4} />
            </div>

            <div className="space-y-2">
              <Label>Google Maps Link (optional)</Label>
              <Input type="url" placeholder="https://maps.google.com/..." value={formData.mapLink} onChange={(e) => setFormData(p => ({ ...p, mapLink: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label>Property Images (2-5 photos) *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" id="images" />
                <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload images</span>
                </label>
              </div>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit for Review <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostProperty;
