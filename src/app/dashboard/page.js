// src/app/dashboard/page.js
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Button } from "react-bootstrap";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?error=login_required");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return <div className="container mt-5">Carregando...</div>;
  }

  return (
    <Container className="mt-5">
      <h2>Dashboard</h2>
      <p>Bem-vindo, {session.user.name || session.user.email}</p>
    </Container>
  );
}
