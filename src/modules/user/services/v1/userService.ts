import { db } from "@/db";
import { refreshTokens, usuarios } from "@/db/schema";
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
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!secret || !refreshSecret) {
        throw new Error("Variáveis de ambiente JWT não definidas!");
    }

    // 1. Gera o Access Token (15 min)
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: "15m",
    });

    // 2. Gera o Refresh Token (7 dias)
    const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        refreshSecret,
        {
            expiresIn: "7d",
        },
    );

    // 3. Armazena o Refresh Token no banco de dados
    await db.insert(refreshTokens).values({
        token: refreshToken,
        usuarioId: user.id,
        expiraEm: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
    });

    const { senha: _, ...userSemSenha } = user;

    // IMPORTANTE: Retornar o token aqui para o Controller poder enviar ao Front-end
    return { ...userSemSenha, token, refreshToken: refreshToken };
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

export const refreshToken = async (oldRefreshToken: string) => {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    const accessSecret = process.env.JWT_SECRET;

    // Validação das variáveis de ambiente
    if (!refreshSecret || !accessSecret) {
        throw new Error(
            "As variáveis de ambiente JWT_REFRESH_SECRET ou JWT_SECRET não foram definidas!",
        );
    }

    try {
        const [tokenNoBanco] = await db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.token, oldRefreshToken));
        if (!tokenNoBanco) return null;
        // 1. Verifica se o refresh token enviado é válido
        const decoded = jwt.verify(oldRefreshToken, refreshSecret) as {
            id: number;
            email: string;
        };
        if (!decoded) return null;
        const newToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            accessSecret,
            { expiresIn: "15m" },
        );
        const newRefreshToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            refreshSecret,
            { expiresIn: "7d" },
        );

        await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.token, oldRefreshToken));
        await db.insert(refreshTokens).values({
            token: newRefreshToken,
            usuarioId: decoded.id,
            expiraEm: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
        });
        return {
            token: newToken,
            refreshToken: newRefreshToken,
        };
    } catch (error) {
        await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.token, oldRefreshToken));
        return null;
    }
};

export const logoutUser = async (refreshToken: string) => {
    try {
        await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.token, refreshToken));
        return { message: "Logout bem-sucedido" };
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        throw new Error("Erro interno ao processar logout");
    }
};
