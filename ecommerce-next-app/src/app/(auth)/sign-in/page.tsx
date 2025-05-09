"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const continueAsSeller = () => {
    router.push("?as=seller");
  };

  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  const AuthCredentialsValidator = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
  });

  type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>;
  const {
    register, // its not full type safe and so is handling of the form
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
    mode: "onBlur", // Trigger validation when the user leaves the field (onBlur)
  });

  const onSubmit = async ({ email, password }: TAuthCredentialsValidator) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      } // fetch does not automatically throw an error for HTTP status codes like 400, 401, 403, or 500.

      toast.success(`Signed In Successfully!`);
      router.refresh();

      if (origin) {
        router.push(`/${origin}`);
      }

      if (isSeller) {
        router.push(`/sell`);
        return;
      }

      // Save the JWT token to the client-side cookie
      document.cookie = `token=${data.token}; path=/; max-age=3600; samesite=strict`;

      router.push("/");
      // router.push(`/verify-email?to=${email} `);
    } catch (err) {
      console.log(err.message);
      // toast.error(err.message);
      toast.error("Invalid email or password");

      handleZodErrors();
    }
  };

  // Handle form errors (Zod validation errors)
  const handleZodErrors = () => {
    if (errors) {
      Object.values(errors).forEach((error) => {
        if (error && error.message) {
          toast.error(error.message); // Show the first error message in a toast
        }
      });
    }
  };

  // useEffect(() => {
  //   handleZodErrors(); // Handle Zod validation errors
  // }, [errors]);

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your {isSeller && "seller"} account
            </h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-in"
            >
              Don&apos;t have an account? Sign up!
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button>Sign In</Button>
              </div>
            </form>

            <div className="relative ">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            {isSeller ? (
              <Button onClick={continueAsBuyer} variant="secondary">
                Continue as customer
              </Button>
            ) : (
              <Button onClick={continueAsSeller} variant="secondary">
                Continue as seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
