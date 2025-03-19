// src/app/profile/page.js
"use client";

import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ name: "", email: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?error=login_required");
    } else if (session) {
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setUpdateLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: form.name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erro ao atualizar o perfil.");
      } else {
        setMessage("Perfil atualizado com sucesso!");
        const updatedSession = await getSession();
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setMessage("Erro inesperado. Tente novamente mais tarde.");
    }
    setUpdateLoading(false);
  };

  if (status === "loading" || !session) {
    return <div className="container mt-5">Carregando...</div>;
  }

  return (
    <Container className="mt-5 p-3 rounded border bg-light bg-gradient text-dark">
      <h2>Perfil do Usuário</h2>
      <hr />
      {message && (
        <Alert variant={message.includes("sucesso") ? "success" : "danger"}>
          {message}
        </Alert>
      )}
      <div className="row">
        <div className="col-4">
          <picture>
            <img
              src={session.user.image.replace("s96-c", "s384-c", true)}
              className="img-fluid"
            />
          </picture>
        </div>
        <div className="col-8">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={updateLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                readOnly
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />{" "}
                  Atualizando...
                </>
              ) : (
                "Atualizar"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
}
