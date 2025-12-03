"use client";

import { supabase } from "@/lib/supabase/client";
import { Button, ButtonProps } from "@mantine/core";

export const LogoutButton = (props: ButtonProps) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      // full page reload to ensure all auth state is cleared and returns to home if they are in the middle of a form
      window.location.href = "/";
    }
  };
  return (
    <Button variant="default" bd="0px black" {...props} onClick={handleLogout}>
      {props.children}
    </Button>
  );
};
export default LogoutButton;
