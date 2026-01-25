export const PUNE_AREAS = [
  "Baner",
  "Wakad",
  "Hinjewadi",
  "Kothrud",
  "Kharadi",
  "Hadapsar",
  "Viman Nagar",
  "Aundh",
  "Pimple Saudagar",
  "Magarpatta",
  "Koregaon Park",
  "Shivaji Nagar",
  "Deccan",
  "Pimpri-Chinchwad",
  "Kalyani Nagar",
  "Yerawada",
  "Kondhwa",
  "Undri",
  "NIBM",
  "Warje",
] as const;

export const PROPERTY_TYPES = [
  { value: "1rk", label: "1 RK" },
  { value: "1bhk", label: "1 BHK" },
  { value: "2bhk", label: "2 BHK" },
  { value: "3bhk", label: "3 BHK+" },
] as const;

export const RENT_RANGES = {
  min: 5000,
  max: 100000,
  step: 1000,
} as const;

export type PuneArea = typeof PUNE_AREAS[number];
export type PropertyType = typeof PROPERTY_TYPES[number]["value"];

export interface Property {
  id: string;
  title: string;
  propertyType: PropertyType;
  rent: number;
  area: PuneArea;
  description: string;
  images: string[];
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  mapLink?: string;
  createdAt: Date;
  status: "pending" | "approved" | "rejected";
  featured?: boolean;
}

// Mock data for initial development
export const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Spacious 2BHK in Prime Baner Location",
    propertyType: "2bhk",
    rent: 25000,
    area: "Baner",
    description: "Beautifully furnished 2BHK apartment with modern amenities. Close to IT parks and shopping malls. 24/7 security, covered parking, and gym facility available.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    ownerName: "Rahul Sharma",
    ownerPhone: "9876543210",
    ownerEmail: "rahul@email.com",
    mapLink: "https://maps.google.com/?q=Baner,Pune",
    createdAt: new Date("2024-01-20"),
    status: "approved",
    featured: true,
  },
  {
    id: "2",
    title: "Cozy 1BHK Near Hinjewadi IT Park",
    propertyType: "1bhk",
    rent: 15000,
    area: "Hinjewadi",
    description: "Perfect for IT professionals. Walking distance from Phase 1. Fully furnished with AC, washing machine, and high-speed internet.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800",
    ],
    ownerName: "Priya Desai",
    ownerPhone: "9876543211",
    ownerEmail: "priya@email.com",
    mapLink: "https://maps.google.com/?q=Hinjewadi,Pune",
    createdAt: new Date("2024-01-22"),
    status: "approved",
  },
  {
    id: "3",
    title: "Premium 3BHK in Koregaon Park",
    propertyType: "3bhk",
    rent: 55000,
    area: "Koregaon Park",
    description: "Luxurious 3BHK in the heart of KP. Premium society with club house, swimming pool, and garden. Pet-friendly community.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    ownerName: "Amit Kulkarni",
    ownerPhone: "9876543212",
    ownerEmail: "amit@email.com",
    mapLink: "https://maps.google.com/?q=Koregaon+Park,Pune",
    createdAt: new Date("2024-01-23"),
    status: "approved",
    featured: true,
  },
  {
    id: "4",
    title: "Budget-Friendly 1RK in Kothrud",
    propertyType: "1rk",
    rent: 8000,
    area: "Kothrud",
    description: "Ideal for students and bachelors. Near FC Road and MIT College. Basic amenities included.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    ],
    ownerName: "Suresh Patil",
    ownerPhone: "9876543213",
    ownerEmail: "suresh@email.com",
    mapLink: "https://maps.google.com/?q=Kothrud,Pune",
    createdAt: new Date("2024-01-24"),
    status: "approved",
  },
  {
    id: "5",
    title: "Modern 2BHK in Wakad",
    propertyType: "2bhk",
    rent: 22000,
    area: "Wakad",
    description: "Recently renovated 2BHK with modular kitchen and premium fittings. Close to Mumbai-Pune expressway. Good connectivity.",
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    ],
    ownerName: "Neha Joshi",
    ownerPhone: "9876543214",
    ownerEmail: "neha@email.com",
    mapLink: "https://maps.google.com/?q=Wakad,Pune",
    createdAt: new Date("2024-01-25"),
    status: "approved",
  },
  {
    id: "6",
    title: "Family-Friendly 3BHK in Kharadi",
    propertyType: "3bhk",
    rent: 35000,
    area: "Kharadi",
    description: "Spacious 3BHK perfect for families. Near EON IT Park and schools. Society has children's play area and senior citizen zone.",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
    ],
    ownerName: "Vikram Mehta",
    ownerPhone: "9876543215",
    ownerEmail: "vikram@email.com",
    mapLink: "https://maps.google.com/?q=Kharadi,Pune",
    createdAt: new Date("2024-01-25"),
    status: "approved",
  },
];
