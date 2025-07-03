export interface CartLineItem {
  productId: string;
  quantity: number;

  details: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: {
      _id: string;
      url: string;
    }[];
  };
}

export interface Order {
  _id: string;
  createdAt: string;
  updatedAt: string;
  guest: boolean;
  items: CartLineItem[];
  orderStatus: "created" | "processing" | "completed" | "cancelled" | string; // add more statuses if needed
  paymentStatus: "pending" | "paid" | "failed" | string; // add more statuses if needed
  totalAmount: number;
  user: string | null; // or User | null, if you have a User interface
  __v: number;
}
