// src/app/api/users/route.js
import clientPromise from "../../../lib/mongodb";
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
