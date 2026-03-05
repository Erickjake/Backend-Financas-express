import { Request, Response } from "express";
import * as userService from "../services/userService.js";
import { insertUsuarioSchema } from "@/db/schema.js";
import { z } from "zod"; // <-- Garante que importaste o 'z' aqui!

export const userRegister = async (req: Request, res: Response) => {
    console.log("--- DEBUG REQUISIÇÃO ---");
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body recebido:", req.body);
    try {
        // O parse vai dar erro se o body for undefined ou mal formado
        const userData = insertUsuarioSchema.parse(req.body);

        const existingUser = await userService.getUserByEmail(userData.email);
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Este email já está em uso." });
        }

        const newUser = await userService.createUser(userData);

        return res.status(201).json({
            message: "Utilizador criado com sucesso!",
            user: newUser,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Usamos .issues para o TypeScript não reclamar
            return res.status(400).json({
                error: "Dados de registo inválidos",
                details: error.issues.map((issue) => ({
                    campo: issue.path.join("."),
                    mensagem: issue.message,
                })),
            });
        }

        console.error("Erro interno:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        // 2. Adicionar validação Zod no Login também!
        const loginSchema = z.object({
            email: z.string().email("Email inválido"),
            senha: z.string().min(1, "Senha é obrigatória"),
        });

        const { email, senha } = loginSchema.parse(req.body);

        const user = await userService.loginUser(email, senha);

        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        return res.status(200).json({ message: "Login bem-sucedido", user });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Dados de login inválidos",
                details: error.flatten().fieldErrors,
            });
        }
        return res.status(500).json({ error: "Erro interno ao fazer login." });
    }
};
