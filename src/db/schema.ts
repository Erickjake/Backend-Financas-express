import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

// Tabela de Utilizadores
export const usuarios = sqliteTable("usuarios", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    email: text("email").notNull().unique(),
    senha: text("senha").notNull(),
});

// Tabela de Transações
export const transacoes = sqliteTable("transacoes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    titulo: text("titulo").notNull(),
    // Dica: Armazena o valor em cêntimos (ex: 1000 para 10.00€)
    valor: integer("valor").notNull(),
    // Dica: Podes usar o tipo text mas validar na aplicação
    // ou usar um check constraint no futuro
    tipo: text("tipo").notNull(), // Sugestão: "RECEITA" | "DESPESA"
    usuarioId: integer("usuario_id")
        .notNull()
        .references(() => usuarios.id, { onDelete: "cascade" }), // Se o user for apagado, as transações também são
    // Nova coluna: Armazena a data e hora como texto (formato ISO)
    createdAt: text("created_at")
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
});

export const insertUsuarioSchema = createInsertSchema(usuarios, {
    email: () => z.string().email("Email inválido"),
    nome: () => z.string().min(2, "Nome muito curto"),
    senha: () => z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});
export const insertTransacaoSchema = createInsertSchema(transacoes, {
    // Alterar para o formato de função (callback)
    tipo: () =>
        z.enum(["RECEITA", "DESPESA"], {
            errorMap: () => ({ message: "O tipo deve ser RECEITA ou DESPESA" }),
        }),
    valor: () => z.number().positive("O valor deve ser superior a zero"),
    titulo: () => z.string().min(3, "O título é demasiado curto"),
}).omit({
    id: true,
    createdAt: true,
});

// 3. Esquemas de Leitura (Úteis para Tipagem no Frontend)
export const selectTransacaoSchema = createSelectSchema(transacoes);
