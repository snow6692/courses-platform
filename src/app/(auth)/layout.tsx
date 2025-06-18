import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-screen w-full max-w-sm flex-col justify-center">
      <div className="">
        <Link
          href={"/"}
          className={buttonVariants({
            variant: "outline",
            className: "absolute top-10 left-4",
          })}
        >
          <FaArrowLeft className="size-4" />
          Back
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <Link
          href={"/"}
          className="text-primary mb-4 flex w-fit items-center justify-center gap-2 text-center text-2xl font-bold"
        >
          <Image
            src={"/logo.jpg"}
            className="rounded-full"
            alt="Logo"
            width={40}
            height={40}
          />
          snow
        </Link>
      </div>
      {children}
      <div className="text-muted-foreground mt-2 text-center text-xs text-balance">
        By continuing, you agree to our
        <span className="hover:text-primary hover:underline">
          Terms of Service
        </span>{" "}
        and
        <span className="hover:text-primary hover:underline">
          {" "}
          Privacy Policy
        </span>
        .
      </div>
    </div>
  );
}

export default AuthLayout;
