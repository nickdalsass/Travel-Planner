import { Button, ButtonProps } from "@mantine/core";
import { useRouter } from "next/navigation";

export const ProfileViewAccount = (props: ButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant="default"
      bd="0px black"
      {...props}
      onClick={() => router.push("/view-account")}
    >
      {props.children}
    </Button>
  );
};
export default ProfileViewAccount;
