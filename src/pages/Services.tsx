import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useServices, useCreateServiceRequest } from "@/hooks/useServices";
import { useAuth } from "@/hooks/useAuth";
import { Service } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, IndianRupee, Wrench, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Services = () => {
  const { data: services, isLoading } = useServices();
  const { user } = useAuth();
  const createRequest = useCreateServiceRequest();
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestService = (service: Service) => {
    setSelectedService(service);
    // Pre-fill email if user is logged in
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setIsSubmitting(true);
    try {
      await createRequest.mutateAsync({
        service_id: selectedService.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        message: formData.message || undefined,
        user_id: user?.id,
      });
      
      toast.success("Service request submitted! We'll contact you soon.");
      setSelectedService(null);
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Wrench className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
            Our Services
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our range of rental and property-related services. Request any service and we'll get back to you shortly.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {service.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={service.image_url} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  {service.description && (
                    <CardDescription className="line-clamp-3">
                      {service.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                    <IndianRupee className="w-5 h-5" />
                    {service.price.toLocaleString("en-IN")}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleRequestService(service)}
                  >
                    Request Service
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services available at the moment.</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Service Request Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request: {selectedService?.title}</DialogTitle>
            <DialogDescription>
              Fill in your details and we'll contact you regarding this service.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="your@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
                placeholder="Your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Your address (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Any additional details..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedService(null)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
