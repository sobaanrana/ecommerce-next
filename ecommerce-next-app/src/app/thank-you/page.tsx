"use client";

import { useUser } from "@/hooks/context/userContext";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";

// interface PageProps {
//   searchParams: { [key: string]: string | string[] | undefined };
// }
// { searchParams }: PageProps
const ThankyouPage = () => {
  //   const orderId = searchParams?.orderId;

  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");
  const { user } = useUser();

  const [orderDetails, setOrderDetails] = useState<any>(null);

  const [customerDetails, setCustomerDetails] = useState<any>(null);

  //   if (!user)
  //     /// check if user idds are same if not then redirect
  const getOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/order/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();
      setOrderDetails(data?.order);
      setCustomerDetails(data?.customer);
      //   return data;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  };

  console.log("Order ID:", orderDetails);
  const checkPaymentStatus = async () => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No sessionId found in localStorage");
      return;
    }

    console.log("Session ID:", sessionId);
    console.log("type os sessionId", typeof sessionId);
    try {
      const response = await fetch(`http://localhost:4000/api/order/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          sessionId: sessionId,
          //   Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment status");
      }
      const data = await response.json();

      console.log("Order status data:", data);
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
    getOrder();
  }, []);

  // TODO : get Order
  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">
              Order successful
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for ordering
            </h1>
          </div>
        </div>

        {orderDetails && orderDetails.paymentStatus === "paid" ? (
          <p className="mt-2 text-base text-muted-foreground">
            Your order was processed and your assets are available to download
            below. We&apos;ve sent your receipt and order details to{" "}
            {typeof orderDetails.user !== "string" ? (
              <span className="font-medium text-gray-900">
                {orderDetails.user?.email}
              </span>
            ) : null}
            .
          </p>
        ) : (
          <p className="mt-2 text-base text-muted-foreground">
            We appreciate your order, and we&apos;re currently processing it. So
            hang tight and we&apos;ll send you confirmation very soon!
          </p>
        )}
      </div>
    </main>
  );
};

export default ThankyouPage;
