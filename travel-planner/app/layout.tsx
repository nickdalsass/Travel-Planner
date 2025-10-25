"use client";

import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Center,
  Group,
  MantineProvider,
  Title,
  Burger,
  AppShellNavbar,
  Avatar,
} from "@mantine/core";
import { Plane } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider theme={{ fontFamily: "Inter, sans-serif" }}>
          <Center>
            <AppShell
              style={{ opacity: "unset" }}
              header={{ height: 75 }}
              navbar={{ width: {lg: 200}, breakpoint: 'sm', collapsed: { desktop: !opened } }}
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
                    <Burger opened={opened} onClick={toggle} size="sm" />
                    <Title order={1}>{<Plane />} Travel Planner</Title>
                  </Group>
                  <Avatar size={50} />
                </Group>
              </AppShellHeader>
              <AppShellNavbar>Navbar</AppShellNavbar>
              <AppShellMain>{children}</AppShellMain>
            </AppShell>
          </Center>
        </MantineProvider>
      </body>
    </html>
  );
}
