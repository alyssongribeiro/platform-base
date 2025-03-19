// src/components/Navbar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useSession } from "next-auth/react";

export default function AppNavbar() {
  const [expanded, setExpanded] = useState(false);
  const { data: session } = useSession();
  return (
    <Navbar
      expanded={expanded}
      bg="dark"
      expand="lg"
      fixed="top"
      variant="dark"
      className="text-light"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          href="/"
          onClick={() => setExpanded(false)}
          className="text-light"
        >
          SaaS Platform
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
          className="text-light"
        />
        <Navbar.Collapse id="basic-navbar-nav" className="text-light">
          <Nav className="ms-auto text-light">
            {session ? (
              <>
                <Nav.Link
                  as={Link}
                  href="/dashboard"
                  onClick={() => setExpanded(false)}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/profile"
                  onClick={() => setExpanded(false)}
                >
                  Perfil
                </Nav.Link>
                <hr />
                <Nav.Link
                  as={Link}
                  href="/auth/logout"
                  onClick={() => setExpanded(false)}
                >
                  Sair
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  href="/auth/login"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/auth/register"
                  onClick={() => setExpanded(false)}
                >
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
