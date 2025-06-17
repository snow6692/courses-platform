import { ReactNode } from "react";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-screen w-full max-w-sm flex-col justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
