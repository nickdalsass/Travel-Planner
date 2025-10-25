import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import ClientAppShell from "@/components/ClientAppShell";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider theme={{ fontFamily: "Inter, sans-serif" }}>
          <ClientAppShell>{children}</ClientAppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
