import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
interface IProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}
function EmptyState({ buttonText, description, title, href }: IProps) {
  return (
    <div className="animate-in fade-in-50 flex flex-1 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="bg-primary/10 flex size-20 items-center justify-center rounded-full">
        <Ban className="text-primary size-10" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 mb-8 text-center text-sm leading-tight">
        {description}
      </p>
      <Link href={href} className={buttonVariants()}>
        <PlusCircle className="mr-2 size-4" />
        {buttonText}
      </Link>
    </div>
  );
}

export default EmptyState;
