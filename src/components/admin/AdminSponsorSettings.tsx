import { useState, useEffect } from "react";
import { useSponsorSettings, useUpdateSponsorSettings } from "@/hooks/useServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Coffee, QrCode, Landmark } from "lucide-react";
import { toast } from "sonner";

const AdminSponsorSettings = () => {
  const { data: settings, isLoading } = useSponsorSettings();
  const updateSettings = useUpdateSponsorSettings();

  const [formData, setFormData] = useState({
    qr_code_url: "",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    upi_id: "",
    message: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        qr_code_url: settings.qr_code_url || "",
        bank_name: settings.bank_name || "",
        account_holder_name: settings.account_holder_name || "",
        account_number: settings.account_number || "",
        ifsc_code: settings.ifsc_code || "",
        upi_id: settings.upi_id || "",
        message: settings.message || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings?.id) {
      toast.error("Settings not found");
      return;
    }

    try {
      await updateSettings.mutateAsync({
        id: settings.id,
        ...formData,
      });
      toast.success("Sponsor settings updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-foreground">Sponsor Settings</h2>
        <p className="text-muted-foreground">Configure the "Sponsor a Coffee" page payment details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Page Message
            </CardTitle>
            <CardDescription>
              The message displayed to visitors on the sponsor page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Support RentCircle by buying us a coffee!"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              UPI / QR Code
            </CardTitle>
            <CardDescription>
              Upload a QR code for UPI payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr_code_url">QR Code Image URL</Label>
              <Input
                id="qr_code_url"
                type="url"
                value={formData.qr_code_url}
                onChange={(e) => setFormData(prev => ({ ...prev, qr_code_url: e.target.value }))}
                placeholder="https://example.com/qr-code.png"
              />
              <p className="text-xs text-muted-foreground">
                Upload your QR code to an image hosting service and paste the URL here
              </p>
            </div>
            
            {formData.qr_code_url && (
              <div className="border rounded-lg p-4 bg-white">
                <img 
                  src={formData.qr_code_url} 
                  alt="QR Code Preview"
                  className="max-w-[200px] mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="upi_id">UPI ID</Label>
              <Input
                id="upi_id"
                value={formData.upi_id}
                onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))}
                placeholder="yourname@upi"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="w-5 h-5" />
              Bank Details
            </CardTitle>
            <CardDescription>
              Bank account details for direct transfers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  value={formData.bank_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                  placeholder="State Bank of India"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account_holder_name">Account Holder Name</Label>
                <Input
                  id="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_holder_name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  value={formData.account_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                  placeholder="1234567890123"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ifsc_code">IFSC Code</Label>
                <Input
                  id="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, ifsc_code: e.target.value.toUpperCase() }))}
                  placeholder="SBIN0001234"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="gap-2"
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSponsorSettings;
