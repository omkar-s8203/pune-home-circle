import { useAdminStats } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Clock, 
  CheckCircle, 
  Flag, 
  Ban,
  Loader2
} from "lucide-react";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { 
      title: "Total Listings", 
      value: stats?.totalListings || 0, 
      icon: Home,
      color: "text-primary"
    },
    { 
      title: "Pending Approvals", 
      value: stats?.pendingApprovals || 0, 
      icon: Clock,
      color: "text-accent"
    },
    { 
      title: "Active Listings", 
      value: stats?.activeListings || 0, 
      icon: CheckCircle,
      color: "text-success"
    },
    { 
      title: "Open Reports", 
      value: stats?.totalReports || 0, 
      icon: Flag,
      color: "text-destructive"
    },
    { 
      title: "Blocked Contacts", 
      value: stats?.blockedContacts || 0, 
      icon: Ban,
      color: "text-muted-foreground"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of RentCircle Pune listings</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
