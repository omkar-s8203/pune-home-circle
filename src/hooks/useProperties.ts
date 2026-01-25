import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyImage } from "@/lib/types";

export const useApprovedProperties = () => {
  return useQuery({
    queryKey: ["properties", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          images:property_images(*)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Property & { images: PropertyImage[] })[];
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          images:property_images(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      // Fetch profile separately
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user_id)
        .maybeSingle();

      return { ...data, profile } as Property & { images: PropertyImage[] };
    },
    enabled: !!id,
  });
};

export const useMyProperties = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["properties", "mine", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          images:property_images(*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Property & { images: PropertyImage[] })[];
    },
    enabled: !!userId,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (property: {
      title: string;
      property_type: string;
      rent: number;
      area: string;
      description?: string;
      map_link?: string;
      phone: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update profile with phone
      await supabase
        .from("profiles")
        .update({ phone: property.phone })
        .eq("id", user.id);

      const { data, error } = await supabase
        .from("properties")
        .insert({
          user_id: user.id,
          title: property.title,
          property_type: property.property_type,
          rent: property.rent,
          area: property.area,
          description: property.description,
          map_link: property.map_link,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useUploadPropertyImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, files }: { propertyId: string; files: File[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const uploadedImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${propertyId}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        uploadedImages.push(publicUrl);

        // Save to property_images table
        await supabase.from("property_images").insert({
          property_id: propertyId,
          image_url: publicUrl,
          display_order: i,
        });
      }

      return uploadedImages;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
