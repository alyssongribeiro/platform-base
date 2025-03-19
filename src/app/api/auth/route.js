// src/app/api/auth/route.js
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Por favor, defina JWT_SECRET em .env.local");
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Procura o usuário no banco de dados
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Credenciais inválidas" }),
        { status: 401 }
      );
    }

    // Verifica se a senha fornecida corresponde à senha armazenada (criptografada)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Credenciais inválidas" }),
        { status: 401 }
      );
    }

    // Gera um token JWT para o usuário
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(
      JSON.stringify({
        message: "Login efetuado com sucesso",
        userId: user._id,
        token,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao efetuar login:", error);
    return new Response(
      JSON.stringify({ message: "Erro interno no servidor" }),
      { status: 500 }
    );
  }
}
