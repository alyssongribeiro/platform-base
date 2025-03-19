// src/app/api/users/route.js
import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Por favor, defina JWT_SECRET em .env.local");
}

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Verifica se o usuário já existe
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Usuário já existe" }), {
        status: 400,
      });
    }

    // Criptografa a senha usando bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insere o novo usuário no banco de dados com a senha criptografada
    const result = await db
      .collection("users")
      .insertOne({ name, email, password: hashedPassword });

    // Gera um token JWT para o novo usuário
    const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return new Response(
      JSON.stringify({
        message: "Usuário criado com sucesso",
        userId: result.insertedId,
        token,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return new Response(
      JSON.stringify({ message: "Erro interno no servidor" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // Extrai o token JWT a partir da requisição usando a variável de ambiente JWT_SECRET
    const token = await getToken({
      req,
      secret: process.env.JWT_SECRET,
      cookieName: "next-auth.session-token",
    });

    console.log(token);

    if (!token) {
      console.error("Token não encontrado.");
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Assume que o token possui a propriedade 'id' com o ObjectId do usuário
    const userId = token.id;

    console.log(userId);

    if (!userId) {
      console.error("Token não contém a propriedade id.");
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Pega os dados do corpo da requisição (ex.: nome)
    const { name } = await req.json();
    if (!name) {
      return new Response(JSON.stringify({ message: "Nome é obrigatório" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db();

    // Atualiza o usuário pelo id extraído do JWT
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { name } });

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Usuário não encontrado" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Perfil atualizado com sucesso!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    return new Response(
      JSON.stringify({ message: "Erro interno no servidor" }),
      { status: 500 }
    );
  }
}
