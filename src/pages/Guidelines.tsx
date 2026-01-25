import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Users, AlertTriangle, CheckCircle, Heart } from "lucide-react";

const Guidelines = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Community Guidelines
            </h1>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto">
              RentCircle Pune is built on trust. These guidelines help keep our community safe and trustworthy for everyone.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto space-y-12">
            {/* For Tenants */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  For Tenants (Searching)
                </h2>
              </div>
              
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Verify Before Paying</h3>
                    <p className="text-muted-foreground text-sm">
                      Always visit the property in person and verify the owner's identity before making any payments.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Get a Written Agreement</h3>
                    <p className="text-muted-foreground text-sm">
                      Never pay advance rent without a proper rental agreement signed by both parties.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Report Suspicious Listings</h3>
                    <p className="text-muted-foreground text-sm">
                      If something seems off, report the listing. Our team reviews all reports promptly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* For Owners */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  For Property Owners
                </h2>
              </div>
              
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Post Accurate Information</h3>
                    <p className="text-muted-foreground text-sm">
                      Provide honest details about your property including rent, location, and amenities.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Use Real Photos</h3>
                    <p className="text-muted-foreground text-sm">
                      Upload actual photos of your property. Stock images or misleading photos are not allowed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Respond Promptly</h3>
                    <p className="text-muted-foreground text-sm">
                      Be responsive to inquiries and keep your listing updated if the property gets rented.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Maximum 2 Active Listings</h3>
                    <p className="text-muted-foreground text-sm">
                      Each verified account can have up to 2 active listings to prevent spam.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Not Allowed */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  Not Allowed
                </h2>
              </div>
              
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-destructive">✕</span>
                    Broker or agent listings (direct owners only)
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">✕</span>
                    Fake or misleading property information
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">✕</span>
                    Discriminatory language or requirements
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">✕</span>
                    Spam or duplicate listings
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">✕</span>
                    Demanding advance payments without proper documentation
                  </li>
                </ul>
              </div>
            </section>

            {/* Community Promise */}
            <section className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-3">
                Our Promise
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We're committed to building a trusted rental community in Pune. Every listing is reviewed by our team before going live. Together, we can make house hunting stress-free and broker-free.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Guidelines;
