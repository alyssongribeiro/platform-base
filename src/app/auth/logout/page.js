// src/app/auth/logout/page.js
"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Spinner } from "react-bootstrap";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Chama o signOut para desconectar o usuário e redireciona para a página de login
    signOut({ redirect: false })
      .then(() => {
        router.push("/auth/login");
      })
      .catch((error) => {
        console.error("Erro ao efetuar logout:", error);
      });
  }, [router]);

  return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Desconectando...</span>
      </Spinner>
      <p>Desconectando, por favor aguarde...</p>
    </Container>
  );
}
