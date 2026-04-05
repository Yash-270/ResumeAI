import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ClientLayout from "@/Components/ClientLayout";

export const metadata = {
  title: "ResumeAI",
  description: "AI Resume Analyzer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}