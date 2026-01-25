import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Property, Report, BlockedContact, AdminStats, PropertyImage } from "@/lib/types";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [propertiesRes, reportsRes, blockedRes] = await Promise.all([
        supabase.from("properties").select("status"),
        supabase.from("reports").select("id"),
        supabase.from("blocked_contacts").select("id"),
      ]);

      const properties = propertiesRes.data || [];
      const stats: AdminStats = {
        totalListings: properties.length,
        pendingApprovals: properties.filter(p => p.status === "pending").length,
        activeListings: properties.filter(p => p.status === "approved").length,
        totalReports: reportsRes.data?.length || 0,
        blockedContacts: blockedRes.data?.length || 0,
      };

      return stats;
    },
  });
};

export const useAllProperties = (status?: "pending" | "approved" | "rejected") => {
  return useQuery({
    queryKey: ["admin", "properties", status],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select(`
          *,
          images:property_images(*)
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Fetch profiles separately
      const userIds = [...new Set((data || []).map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return (data || []).map(p => ({
        ...p,
        profile: profileMap.get(p.user_id),
      })) as (Property & { images: PropertyImage[] })[];
    },
  });
};

export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      propertyId, 
      status, 
      rejectionReason 
    }: { 
      propertyId: string; 
      status: "approved" | "rejected"; 
      rejectionReason?: string;
    }) => {
      const { error } = await supabase
        .from("properties")
        .update({ 
          status, 
          rejection_reason: rejectionReason || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useReports = () => {
  return useQuery({
    queryKey: ["admin", "reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          property:properties(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Report[];
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      reportId, 
      status, 
      adminNotes 
    }: { 
      reportId: string; 
      status: string; 
      adminNotes?: string;
    }) => {
      const { error } = await supabase
        .from("reports")
        .update({ 
          status, 
          admin_notes: adminNotes,
          resolved_at: status === "resolved" ? new Date().toISOString() : null,
        })
        .eq("id", reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
};

export const useBlockedContacts = () => {
  return useQuery({
    queryKey: ["admin", "blocked"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocked_contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlockedContact[];
    },
  });
};

export const useBlockContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      email, 
      phone, 
      reason 
    }: { 
      email?: string; 
      phone?: string; 
      reason?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("blocked_contacts")
        .insert({
          email,
          phone,
          reason,
          blocked_by: user?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blocked"] });
    },
  });
};

export const useUnblockContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blocked_contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blocked"] });
    },
  });
};
