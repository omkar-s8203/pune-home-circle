import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service, ServiceRequest, SponsorSettings } from "@/lib/types";

// Fetch all active services (for public view)
export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
  });
};

// Fetch all services (for admin)
export const useAllServices = () => {
  return useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
  });
};

// Create a new service
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<Service, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("services")
        .insert(service)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
  });
};

// Update a service
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Service> & { id: string }) => {
      const { error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
  });
};

// Delete a service
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
  });
};

// Create a service request
export const useCreateServiceRequest = () => {
  return useMutation({
    mutationFn: async (request: {
      service_id: string;
      name: string;
      email: string;
      phone: string;
      address?: string;
      message?: string;
      user_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("service_requests")
        .insert(request)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// Fetch all service requests (for admin)
export const useServiceRequests = () => {
  return useQuery({
    queryKey: ["admin", "service-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          service:services(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ServiceRequest[];
    },
  });
};

// Update service request status
export const useUpdateServiceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      admin_notes 
    }: { 
      id: string; 
      status: string; 
      admin_notes?: string;
    }) => {
      const { error } = await supabase
        .from("service_requests")
        .update({ status, admin_notes })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
};

// Delete service request
export const useDeleteServiceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
};

// Fetch sponsor settings
export const useSponsorSettings = () => {
  return useQuery({
    queryKey: ["sponsor-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as SponsorSettings | null;
    },
  });
};

// Update sponsor settings
export const useUpdateSponsorSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<SponsorSettings> & { id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("sponsor_settings")
        .update({ ...settings, updated_by: user?.id })
        .eq("id", settings.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-settings"] });
    },
  });
};
