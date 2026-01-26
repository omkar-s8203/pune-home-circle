export interface Property {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  rent: number;
  area: string;
  description: string | null;
  map_link: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  images?: PropertyImage[];
  profile?: Profile;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  property_id: string;
  reporter_email: string | null;
  reason: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
  // Joined data
  property?: Property;
}

export interface BlockedContact {
  id: string;
  email: string | null;
  phone: string | null;
  reason: string | null;
  blocked_by: string | null;
  created_at: string;
}

export interface AdminStats {
  totalListings: number;
  pendingApprovals: number;
  activeListings: number;
  totalReports: number;
  flaggedForReview: number;
  blockedContacts: number;
}
