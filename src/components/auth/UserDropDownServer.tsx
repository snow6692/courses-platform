import { getCurrentUser } from "@/app/data/user/get-current-user";
import UserDropDown from "./UserDropDown";

export async function UserDropDownServer() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <UserDropDown
      email={user.email}
      name={user.name}
      image={user.image ?? ""}
      role={user.role ?? "user"}
    />
  );
}
