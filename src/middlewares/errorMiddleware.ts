import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Middleware Global de Erros
 * Captura todos os erros lançados na aplicação.
 */
export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // 1. Tratamento de erros de validação do Zod
    if (error instanceof z.ZodError) {
        return res.status(400).json({
            error: "Erro de validação de dados",
            details: error.flatten().fieldErrors,
        });
    }

    // 2. Erros de Banco de Dados ou outros erros conhecidos (Personalizável)
    console.error("--- ERRO NO SERVIDOR ---", error);

    // 3. Resposta genérica para qualquer outro erro inesperado
    return res.status(500).json({
        error: "Erro interno no servidor.",
    });
};
