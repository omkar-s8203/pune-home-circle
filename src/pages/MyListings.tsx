import { Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useMyProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  MapPin, 
  IndianRupee, 
  Loader2,
  Home,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/constants";

const MyListings = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: properties, isLoading } = useMyProperties(user?.id);

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

  const formatRent = (rent: number) => new Intl.NumberFormat("en-IN").format(rent);
  const getTypeLabel = (type: string) => PROPERTY_TYPES.find(t => t.value === type)?.label || type;
  
  const formatDate = (date: string) => 
    new Intl.DateTimeFormat("en-IN", { 
      day: "numeric", 
      month: "short", 
      year: "numeric"
    }).format(new Date(date));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending": return <Clock className="w-4 h-4 text-accent" />;
      case "rejected": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">My Listings</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Link to="/post-property">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Post New Property
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !properties?.length ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Home className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-display font-semibold text-lg text-foreground mb-2">
              No Listings Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start by posting your first property listing.
            </p>
            <Link to="/post-property">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Post Property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {properties.length} of 2 listings used
            </p>
            
            {properties.map((property) => (
              <Card key={property.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-40 h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0].image_url} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link 
                            to={`/property/${property.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {property.title}
                          </Link>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {property.area}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            property.status === "approved" ? "default" :
                            property.status === "pending" ? "secondary" : "destructive"
                          }
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(property.status)}
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

                      <p className="text-xs text-muted-foreground">
                        Posted on {formatDate(property.created_at)}
                      </p>

                      {property.status === "rejected" && property.rejection_reason && (
                        <div className="bg-destructive/10 text-destructive text-sm p-2 rounded">
                          <strong>Rejection reason:</strong> {property.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyListings;
