"use client";

import VerifyEmail from "@/components/VerifyEmail";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// interface PageProps {
//   searchParams?: {
//     [key: string]: string | string[] | undefined;
//   };
// }

// interface PageProps {
//   searchParams?: Record<string, unknown>;
// }

// const VerifyEmailPage = ({ searchParams }: PageProps) => {
const VerifyEmailPage = () => {
  const searchParams = useSearchParams();

  // const token = searchParams?.token;
  // const toEmail = searchParams?.to;

  const token = searchParams.get("token"); // ?token=abc
  const toEmail = searchParams.get("to");

  console.log(token);
  return (
    <div className="container relative flex justify-center items-center  pt-20 lg:px-0 ">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 ">
        {token && typeof token === "string" ? (
          <div className="grid gap-6">
            <VerifyEmail token={token} />
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col h-full space-y-1">
            <div className="relative mb-4 h-60 w-60 text-muted-foreground">
              <Image src="/sent-email.png" fill alt="email sent image" />
            </div>

            <h3 className="font-semibold text-2xl">Check your email</h3>

            {toEmail ? (
              <p className="text-muted-foreground text-center">
                {" "}
                We&apos;ve sent a verification link to <br />
                <span className="font-semibold">{toEmail}</span>
              </p>
            ) : (
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a verification link to your email
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
