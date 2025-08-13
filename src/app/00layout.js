import "./globals.css";

export const metadata = {
  title: "FB_Meet_Room",
  description: "Use FB Consultation Room",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        {children}
      </body>
    </html>
  );
}
