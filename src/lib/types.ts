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

// Services
export interface Service {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  service_id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  service?: Service;
}

export interface SponsorSettings {
  id: string;
  qr_code_url: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  upi_id: string | null;
  message: string | null;
  updated_at: string;
  updated_by: string | null;
}
