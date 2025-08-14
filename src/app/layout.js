import "./globals.css";
import ConsentManager from "@/components/ConsentManager";
import ConsentGate from "@/components/ConsentGate";
import Head from "next/head";

export const metadata = {
  title: "FB_Meet_Room",
  description: "Use FB Consultation Room",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        {children}
        {/* <ConsentGate allow="analytics"> */}
        {/* Google Analytics หรือ script อื่นๆ */}
        {/* </ConsentGate> */}
        {/* <ConsentManager /> */}
      </body>
    </html>
  );
}
