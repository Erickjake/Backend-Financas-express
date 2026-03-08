import { db } from "@/db";
import { refreshTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const cleanExpiredTokens = async () => {
    try {
        await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.expiraEm, Date.now()));
    } catch (error) {
        console.error("Erro ao limpar tokens expirados:", error);
        throw new Error(
            "Erro interno ao processar limpeza de tokens expirados",
        );
    }
};
