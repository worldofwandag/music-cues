
import type { Metadata } from "next";
import "./globals.css";
import { AudioManagerProvider } from "./context/AudioManagerContext";

export const metadata = {
  title: "Cue Browser",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AudioManagerProvider>
          {children}
        </AudioManagerProvider>
      </body>
    </html>
  );
}

