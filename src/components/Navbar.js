// src/components/Navbar.js
"use client";

import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useSession } from "next-auth/react";

export default function AppNavbar() {
  const { data: session } = useSession();
  return (
    <Navbar
      bg="dark"
      expand="lg"
      fixed="top"
      variant="dark"
      className="text-light"
    >
      <Container>
        <Navbar.Brand as={Link} href="/" className="text-light">
          SaaS Platform
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="text-light"
        />
        <Navbar.Collapse id="basic-navbar-nav d-flex" className="text-light">
          <Nav className="me-auto text-light">
            {session ? (
              <>
                <Nav.Link as={Link} href="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} href="/profile">
                  Perfil
                </Nav.Link>
                <hr />
                <Nav.Link as={Link} href="/auth/logout">
                  Sair
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} href="/auth/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} href="/auth/register">
                  Cadastro
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
