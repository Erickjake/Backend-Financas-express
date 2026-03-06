import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export type InsertUsuario = typeof usuarios.$inferInsert;

/**
 * Cria um utilizador com senha encriptada
 */
export const createUser = async (data: InsertUsuario) => {
    const saltRounds = 10;
    const senhaEncriptada = await bcrypt.hash(data.senha, saltRounds);

    const [novoUsuario] = await db
        .insert(usuarios)
        .values({ ...data, senha: senhaEncriptada })
        .returning();

    const { senha: _, ...userSemSenha } = novoUsuario;
    return userSemSenha;
};

/**
 * Procura todos os utilizadores (sem mostrar senhas)
 */
export const getAllUser = async () => {
    return await db
        .select({
            id: usuarios.id,
            nome: usuarios.nome,
            email: usuarios.email,
            // Adicione aqui outros campos do seu schema, exceto a senha
        })
        .from(usuarios);
};

/**
 * Atualiza utilizador (Garante que não quebra a tipagem parcial)
 */
export const updateUser = async (
    userId: number,
    userData: Partial<InsertUsuario>,
) => {
    // Se a senha for enviada no update, precisamos encriptá-la novamente
    if (userData.senha) {
        userData.senha = await bcrypt.hash(userData.senha, 10);
    }

    await db.update(usuarios).set(userData).where(eq(usuarios.id, userId));

    return { message: "Usuário atualizado com sucesso" };
};

/**
 * Login com validação Bcrypt e retorno de Token JWT
 */
export const loginUser = async (email: string, senhaEnviada: string) => {
    const [user] = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.email, email))
        .limit(1);

    if (!user || !(await bcrypt.compare(senhaEnviada, user.senha))) {
        return null;
    }
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("A variável de ambiente JWT_SECRET não foi definida!");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "8h" },
    );

    const { senha: _, ...userSemSenha } = user;

    // IMPORTANTE: Retornar o token aqui para o Controller poder enviar ao Front-end
    return { ...userSemSenha, token };
};

export const getUserById = async (userId: number) => {
    const [user] = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.id, userId));
    if (!user) return null;
    const { senha: _, ...userSemSenha } = user;
    return userSemSenha;
};

export const deleteUser = async (userId: number) => {
    await db.delete(usuarios).where(eq(usuarios.id, userId));
    return { message: "Usuário deletado com sucesso" };
};

export const getUserByEmail = async (email: string) => {
    const [user] = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.email, email))
        .limit(1);
    return user;
};
