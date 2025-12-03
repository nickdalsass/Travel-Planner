import { Button, ButtonProps } from "@mantine/core";
import { useRouter } from "next/navigation";

export const ProfileShareTrip = (props: ButtonProps) => {
  const router = useRouter();
  
  return (
    <Button
      variant="default"
      bd="0px black"
      {...props}
      onClick={() => router.push("/share-trip")}
    >
      {props.children}
    </Button>
  );
};
export default ProfileShareTrip;