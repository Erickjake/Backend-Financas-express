import { Request, Response, NextFunction } from "express";

// Esta função envolve o teu controller e faz o try/catch automaticamente
export const asyncHandler =
    (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
