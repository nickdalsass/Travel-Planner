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
import { Plane } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import LoginButton from "@/components/LoginButton";

export default function ClientAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";

  return (
    <Center>
      <AppShell
        style={{ opacity: "unset" }}
        header={{ height: 75 }}
        navbar={{
          width: { lg: 200 },
          breakpoint: "sm",
          collapsed: { desktop: !opened },
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
          >
            <Group>
              {isHomePage && <Burger opened={opened} onClick={toggle} />}
              <Button
                onClick={() => router.push("/")}
                h={75}
                ff="monospace"
                color="black"
                variant="transparent"
                leftSection={<Plane size={40} />}
              >
                <Title>Travel Planner</Title>
              </Button>
            </Group>
            {!isLoginPage && <LoginButton />}
          </Group>
        </AppShellHeader>
        <AppShellNavbar>Navbar</AppShellNavbar>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </Center>
  );
}