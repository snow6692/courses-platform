import Link from "next/link";
import React from "react";

function NotAdminPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">You are not an admin</h1>


      <Link className="text-blue-500" href="/">
        Go to home
      </Link>
    </div>
  );
}

export default NotAdminPage;
