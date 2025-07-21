import MainHeader from "@/components/MainHeader";
import "./globals.css";

export const metadata = {
  title: "FB_Meet_Room",
  description: "Use FB Consultation Room",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <div id="page">
          <MainHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
