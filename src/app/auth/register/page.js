// src/app/auth/register/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      if (res?.error) {
        setError("Houve uma falha ao realizar seu cadastro.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado, tente novamente.");
      console.error("Erro no login:", err);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("google", {
        redirect: false,
        callbackUrl: "/auth/login",
      });
      if (res?.error) {
        setError("Erro ao fazer o cadastro utilizando o Google.");
      } else if (res?.url) {
        router.push(res.url);
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado, tente novamente.");
      console.error("Erro no login com Google:", err);
    }
  };

  return (
    <Container className="mt-5">
      <div className="row">
        <div className="col-xs-10 col-sm-8 col-md-6 col-lg-4 col-xl-4 mx-auto p-3 rounded border bg-light bg-gradient text-dark">
          <h2 className="w-100 text-center mb-2">Cadastro</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <hr />
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite seu email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
            </Form.Group>
            <hr />
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Carregando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </Form>
          <hr />
          <Button
            variant="danger"
            onClick={handleGoogleLogin}
            className="google-btn w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Carregando...
              </>
            ) : (
              <picture>
                <img
                  src="/assets/imgs/google-logo.png"
                  alt="Cadastrar com Google"
                />
                <span>Cadastrar com Google</span>
              </picture>
            )}
          </Button>
        </div>
      </div>
    </Container>
  );
}
