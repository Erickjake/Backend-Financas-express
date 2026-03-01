// Importamos os tipos do Express, incluindo o NextFunction
import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // 1. Pegamos a data e hora exata do momento da requisição
    const horaAtual = new Date().toLocaleString("pt-BR");

    // 2. Pegamos qual método foi usado (GET, POST, DELETE, etc.)
    const metodo = req.method;

    // 3. Pegamos a URL que o usuário tentou acessar (ex: /transacoes)
    const url = req.url;

    // 4. Imprimimos no terminal (console) a nossa mensagem de log
    console.log(
        `[${horaAtual}] 📝 Requisição recebida: ${metodo} na rota ${url}`,
    );

    // 5. IMPORTANTE: Mandamos o servidor continuar o fluxo normal
    // Se esquecermos o next(), o servidor fica carregando para sempre e não devolve resposta!
    next();
};
