import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldXIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function NotAdminPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <Card className="w-sm p-4 text-center md:w-lg md:p-8">
        <CardHeader>
          <div className="bg-destructive/10 hover:bg-destructive/20 mx-auto w-fit animate-pulse rounded-full p-4 transition-all duration-300 hover:scale-105">
            <ShieldXIcon className="text-destructive size-16" />
          </div>
          <CardTitle>
            <h1 className="text-2xl font-bold md:text-4xl">
              You are not an admin
            </h1>
          </CardTitle>
          <CardDescription>
            <p className="text-muted-foreground text-xs md:text-sm">
              You are not authorized to access this page.
            </p>
          </CardDescription>
          <CardFooter className="mt-4 flex justify-center">
            <Link className={buttonVariants({ variant: "outline" })} href="/">
              <ArrowLeft className="mr-1 size-4" />
              Back to home
            </Link>
          </CardFooter>
        </CardHeader>
      </Card>
    </div>
  );
}

export default NotAdminPage;
