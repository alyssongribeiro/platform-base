// src/app/page.js
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="container mt-5">
      <h1>Bem-vindo à Plataforma SaaS</h1>
      <p>Esta é a base para criar aplicações SaaS modernas e funcionais.</p>

      {status != "authenticated" ? (
        <>
          <Link href="/auth/login" className="btn btn-primary">
            Fazer Login
          </Link>
        </>
      ) : (
        <>
          <Link href="/profile" className="btn btn-primary">
            Acessar Perfil
          </Link>
        </>
      )}
    </div>
  );
}
