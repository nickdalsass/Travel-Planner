import { Quicksand } from "next/font/google";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import ClientAppShell from "@/components/ClientAppShell";

const quicksand = Quicksand({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700']
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <MantineProvider theme={{ fontFamily: `${quicksand.style.fontFamily}, sans-serif` }}>
          <ClientAppShell>{children}</ClientAppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
