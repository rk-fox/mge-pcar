export interface Car {
  id: string;
  brand: string;
  model: string;
  version: string;
  year_fab: number;
  year_mod: number;
  price: number;
  mileage: number;
  transmission: 'Automático' | 'Manual';
  fuel: string;
  color: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  isFeatured?: boolean;
  isSold?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export type ViewState =
  | 'HOME'
  | 'STOCK'
  | 'DETAILS'
  | 'ADVERTISE'
  | 'ABOUT'
  | 'CONTACT'
  | 'ADMIN_CREATE';
