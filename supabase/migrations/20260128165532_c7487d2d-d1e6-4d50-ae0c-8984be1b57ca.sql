-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sponsor_settings table (singleton for storing donation info)
CREATE TABLE public.sponsor_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code_url TEXT,
  bank_name TEXT,
  account_holder_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  upi_id TEXT,
  message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_settings ENABLE ROW LEVEL SECURITY;

-- Services: Everyone can view active services, admins can manage all
CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (is_admin());

-- Service Requests: Users can create, admins can view/update all
CREATE POLICY "Anyone can create service requests"
  ON public.service_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own requests"
  ON public.service_requests FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can update service requests"
  ON public.service_requests FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete service requests"
  ON public.service_requests FOR DELETE
  USING (is_admin());

-- Sponsor Settings: Everyone can view, admins can manage
CREATE POLICY "Anyone can view sponsor settings"
  ON public.sponsor_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage sponsor settings"
  ON public.sponsor_settings FOR ALL
  USING (is_admin());

-- Add triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default sponsor settings row
INSERT INTO public.sponsor_settings (id, message) 
VALUES (gen_random_uuid(), 'Support RentCircle by buying us a coffee!');