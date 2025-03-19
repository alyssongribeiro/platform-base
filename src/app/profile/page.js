// src/app/profile/page.js
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ name: "", email: "" });
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session) {
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [status, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implemente a atualização do perfil do usuário via API
    alert("Perfil atualizado!");
  };

  if (status === "loading") {
    return <div className="container mt-5">Carregando...</div>;
  }

  return (
    <Container className="mt-5">
      <h2>Perfil do Usuário</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Atualizar
        </Button>
      </Form>
    </Container>
  );
}
