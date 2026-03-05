import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type InsertUsuario = typeof usuarios.$inferInsert;

export const createUser = async (data: InsertUsuario) => {
    const result = await db.insert(usuarios).values(data).returning();

    return result[0];
};

export const getAllUser = async () => {
    const users = await db.select().from(usuarios);
    return users;
};

export const getUserById = async (userId: number) => {
    const user = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.id, userId));
    return user[0];
};

export const deleteUser = async (userId: number) => {
    await db.delete(usuarios).where(eq(usuarios.id, userId));
    return { message: "Usuário deletado com sucesso" };
};

export const updateUser = async (userId: number, userData: InsertUsuario) => {
    await db.update(usuarios).set(userData).where(eq(usuarios.id, userId));
    return { message: "Usuário atualizado com sucesso" };
};
// 3. Login (Verifica email E senha)
export const loginUser = async (email: string, senha: string) => {
    const result = await db
        .select()
        .from(usuarios)
        .where(and(eq(usuarios.email, email), eq(usuarios.senha, senha)))
        .limit(1);

    return result[0];
};

// 1. Procurar utilizador apenas pelo Email (Essencial para o Registo)
export const getUserByEmail = async (email: string) => {
    const result = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.email, email))
        .limit(1);

    return result[0]; // Retorna o user ou undefined
};
