// src/@types/express.d.ts

declare namespace Express {
    export interface Request {
        // Definimos que o Request agora pode ter um userId (opcional)
        userId?: number;
    }
}
