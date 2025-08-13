export const metadata = { title: "Creator-Base", description: "Adult-Agentur – sauber, planbar, fair." };
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head />
      <body className="antialiased bg-[#0b0b0f] text-white">{children}</body>
    </html>
  );
}
