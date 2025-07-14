"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

function PaymentSuccessful() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-1 items-center justify-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex w-full justify-center">
            <CheckIcon className="size-12 rounded-full bg-green-500/30 p-2 text-green-500" />
          </div>
          <div className="mt-3 w-full text-center sm:mt-5">
            <h2 className="text-2xl font-semibold">Payment Successful</h2>
            <p className="text-muted-foreground mt-2 text-sm tracking-tight text-balance">
              Congrats your payment was successful. You should now have access
              to the course
            </p>
            <Link
              href={"/dashboard"}
              className={buttonVariants({ className: "mt-5 w-full" })}
            >
              <ArrowLeft className="size-4" />
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessful;
