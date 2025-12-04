"use client";
import { Button, ButtonProps } from "@mantine/core";

import { useRouter } from "next/navigation";

export const ViewCreatedTripsButton = (props: ButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant="default"
      bd="0px black"
      {...props}
      onClick={() => router.push("/tripview")}
    >
      {props.children}
    </Button>
  );
};
export default ViewCreatedTripsButton;
