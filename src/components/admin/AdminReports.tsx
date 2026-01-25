import { useState } from "react";
import { useReports, useUpdateReport } from "@/hooks/useAdmin";
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
  Eye,
  CheckCircle,
  Loader2
} from "lucide-react";

const AdminReports = () => {
  const { data: reports, isLoading } = useReports();
  const updateReport = useUpdateReport();
  const { toast } = useToast();
  
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const handleMarkReviewed = async (reportId: string) => {
    try {
      await updateReport.mutateAsync({ reportId, status: "reviewed" });
      toast({ title: "Report marked as reviewed" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleResolve = async () => {
    if (!selectedReportId) return;
    try {
      await updateReport.mutateAsync({ 
        reportId: selectedReportId, 
        status: "resolved",
        adminNotes,
      });
      toast({ title: "Report resolved" });
      setResolveDialogOpen(false);
      setAdminNotes("");
      setSelectedReportId(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openResolveDialog = (reportId: string) => {
    setSelectedReportId(reportId);
    setResolveDialogOpen(true);
  };

  const formatDate = (date: string) => 
    new Intl.DateTimeFormat("en-IN", { 
      day: "numeric", 
      month: "short", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!reports?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No reports found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg text-foreground">
          Reports ({reports.length})
        </h2>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Report for: {report.property?.title || "Unknown Property"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reported on {formatDate(report.created_at)}
                      </p>
                    </div>
                    <Badge variant={
                      report.status === "resolved" ? "default" :
                      report.status === "reviewed" ? "secondary" : "destructive"
                    }>
                      {report.status}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Reporter: {report.reporter_email || "Anonymous"}
                  </div>

                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-1">Reason:</p>
                    <p className="text-sm text-muted-foreground">{report.reason}</p>
                  </div>

                  {report.admin_notes && (
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-sm font-medium text-foreground mb-1">Admin Notes:</p>
                      <p className="text-sm text-muted-foreground">{report.admin_notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {report.status !== "resolved" && (
                  <div className="flex md:flex-col gap-2 md:w-auto">
                    {report.status === "open" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMarkReviewed(report.id)}
                        className="gap-1 flex-1"
                      >
                        <Eye className="w-4 h-4" />
                        Mark Reviewed
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      onClick={() => openResolveDialog(report.id)}
                      className="gap-1 flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Add notes about the actions taken to resolve this report.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter admin notes..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolve}>
              Resolve Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;
