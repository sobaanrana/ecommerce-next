// src/types/product.ts

export interface ProductImage {
  _id: string;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: ProductImage[];
  stock: number;
  seller: string;
  productStatus: "pending" | "approved" | "denied";
  priceID: string;
  stripeProductID: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
