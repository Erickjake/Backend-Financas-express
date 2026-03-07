import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Nenhum token fornecido" });
    }

    const parts = authHeader.split(" ");
    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: number;
        };

        (req as Request).userId = decoded.id;

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
};
