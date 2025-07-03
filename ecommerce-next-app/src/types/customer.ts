export interface Address {
  city: string | null;
  country: string;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

export interface Customer {
  address: Address;
  email: string;
  name: string;
  phone: string | null;
  tax_exempt: string;
  tax_ids: string[];
}
