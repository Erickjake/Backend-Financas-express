import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService.js";
import { insertUsuarioSchema } from "@/db/schema.js";
import { z } from "zod";
import { asyncHandler } from "@/utils/asyncHandler.js";

const updateUsuarioSchema = insertUsuarioSchema.partial().omit({ id: true });
/**
 * REGISTO DE UTILIZADOR
 */
export const userRegister = asyncHandler(
    async (req: Request, res: Response) => {
        // A validação Zod lança um erro se falhar; o asyncHandler captura e o middleware trata.
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
    },
);

/**
 * LOGIN DE UTILIZADOR
 */
export const userLogin = asyncHandler(async (req: Request, res: Response) => {
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
});

/**
 * APAGAR UTILIZADOR
 */
export const deleteUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const idNumerico = Number(id);

        if (isNaN(idNumerico)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        const resultado = await userService.deleteUser(idNumerico);
        return res.status(200).json(resultado);
    },
);

/**
 * ATUALIZAR UTILIZADOR
 */
export const updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const idNumerico = Number(id);

        if (isNaN(idNumerico)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        // Validação parcial (pode vir apenas nome, ou apenas email, etc.)
        const userData = updateUsuarioSchema.parse(req.body);

        if (Object.keys(userData).length === 0) {
            return res.status(400).json({ error: "Nenhum dado fornecido." });
        }

        // Enviamos para o service
        const userAtualizado = await userService.updateUser(
            idNumerico,
            userData,
        );
        return res.status(200).json(userAtualizado);
    } catch (error) {
        next(error); // Agora o 'next' está declarado e funciona!
    }
};
