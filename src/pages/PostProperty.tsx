import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Home, ArrowRight, CheckCircle } from "lucide-react";
import { PUNE_AREAS, PROPERTY_TYPES } from "@/lib/constants";

type Step = "auth" | "form" | "success";

const PostProperty = () => {
  const [step, setStep] = useState<Step>("auth");
  const [email, setEmail] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would trigger email verification
    setStep("form");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to the database
    setStep("success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Post Your Property
            </h1>
            <p className="text-primary-foreground/90 max-w-xl mx-auto">
              List your property for free and connect directly with tenants. No broker fees, no hidden charges.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className={`flex items-center gap-2 ${step === "auth" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "auth" ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"
                }`}>
                  {step === "form" || step === "success" ? <CheckCircle className="w-4 h-4" /> : "1"}
                </div>
                <span className="text-sm font-medium hidden sm:inline">Verify Email</span>
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div className={`flex items-center gap-2 ${step === "form" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "form" ? "bg-primary text-primary-foreground" : 
                  step === "success" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {step === "success" ? <CheckCircle className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-sm font-medium hidden sm:inline">Property Details</span>
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div className={`flex items-center gap-2 ${step === "success" ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "success" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  3
                </div>
                <span className="text-sm font-medium hidden sm:inline">Done</span>
              </div>
            </div>

            {/* Auth Step */}
            {step === "auth" && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-foreground mb-2">
                    {isNewUser ? "Create an Account" : "Welcome Back"}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {isNewUser 
                      ? "We'll send you a verification link to confirm your email."
                      : "Enter your email to continue."
                    }
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    {isNewUser ? "Send Verification Link" : "Continue"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  {isNewUser ? "Already have an account?" : "New to RentCircle?"}{" "}
                  <button 
                    onClick={() => setIsNewUser(!isNewUser)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isNewUser ? "Log in" : "Sign up"}
                  </button>
                </p>
              </div>
            )}

            {/* Form Step */}
            {step === "form" && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <div className="mb-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-2">
                    Property Details
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Fill in the details about your property. All fields are required.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail">Your Email</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Property Type</Label>
                      <Select required>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rent">Monthly Rent (₹)</Label>
                      <Input
                        id="rent"
                        type="number"
                        placeholder="15000"
                        required
                        min="1000"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Area/Location</Label>
                    <Select required>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {PUNE_AREAS.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="e.g., Spacious 2BHK near IT Park"
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property - amenities, nearby facilities, etc."
                      required
                      rows={4}
                      className="bg-background resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mapLink">Google Maps Link (Optional)</Label>
                    <Input
                      id="mapLink"
                      type="url"
                      placeholder="https://maps.google.com/..."
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Property Images (2-5 photos)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id="images"
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <Home className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB each
                        </p>
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    Submit for Review
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <div className="bg-card rounded-xl border border-border p-8 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h2 className="font-display font-bold text-2xl text-foreground mb-3">
                  Submitted Successfully!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your property has been submitted for review. Our team will verify and approve it within 24-48 hours. You'll receive an email notification once it's live.
                </p>
                <Link to="/">
                  <Button className="gap-2">
                    <Home className="w-4 h-4" />
                    Back to Homepage
                  </Button>
                </Link>
              </div>
            )}

            {/* Info Box */}
            {step !== "success" && (
              <div className="mt-6 bg-secondary rounded-xl p-5">
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Why verification?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Email verification helps us maintain a trusted community. All listings are reviewed before going live to ensure quality and prevent spam.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostProperty;
