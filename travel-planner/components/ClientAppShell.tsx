"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Center,
  Group,
  Title,
  Burger,
  AppShellNavbar,
  Button,
} from "@mantine/core";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import ProfileButton from "@/components/ProfileButton";

export default function ClientAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const isSignupPage = pathname === "/signup";
  const isLoginPage = pathname === "/login";

  return (
    <Center style={{ backgroundColor: '#eacebeff'}}>
      <AppShell
        style={{ opacity: "unset"}}
        header={{ height: 75 }}
        navbar={{
          width: 200,
          breakpoint: "sm",
          collapsed: { desktop: !opened, mobile: !opened },
        }}
        padding={"xs"}
        w={"75%"}
      >
        <AppShellHeader>
          <Group
            justify={"space-between"}
            h={"100%"}
            w={"100%"}
            pr={"lg"}
            pl={"lg"}
            miw={"345px"}
            style={{ backgroundColor: '#d5e3f9ff'}}
          >
            <Group>
              {/*Don't show navbar if you're signing up or in, to focus concern on one thing and limit options*/}
              {!isLoginPage && !isSignupPage && (
                <Burger opened={opened} onClick={toggle} />
              )}
              <Button
                onClick={() => router.push("/")}
                h={75}
                ff="monospace"
                color="black"
                variant="transparent"
                leftSection={
                  <Image
                    src="/Travel-Icon.png"
                    alt="Travel icon"
                    //src="/favicon.ico"
                    //alt="Plane icon"
                    width={65}
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
        <AppShellNavbar>
          Navbar
        </AppShellNavbar>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </Center>
  );
}
