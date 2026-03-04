import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tabela de Utilizadores
export const usuarios = sqliteTable("usuarios", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    email: text("email").notNull().unique(),
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
