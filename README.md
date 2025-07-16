# E-Commerce Platform: Full-Stack Project

A robust, modern e-commerce application built with **Next.js (App Router)**, **Express.js**, **MongoDB**, and **Cloudinary**, featuring product categories, user authentication (with verification emails), image uploads, Stripe payments, and real-time updates.  
This repository contains both the frontend (Next.js) and backend (Node.js/Express) code.

---

## Features Developed

### 1. Product Management
- **CRUD Operations:** Admins can create, update, delete, and view products.
- **Product Images:** Supports multi-image upload for each product, with images stored in Cloudinary.

### 2. User Authentication & Authorization
- **User Registration and Login:** Secure JWT-based authentication.
- **Email Verification:** Users receive a verification email upon registration, ensuring valid sign-ups.
- **Role-based Access:** Admin and customer roles with separate access controls.

### 3. Media Management
- **File Uploads:** Utilizes Multer for handling file uploads with memory storage (compatible with Vercel/serverless).
- **Cloudinary Integration:** Images uploaded directly to Cloudinary, ensuring fast, cloud-based storage and easy retrieval.

### 4. API Design
- **RESTful APIs:** Clean, resource-oriented endpoints for products, users, media, etc.
- **Error Handling:** Detailed, consistent error messages for debugging and UI feedback.

### 5. Payments
- **Stripe Integration:** Secure payment processing implemented through both backend and frontend, enabling seamless checkout and order management.

### 6. Order Management
- **Backend Order Management:** Orders are processed and tracked at the backend, with detailed line items and automatic stock updates for each product.

### 7. Frontend
- **Next.js 15:** Modern React framework with SSR, SSG, and API routes.
- **TailwindCSS:** Utility-first CSS for a responsive UI.
- **React Hook Form:** Elegant form management for dynamic forms.
- **Zustand:** Lightweight state management.
- **Radix UI:** Accessible, headless UI primitives.

### 8. Backend
- **Express.js:** Fast, unopinionated backend framework.
- **Mongoose + MongoDB:** Flexible, document-based storage for products, users, orders, and media.
- **Cloudinary SDK:** For direct image uploads and retrieval.
- **Nodemailer:** For sending transactional emails (order confirmations, receipts, user verification, etc.).
- **dotenv:** Secure management of environment variables.

### 9. Email Integration
- **Verification Emails:** Sends verification email on user registration to activate the account.
- **Receipt Emails:** Generates dynamic HTML emails (using React Email, etc.) and sends them to customers on order completion.

### 10. Deployment
- **Vercel:** Both frontend and backend are deployed serverlessly.
- **Branching Strategy:** Separate branches for main, frontend, and backend for streamlined CI/CD and project management.

---

## TODO

- Implementing category and subcategory structure and linking products to them; filtering products based on these categories.
- Improving the UI for better usability and aesthetics.

---
