"use client";

import {
  AppShell,
  AppShellHeader,
  Center,
  Group,
  Title,
  Button,
} from "@mantine/core";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ProfileButton from "@/components/profile-dropdown/ProfileButton";
import HelpModal from "@/components/HelpModal";

export default function ClientAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isSignupPage = pathname === "/signup";
  const isLoginPage = pathname === "/login";

  return (
    <Center style={{ backgroundColor: "#eacebeff" }}>
      <AppShell
        style={{ opacity: "unset"}}
        header={{ height: 75 }}
        padding={"xs"}
        w={"75%"}
      >
        <AppShellHeader>
          <Group
            justify={"space-between"}
            h={"100%"}
            pr={"lg"}
            pl={"lg"}
          >
            <Group>
              {/*Don't show navbar if you're signing up or in, to focus concern on one thing and limit options*/}
              {!isLoginPage && !isSignupPage && (
                <HelpModal/>
              )}

              <Button
                onClick={() => router.push("/")}
                h={70}
                ff="monospace"
                color="black"
                variant="transparent"
                leftSection={
                  <Image
                    src="/Travel-Icon.png"
                    alt="Travel icon"
                    width={75}
                    height={65}
                    style={{ objectFit: "contain" }}
                  />
                }
              >
                <Title>Travel Planner</Title>
              </Button>
            </Group>
            {!isLoginPage && <ProfileButton />}
          </Group>
        </AppShellHeader>
      </AppShell>
    </Center>
  );
}
