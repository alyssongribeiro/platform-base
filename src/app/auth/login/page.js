// src/app/auth/login/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "login_required") {
      setError("Você precisa realizar o login para acessar essa página.");
    }
  }, [searchParams]);

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
        setError("Credenciais inválidas, verifique seu email e senha.");
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
        callbackUrl: "/dashboard",
      });
      if (res?.error) {
        setError("Erro ao fazer login com Google.");
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
          <h2 className="w-100 text-center mb-2">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <hr />
          <Form onSubmit={handleSubmit}>
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
                "Entrar"
              )}
            </Button>
          </Form>
          <p className="pt-3 text-center">
            <a
              href="/forgot-password"
              className="text-light text-decoration-none"
            >
              Esqueci minha senha!
            </a>
          </p>
          <hr />
          <Button
            variant="danger"
            onClick={handleGoogleLogin}
            className="google-btn w-100"
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
                <img src="/assets/imgs/google-logo.png" alt="Google Logo" />
                <span>Entrar com Google</span>
              </picture>
            )}
          </Button>
        </div>
      </div>
    </Container>
  );
}
