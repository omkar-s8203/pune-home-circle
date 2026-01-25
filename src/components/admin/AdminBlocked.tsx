import { useState } from "react";
import { useBlockedContacts, useBlockContact, useUnblockContact } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus,
  Trash2,
  Mail,
  Phone,
  Loader2
} from "lucide-react";

const AdminBlocked = () => {
  const { data: blocked, isLoading } = useBlockedContacts();
  const blockContact = useBlockContact();
  const unblockContact = useUnblockContact();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

  const handleBlock = async () => {
    if (!email && !phone) {
      toast({ title: "Error", description: "Please provide email or phone", variant: "destructive" });
      return;
    }
    
    try {
      await blockContact.mutateAsync({ 
        email: email || undefined, 
        phone: phone || undefined, 
        reason 
      });
      toast({ title: "Contact blocked", description: "They can no longer post listings." });
      setDialogOpen(false);
      setEmail("");
      setPhone("");
      setReason("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUnblock = async (id: string) => {
    if (!confirm("Are you sure you want to unblock this contact?")) return;
    try {
      await unblockContact.mutateAsync(id);
      toast({ title: "Contact unblocked" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const formatDate = (date: string) => 
    new Intl.DateTimeFormat("en-IN", { 
      day: "numeric", 
      month: "short", 
      year: "numeric"
    }).format(new Date(date));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg text-foreground">
          Blocked Contacts ({blocked?.length || 0})
        </h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Block Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block Contact</DialogTitle>
              <DialogDescription>
                Block an email or phone number from posting listings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="spam@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Why are you blocking this contact?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBlock} disabled={!email && !phone}>
                Block Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!blocked?.length ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blocked contacts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocked.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      {contact.email && (
                        <span className="flex items-center gap-1 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {contact.email}
                        </span>
                      )}
                      {contact.phone && (
                        <span className="flex items-center gap-1 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {contact.phone}
                        </span>
                      )}
                    </div>
                    {contact.reason && (
                      <p className="text-sm text-muted-foreground">
                        Reason: {contact.reason}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Blocked on {formatDate(contact.created_at)}
                    </p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleUnblock(contact.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlocked;
