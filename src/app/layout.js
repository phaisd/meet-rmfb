import "./globals.css";
import ConsentManager from "@/components/ConsentManager";

export const metadata = {
  title: "FB_Meet_Room",
  description: "Use FB Consultation Room",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
        <ConsentManager />
      </body>
    </html>
  );
}
