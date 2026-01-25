import { useState } from "react";
import { useAllProperties, useUpdatePropertyStatus, useDeleteProperty } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MapPin, 
  IndianRupee,
  Loader2,
  ExternalLink
} from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/constants";

interface AdminListingsProps {
  status?: "pending" | "approved" | "rejected";
}

const AdminListings = ({ status }: AdminListingsProps) => {
  const { data: properties, isLoading } = useAllProperties(status);
  const updateStatus = useUpdatePropertyStatus();
  const deleteProperty = useDeleteProperty();
  const { toast } = useToast();
  
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async (propertyId: string) => {
    try {
      await updateStatus.mutateAsync({ propertyId, status: "approved" });
      toast({ title: "Listing approved", description: "The property is now live." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleReject = async () => {
    if (!selectedPropertyId) return;
    try {
      await updateStatus.mutateAsync({ 
        propertyId: selectedPropertyId, 
        status: "rejected",
        rejectionReason,
      });
      toast({ title: "Listing rejected", description: "The owner will be notified." });
      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedPropertyId(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteProperty.mutateAsync(propertyId);
      toast({ title: "Listing deleted", description: "The property has been removed." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openRejectDialog = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setRejectDialogOpen(true);
  };

  const formatRent = (rent: number) => new Intl.NumberFormat("en-IN").format(rent);
  const getTypeLabel = (type: string) => PROPERTY_TYPES.find(t => t.value === type)?.label || type;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!properties?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No {status || ""} listings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg text-foreground capitalize">
          {status || "All"} Listings ({properties.length})
        </h2>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {property.images?.[0] ? (
                    <img 
                      src={property.images[0].image_url} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.area}
                      </p>
                    </div>
                    <Badge variant={
                      property.status === "approved" ? "default" :
                      property.status === "pending" ? "secondary" : "destructive"
                    }>
                      {property.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {formatRent(property.rent)}/month
                    </span>
                    <Badge variant="outline">{getTypeLabel(property.property_type)}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {property.description}
                  </p>

                  <div className="text-xs text-muted-foreground">
                    Posted by: {property.profile?.email || "Unknown"} | 
                    Phone: {property.profile?.phone || "Not provided"}
                  </div>

                  {property.map_link && (
                    <a 
                      href={property.map_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Map
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 md:w-auto">
                  {property.status === "pending" && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(property.id)}
                        className="gap-1 flex-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openRejectDialog(property.id)}
                        className="gap-1 flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDelete(property.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection. This will be visible to the property owner.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminListings;
