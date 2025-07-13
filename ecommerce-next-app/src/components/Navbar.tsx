"use client";
import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import NavItems from "./NavItems";
import { buttonVariants } from "./ui/button";
import Cart from "./Cart";
import UserAccountNav from "./UserAccountNav";
import { useUser } from "@/hooks/context/userContext";
import { User } from "@/types/user";
import Image from "next/image";

const Navbar = () => {
  // const { user, loading, error, signOut, getSignedUserData } = useAuth(); // Get user, loading, error, and signOut from the hook

  const { user } = useUser() as { user: User | null };

  console.log("user in navbar", user);

  // useEffect(() => {
  //   // Check if token exists and get user data when the component mounts
  //   getSignedUserData(); // Call the hook function to get user data
  //   console.log("nav com runs");
  // }, []); // Empty dependency array means it runs only on mount

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-18">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-18 items-center">
              {/* TODO : Mobile Nav */}

              <div className="ml-4 flex lg:ml-0 ">
                <Link href="/" className="h-18 w-20 relative">
                  {/* <Icons.logo className="h-10 w-10" /> */}
                  <Image
                    src={"/logos/logo.png"}
                    fill
                    className="object-contain"
                    alt="NextCart"
                  />
                </Link>
              </div>

              <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <div className="ml-auto flex item-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? null : (
                    <Link
                      href="/sign-in"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign In
                    </Link>
                  )}

                  {user ? null : (
                    <span
                      className="h-6 w-px bg-gray-200 "
                      aria-hidden="true"
                    ></span>
                  )}

                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link
                      href="/sign-up"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Create account
                    </Link>
                  )}

                  {user ? (
                    <span
                      className="h-6 w-px bg-gray-200 "
                      aria-hidden="true"
                    ></span>
                  ) : null}

                  {user ? null : (
                    <div className="flex lg:ml-6">
                      <span
                        className="h-6 w-px bg-gray-200 "
                        aria-hidden="true"
                      ></span>
                    </div>
                  )}

                  <div className="ml-4 flow-root lg:ml-6">
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
