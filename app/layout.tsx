import "./globals.css";
import { Providers } from "./providers";
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Montserrat:wght@500;700&display=swap" rel="stylesheet"></link>
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}