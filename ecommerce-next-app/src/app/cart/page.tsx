"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/context/userContext";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { User } from "@/types/user";

const stripePromise = loadStripe(
  "pk_test_51Rb2SICBhoJihabNxBRyKiMxwFNgmZ8myXtjXmEtKm9RCLGLubyuNHpNOWBimg1jLKVhGrOhTAq6sDg6Uj2NTxLw00qKiUE9l8"
); // Load Stripe.js with your public key

const CartPage = () => {
  const { items } = useCart();

  console.log("items in cart page", items);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [orderId, setOrderId] = useState<string | null>(null);

  const cartTotal = items?.reduce(
    (total, product) => total + product?.price,
    0
  );

  const fee = 1;

  const { user } = useUser() as { user: User | null };

  console.log("user is", user);

  //   const cartItems = items?.map(item => {item._id, })

  const cartItems: { productId: string; quantity: number }[] = [];

  // const createLineItems = useMemo(() => {
  //   items?.forEach((item) => {
  //     const existingItemIndex = cartItems?.findIndex(
  //       (cItem) => cItem.productId === item?._id
  //     );

  //     if (existingItemIndex !== -1) {
  //       // If the item already exists in the cart, increase the quantity
  //       cartItems[existingItemIndex].quantity += 1;
  //     } else {
  //       // If the item doesn't exist in the cart, add it with quantity 1
  //       cartItems.push({ productId: item._id, quantity: 1 });
  //     }
  //   });
  // }, [items, cartItems]);

  const createLineItems = () => {
    items?.forEach((item) => {
      const existingItemIndex = cartItems?.findIndex(
        (cItem) => cItem.productId === item?._id
      );

      if (existingItemIndex !== -1) {
        // If the item already exists in the cart, increase the quantity
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // If the item doesn't exist in the cart, add it with quantity 1
        cartItems.push({ productId: item._id, quantity: 1 });
      }
    });
  };

  console.log("cartItems are", cartItems);
  //   const createLineItems = () => {
  //     items?.map((item) => {
  //       if (cartItems.productId === item._id) {
  //         cartItems.quantity += 1;
  //       } else {
  //         cartItems.productId === item._id;
  //         cartItems.quantity = 1;
  //       }
  //     });
  //     console.log("cartItems are", cartItems);
  //   };

  const createCheckoutSession = async () => {
    createLineItems(); // Create line items from cart items

    try {
      // Send cart items to backend for checkout session
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user?._id || undefined, // If a user is logged in -> id else undefined
            guest: true || undefined, // Set the guest if a guest is making the checkout
            items: cartItems, // send product IDs and quantities
            totalAmount: cartTotal,
            successUrl: `http://localhost:3000/thank-you?orderId=${orderId}`, // URL to redirect after successful payment
            cancelUrl: "http://localhost:3000/cancel", // URL to redirect if payment is canceled
            client_reference_id: orderId,
          }),
        }
      );

      const data = await response.json();

      console.log(data?.sessionId, "sessionId");

      if (response.ok) {
        updateOrder("completed", "processing"); // Call createOrder function to update an order in your database
      }

      const sessionId = data?.sessionId;

      localStorage.setItem("sessionId", sessionId); // Store sessionId in local storage
      // Redirect the user to Stripe checkout page
      //   window.location.href = data.checkoutUrl;
      setIsLoading(false);

      // Initialize Stripe.js
      const stripe = await stripePromise;

      // Redirect to the Stripe checkout page using the session ID
      const result = await stripe?.redirectToCheckout({
        sessionId,
      });

      console.log("order is", orderId);

      if (result && result?.error) {
        console.error("Stripe checkout error:", result?.error);
        // Handle any errors that occur during the redirect
      }
    } catch (error) {
      console.error("Checkout error:", error);
      //   setIsLoading(true);
    }
  };

  const createOrder = async () => {
    // This function can be used to create an order in your database
    // after the checkout session is completed.
    // You can send the cart items, user info, and total amount to your backend.
    console.log("Creating order with items:", cartItems);
    console.log("Total amount:", cartTotal + fee);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?._id || undefined, // If a user is logged in -> id else undefined
            guest: user?._id ? false : true, // Set the guest if a guest is making the checkout
            items: cartItems, // send product IDs and quantities
            totalAmount: cartTotal + fee,
          }),
        }
      );

      const data = await response.json();

      console.log("Order created:", data);
      setOrderId(data?.order?._id); // Assuming the response contains an orderId

      // Store orderId in local storage
      //   localStorage.setItem("orderId", data?.order?._id);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const updateOrder = (pStatus: string, oStatus: string) => {
    // const orderId = localStorage.getItem("orderId");

    console.log("cartItems in updateOrder", cartItems);

    console.log("Updating order with ID:", orderId);
    console.log("Payment status:", pStatus);
    console.log("Order status:", oStatus);
    try {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?._id || undefined, // If a user is logged in -> id else undefined
          guest: user?._id ? false : true, // Set the guest if a guest is making the checkout
          items: cartItems, // send product IDs and quantities
          totalAmount: cartTotal + fee,
          paymentStatus: pStatus,
          orderStatus: oStatus,
        }),
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    createOrder();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/hippo-empty-cart.png"
                    fill
                    loading="eager"
                    alt="empty shopping cart hippo"
                  />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items?.map((product) => {
                  const image = product?.images[0];

                  return (
                    <li key={product._id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          {typeof image !== "string" && image.url ? (
                            <Image
                              fill
                              src={image.url}
                              alt="product image"
                              className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  href={`/product/${product._id}`}
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className="mt-1 flex text-sm">
                              <p className="text-muted-foreground">
                                Category:{" "}
                                {product.category
                                  ? `${product.category.name} ${product.category.parent.name} `
                                  : "No Category"}
                              </p>
                            </div>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                            <div className="absolute right-0 top-0">
                              <Button
                                aria-label="remove product"
                                // onClick={() => removeItem(product.id)}
                                variant="ghost"
                              >
                                <X className="h-5 w-5" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />

                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Order Total
                </div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal + fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={items?.length === 0 || isLoading}
                onClick={() => createCheckoutSession()}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : null}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
