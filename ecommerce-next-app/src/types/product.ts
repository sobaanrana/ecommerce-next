// src/types/product.ts

export interface ProductImage {
  _id: string;
  url: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  parent: {
    _id: string;
    name: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
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
