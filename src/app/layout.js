// import { Geist, Geist_Mono } from "next/font/google";
import MainHeader from "@/components/mainheader";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "FB Meetings Rooms",
  description: "FB Meeting Room next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
}
