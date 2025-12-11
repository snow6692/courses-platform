import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg-hero relative mx-auto flex h-screen w-full flex-col items-center justify-center">
      <div className="absolute top-10 left-4">
        <Link
          href={"/"}
          className={buttonVariants({
            variant: "outline",
            className:
              "bg-background/50 hover:bg-background/80 backdrop-blur-sm",
          })}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <div className="w-full max-w-sm px-4">{children}</div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
        <svg
          className="relative block h-[30px] w-[calc(100%+1.3px)] sm:h-[60px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,432.84,52.47,276.53,60.83,109.25,32.38,32,0L0,0V120H1200V75.1C1154.27,99.37,1065.19,113.67,985.66,92.83Z"
            className="fill-background"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default AuthLayout;
