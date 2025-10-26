"use client";

import { Button } from "@mantine/core";
import { User } from "lucide-react";

export const LoginButton = () => {
  const handleClick = () => {
    if (typeof window !== undefined) {
      const loginPageUrl = "/login";
      window.location.href = loginPageUrl;
    }
  };

  return (
    <Button
      h={"70%"}
      variant="filled"
      radius={"xl"}
      rightSection={<User />}
      onClick={handleClick}
      size="lg"
    >
      Log In
    </Button>
  );
};
export default LoginButton;
