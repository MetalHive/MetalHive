import type { Metadata } from "next";
import { interDisplay } from "./fonts";
import "./globals.css";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { AuthInitializer } from "./Components/AuthInitializer";



export const metadata: Metadata = {
  title: "Metal Hive",
  description: "This is an app for selling scrap metals",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interDisplay.variable}`}
      >
        <ReactQueryProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
