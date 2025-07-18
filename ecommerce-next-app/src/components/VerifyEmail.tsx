"use client";

import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";

interface VerifyEmailProps {
  token: string;
}
const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyToken = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify/${token}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      console.log(data);
      setIsLoading(false);
    } catch (err) {
      // token invalid or expired
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("Unknown error:", err);
      }
      setError(true);
    }
  };

  useEffect(() => {
    const verify = async () => {
      await verifyToken(); // Call the async function inside useEffect
    };

    verify(); // Invoke the inner async function
  }, [token]); // Adding token as a dependency to run effect on token change

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="h-8 w-8 text-red-600" />
        <h3 className="font-semibold text-xl">There was a problem</h3>
        <p className="text-muted-foreground text-sm">
          This token is not vlaid or might be expired. Please try again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
        <h3 className="font-semibold text-xl">Verifying...</h3>
        <p className="text-muted-foreground text-sm">
          This wont&apos;t take long.
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative mb-4 h-60 w-60 text-muted-foreground">
        <Image src="/email-sent.png" fill alt="email sent" />
      </div>
      <h3 className="font-semibold text-2xl ">You&apos;re all set!</h3>
      <p className="text-muted-foreground text-center mt-1">
        Thank you for verifying your email
      </p>
      <Link className={buttonVariants({ className: "mt-4" })} href="/sign-in">
        Sign in
      </Link>
    </div>
  );
};

export default VerifyEmail;
