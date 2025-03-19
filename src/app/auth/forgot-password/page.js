// src/app/auth/forgot-password/page.js
"use client";

import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.message || "Ocorreu um erro ao enviar o link de redefinição."
        );
      } else {
        setSuccess(data.message);
      }
    } catch (err) {
      console.error("Erro no forgot password:", err);
      setError("Erro inesperado. Tente novamente mais tarde.");
    }

    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <div className="row">
        <div className="col-xs-10 col-sm-8 col-md-6 col-lg-4 col-xl-4 mx-auto p-3 rounded border bg-light bg-gradient text-dark">
          <h2>Recuperação de Senha</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <hr />
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Enviando...
                </>
              ) : (
                "Enviar Instruções"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
}
