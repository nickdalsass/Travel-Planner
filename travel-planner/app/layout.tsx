import { Fredoka } from "next/font/google";
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import ClientAppShell from "@/components/ClientAppShell";
import Modal from "@/components/HelpModal";

const fredokaOne = Fredoka({ 
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
      <body className={fredokaOne.className}>
        <MantineProvider theme={{ fontFamily: `${fredokaOne.style.fontFamily}, sans-serif` }}>
          <ClientAppShell>{children}</ClientAppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
