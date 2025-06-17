import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { FcGoogle } from "react-icons/fc";

function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome back! </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Login With Google Email Account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" variant="outline">
          <FcGoogle className="size-4" />
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}

export default LoginPage;
