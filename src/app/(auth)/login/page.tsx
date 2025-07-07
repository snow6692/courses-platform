import LoginForm from "../../../components/forms/LoginForm";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth-utils";

async function LoginPage() {
  const user = await getAuthUser();
  if (user) {
    redirect("/");
  }
  return <LoginForm />;
}

export default LoginPage;
