"use client";

import { ReceiptEmailHtml } from "@/components/emails/ReceiptEmail";
import { useUser } from "@/hooks/context/userContext";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { sendEmailToBackend } from "@/utils/sendReceiptEmail";
import Image from "next/image";
import Link from "next/link";
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

  const transactionFee = 1;
  //   if (!user)
  //     /// check if user idds are same if not then redirect
  //   const getOrder = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:4000/api/order/${orderId}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${user?.token}`,
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch order");
  //       }

  //       const data = await response.json();
  //       setOrderDetails(data?.order);
  //       setCustomerDetails(data?.customer);
  //       //   return data;
  //     } catch (error) {
  //       console.error("Error fetching order:", error);
  //       return null;
  //     }
  //   };

  // Now getting order details from the order status api
  console.log("Order ID:", orderDetails);
  const checkOrderStatus = async () => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No sessionId found in localStorage");
      return;
    }

    console.log("Session ID:", sessionId);
    console.log("type os sessionId", typeof sessionId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            sessionId: sessionId,
            //   Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment status");
      }
      const data = await response.json();

      setOrderDetails(data?.order);
      setCustomerDetails(data?.customer);

      console.log("Order status data:", data);
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  };
  console.log("thisis order details", orderDetails);
  console.log("this is customer details", customerDetails);
  useEffect(() => {
    checkOrderStatus();
    // getOrder();
  }, []);

  const dummyProducts = [
    {
      id: "1",
      name: "Adidas Mens Fab Polo Shirt",
      price: 30,
      images: [
        {
          url: "https://via.placeholder.com/150",
        },
      ],
      category: "Clothing",
      description: "A comfortable and breathable polo shirt by Adidas.",
    },
    {
      id: "2",
      name: "Air Max Invigor Trainers Mens",
      price: 120,
      images: [
        {
          url: "https://via.placeholder.com/150",
        },
      ],
      category: "Sports",
      description: "Stylish trainers by Nike with excellent cushioning.",
    },
  ];

  // Dummy ReceiptEmailProps
  const dummyReceiptEmailProps = {
    email: "testuser@example.com", // Dummy email address
    date: new Date(), // Current date
    orderId: "order-12345", // Dummy order ID
    products: dummyProducts, // Array of dummy products
  };

  useEffect(() => {
    const sendReceipt = async () => {
      if (orderDetails && customerDetails) {
        try {
          // Await the receipt email HTML generation
          const receiptEmailHtml = await ReceiptEmailHtml({
            email: customerDetails.email,
            date: new Date(),
            orderId: orderDetails._id,
            products: orderDetails.items,
          });

          console.log("Receipt Email HTML:", receiptEmailHtml);

          // Send the email content to the backend
          await sendEmailToBackend(receiptEmailHtml);
        } catch (error) {
          console.error("Error generating or sending email:", error);
        }
      }
    };

    sendReceipt(); // Calling the async function
  }, [orderDetails, customerDetails]);
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

      <div className="p-20">
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

        {orderDetails?.paymentStatus === "paid" ? (
          <p className="mt-2 text-base text-muted-foreground">
            Your order was processed and your assets are available to download
            below. We&apos;ve sent your receipt and order details to{" "}
            <span className="font-medium text-gray-900">
              {customerDetails?.email}
            </span>
            .
          </p>
        ) : (
          <p className="mt-2 text-base text-muted-foreground">
            We appreciate your order, and we&apos;re currently processing it. So
            hang tight and we&apos;ll send you confirmation very soon!
          </p>
        )}

        <div className="mt-16 text-sm font-medium">
          <div className="text-muted-foreground">Order nr.</div>
          <div className="mt-2 text-gray-900">{orderDetails?._id}</div>
        </div>

        <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
          {orderDetails?.items?.map((item) => {
            // const downloadUrl = (product.product_files as ProductFile)
            //   .url as string;

            const image = item?.details.images[0];

            return (
              <li key={item?.details._id} className="flex space-x-6 py-6">
                <div className="relative h-24 w-24">
                  {image?.url ? (
                    <Image
                      fill
                      src={image?.url}
                      alt={`${item?.details.name} image`}
                      className="flex-none rounded-md bg-gray-100 object-cover object-center"
                    />
                  ) : null}
                </div>

                <div className="flex-auto flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-gray-900">{item?.details.name}</h3>

                    <p className="my-1">Category: {item?.details.category}</p>
                  </div>
                  {/* TODO: create download button and functionality for downloading
                  digital product e.g. high reolution images */}
                  {/* {orderDetails?.paymentStatus === "paid" ? (
                    <a
                      //   href={downloadUrl}
                      download={item?.details.name}
                      className="text-blue-600 hover:underline underline-offset-2"
                    >
                      Download asset
                    </a>
                  ) : null} */}
                </div>

                <p className="flex-none font-medium text-gray-900">
                  {formatPrice(item?.details.price)}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p className="text-gray-900">
              {formatPrice(orderDetails?.totalAmount - transactionFee)}
            </p>
          </div>

          <div className="flex justify-between">
            <p>Transaction Fee</p>
            <p className="text-gray-900">{formatPrice(transactionFee)}</p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
            <p className="text-base">Total</p>
            <p className="text-base">
              {formatPrice(orderDetails?.totalAmount)}
            </p>
          </div>
        </div>
        {/* 
        <PaymentStatus
          isPaid={order._isPaid}
          orderEmail={(order.user as User).email}
          orderId={order.id}
        /> */}

        <div className="mt-16 border-t border-gray-200 py-6 text-right">
          <Link
            href="/products"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Continue shopping &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ThankyouPage;
