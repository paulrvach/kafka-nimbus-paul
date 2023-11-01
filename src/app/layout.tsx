import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "./_context/AuthProvider";
import { ThemeProvider } from "./_context/theme-provider";
import { Theme as RadixTheme } from "@radix-ui/themes";
import { Providers } from "~/app/_redux/provider";
import NavBar from "./_components/nav-bar";
import localFont from "next/font/local";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const geist = localFont({
  src: [
    {
      path: "../../public/Geist-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Geist-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Geist-SemiBold.otf",
      weight: "600",
      style: "normal",
    },

    {
      path: "../../public/Geist-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata = {
  title: "Kafka Nimbus",
  description: "Deploy Kafka",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={` ${geist.className}`}>
        <TRPCReactProvider headers={headers()}>
          <AuthProvider>
            <Providers>
              <RadixTheme>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <div className="xl:mx-30 mx-8 md:mx-24">
                    <NavBar />
                    {children}
                  </div>
                </ThemeProvider>
              </RadixTheme>
            </Providers>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
