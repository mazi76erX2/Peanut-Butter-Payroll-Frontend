import type { Metadata } from "next";
import "./globals.css";
import ClientProvidersWrapper from "../app/components/ClientProvidersWrapper";

export const metadata: Metadata = {
  title: "Peanut Butter Payroll",
  description: "Peanut Butter Payroll",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvidersWrapper>{children}</ClientProvidersWrapper>
      </body>
    </html>
  );
}
