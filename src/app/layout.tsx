// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "QuizMaster AI",
  description: "AI quiz generator demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
