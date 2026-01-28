import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSponsorSettings } from "@/hooks/useServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Coffee, Heart, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const SponsorCoffee = () => {
  const { data: settings, isLoading } = useSponsorSettings();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, field)}
      className="h-8 px-2"
    >
      {copiedField === field ? (
        <Check className="w-4 h-4 text-success" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

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

  const hasBankDetails = settings?.bank_name || settings?.account_number || settings?.ifsc_code;
  const hasQrCode = settings?.qr_code_url;
  const hasUpi = settings?.upi_id;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Coffee className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              Sponsor a Coffee
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {settings?.message || "Support RentCircle by buying us a coffee! Your contribution helps us maintain and improve the platform."}
            </p>
          </div>

          {!hasBankDetails && !hasQrCode && !hasUpi ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Payment details are not configured yet. Please check back later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* QR Code Section */}
              {hasQrCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scan to Pay</CardTitle>
                    <CardDescription>
                      Use any UPI app to scan this QR code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-inner">
                      <img 
                        src={settings.qr_code_url!} 
                        alt="Payment QR Code"
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* UPI ID Section */}
              {hasUpi && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">UPI ID</CardTitle>
                    <CardDescription>
                      Pay directly using UPI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                      <span className="font-mono text-lg">{settings.upi_id}</span>
                      <CopyButton text={settings.upi_id!} field="upi" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bank Details Section */}
              {hasBankDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bank Transfer</CardTitle>
                    <CardDescription>
                      Transfer directly to our bank account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {settings?.bank_name && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Bank Name</p>
                          <p className="font-medium">{settings.bank_name}</p>
                        </div>
                        <CopyButton text={settings.bank_name} field="bank" />
                      </div>
                    )}
                    
                    {settings?.bank_name && (settings?.account_holder_name || settings?.account_number) && (
                      <Separator />
                    )}
                    
                    {settings?.account_holder_name && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Account Holder</p>
                          <p className="font-medium">{settings.account_holder_name}</p>
                        </div>
                        <CopyButton text={settings.account_holder_name} field="holder" />
                      </div>
                    )}
                    
                    {settings?.account_holder_name && settings?.account_number && <Separator />}
                    
                    {settings?.account_number && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Account Number</p>
                          <p className="font-mono font-medium">{settings.account_number}</p>
                        </div>
                        <CopyButton text={settings.account_number} field="account" />
                      </div>
                    )}
                    
                    {settings?.account_number && settings?.ifsc_code && <Separator />}
                    
                    {settings?.ifsc_code && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">IFSC Code</p>
                          <p className="font-mono font-medium">{settings.ifsc_code}</p>
                        </div>
                        <CopyButton text={settings.ifsc_code} field="ifsc" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Thank You Message */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-foreground font-medium">
                    Thank you for your support!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Every contribution helps us grow and serve you better.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorCoffee;
