import { db } from "@/db"; // Garante que o caminho no tsconfig.json existe
import { transacoes } from "@/db/schema";
import { eq, InferInsertModel, sum } from "drizzle-orm";

// Tipagem automática para inserção
export type NewTransaction = InferInsertModel<typeof transacoes>;

/**
 * Cria uma nova transação no banco de dados
 */
export const createTransaction = async (transaction: NewTransaction) => {
    try {
        await db.insert(transacoes).values(transaction);
    } catch (error) {
        console.error("Erro ao criar transação:", error);
        throw error;
    }
};

/**
 * Lista todas as transações de um usuário específico
 * @param usuarioId ID do usuário (baseado no schema)
 */
export const listTransactions = async (usuarioId: number) => {
    try {
        const transacoesDoUsuario = await db
            .select()
            .from(transacoes)
            .where(eq(transacoes.usuarioId, usuarioId));

        return transacoesDoUsuario;
    } catch (error) {
        console.error("Erro ao listar transações:", error);
        throw error;
    }
};

export const deleteTransaction = async (id: number) => {
    try {
        const deleteTransaction = await db
            .delete(transacoes)
            .where(eq(transacoes.id, id))
            .returning();
        return deleteTransaction;
    } catch (error) {
        console.error("Erro ao deletar transação:", error);
        throw error;
    }
};

export const editarTransaction = async (
    id: number,
    transaction: Partial<NewTransaction>,
) => {
    try {
        const editarTransaction = await db
            .update(transacoes)
            .set(transaction)
            .where(eq(transacoes.id, id))
            .returning();
        return editarTransaction;
    } catch (error) {
        console.error("Erro ao editar transação:", error);
        throw error;
    }
};

export const getSaldoTotal = async (usuarioId: number) => {
    try {
        const transacoesDoUsuario = await db
            .select()
            .from(transacoes)
            .where(eq(transacoes.usuarioId, usuarioId));

        const resumo = transacoesDoUsuario.reduce(
            (acc, atual) => {
                const valor = Number(atual.valor); // Garante que é número

                if (atual.tipo.toUpperCase() === "RECEITA") {
                    acc.receitas += valor;
                } else if (atual.tipo.toUpperCase() === "DESPESA") {
                    acc.despesas += valor;
                }
                return acc;
            },
            { receitas: 0, despesas: 0 },
        );

        // 3. Retorna o objeto formatado
        return {
            totalReceitas: resumo.receitas,
            totalDespesas: resumo.despesas,
            saldo: resumo.receitas - resumo.despesas,
        };
    } catch (error) {
        console.error("Erro ao calcular saldo total:", error);
        throw error;
    }
};
