// src/app/layout.js
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const metadata = {
  title: "SaaS Platform",
  description: "Plataforma SaaS funcional com Next.js, Bootstrap e MongoDB",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers session={session}>
          <div className="container-fluid h-100">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
