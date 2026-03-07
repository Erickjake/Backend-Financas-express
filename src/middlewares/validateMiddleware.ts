import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware genérico para validação de dados com Zod.
 */
export const validateSchema = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const resultado = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Se a validação falhar (success === false)
        if (!resultado.success) {
            // Asserção de tipo: forçamos o TypeScript a tratar o erro como um ZodError clássico
            const erroZod = resultado.error as ZodError;

            res.status(400).json({
                status: "erro",
                mensagem: "Dados de entrada inválidos",
                // Usamos '.issues' em vez de '.errors', que é mais amigável para o TypeScript
                erros: erroZod.issues.map((e) => ({
                    campo: e.path.join("."),
                    mensagem: e.message,
                })),
            });
            return;
        }

        // Se a validação passar
        next();
    };
};
