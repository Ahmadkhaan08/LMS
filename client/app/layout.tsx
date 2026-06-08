"use client";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utilis/ThemeProvider";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery, useRefreshTokenQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import { FC, useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} bg-white! bg-no-repeat dark:bg-linear-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>
              {children}
              </Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  // Step 1: Refresh the access token cookie first
  const { isLoading: refreshLoading } = useRefreshTokenQuery({});
  // Step 2: Only load user AFTER refresh completes (skip while refreshing)
  const { isLoading } = useLoadUserQuery({}, { skip: refreshLoading });
  return <>{refreshLoading || isLoading ? <Loader /> : <>{children}</>}</>;
};
