import { getCurrentUser } from "@/app/data/user/require-user";
import { NavbarClient } from "./NavbarClient";

export default async function Navbar() {
  const user = await getCurrentUser();

  return <NavbarClient user={user} />;
}
