// src/app/admin/page.js
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container } from "react-bootstrap";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Enquanto a sessão está carregando, exibe uma mensagem de carregamento.
  if (status === "loading") {
    return <div className="container mt-5">Carregando...</div>;
  }

  // Se o usuário não estiver autenticado, redireciona para a página de login.
  if (status === "unauthenticated") {
    router.push("/auth/login?error=login_required");
    return <div className="container mt-5">Redirecionando para login...</div>;
  }

  // Se o usuário estiver autenticado, mas não for admin, exibe a mensagem de acesso negado.
  if (session && session.user && session.user.role !== "admin") {
    return (
      <Container className="mt-5">
        <h2>Acesso Negado</h2>
        <p>Você não possui permissão para acessar esta página.</p>
      </Container>
    );
  }

  // Se for admin, exibe o conteúdo da página de administração.
  return (
    <Container className="mt-5">
      <h2>Página de Administrador</h2>
      <p>Bem-vindo, administrador!</p>
      {/* Aqui você pode incluir outras funcionalidades administrativas */}
    </Container>
  );
}
