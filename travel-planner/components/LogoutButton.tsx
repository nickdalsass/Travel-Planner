"use client";

import { supabase } from "@/lib/supabase/client";
import { Button, ButtonProps } from "@mantine/core";
import { JSX, DetailedHTMLProps, ButtonHTMLAttributes, Ref } from "react";

export const LogoutButton = (
  // Got this JSX stuff from stack overflow, I had no idea how to do this. It works now, let's go.
  props: JSX.IntrinsicAttributes &
    ButtonProps & { component?: "button" | undefined } & Omit<
      Omit<
        DetailedHTMLProps<
          ButtonHTMLAttributes<HTMLButtonElement>,
          HTMLButtonElement
        >,
        "ref"
      >,
      "component" | keyof ButtonProps
    > & {
      ref?: Ref<HTMLButtonElement> | undefined;
    }
) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      // full page reload to ensure all auth state is cleared and returns to home if they are in the middle of a form
      window.location.href = '/';
    }
  };
  return (
    <Button
      variant="default"
      bd={"0px black"}
      {...props}
      onClick={handleLogout}
    >
      {props.children}
    </Button>
  );
};
