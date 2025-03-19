// src/app/page.js
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mt-5">
      <h1>Bem-vindo à Plataforma SaaS</h1>
      <p>Esta é a base para criar aplicações SaaS modernas e funcionais.</p>
      <Link href="/auth/login" className="btn btn-primary">
        Fazer Login
      </Link>
    </div>
  );
}
