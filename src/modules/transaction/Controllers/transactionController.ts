import { Request, Response } from "express";
import * as transactionService from "../services/transactionService";

export const getTransacao = async (req: Request, res: Response) => {
    try {
        const usuario = req.headers["x-usuario"] as string;
        if (!usuario) {
            return res.status(400).json({ error: "Usuário não fornecido" });
        }
        const dados = await transactionService.listarTransacoes(usuario);
        res.status(200).json(dados);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar transações" });
    }
};

export const postTransacao = async (req: Request, res: Response) => {
    try {
        const usuario = req.headers["x-usuario"] as string;
        if (!usuario) {
            return res.status(400).json({ error: "Usuário não fornecido" });
        }

        // 👇 A MÁGICA ACONTECE AQUI 👇
        // Nós usamos o "Spread Operator" (...) para espalhar o titulo, valor e tipo, e adicionamos o usuario
        const dadosDaTransacao = {
            ...req.body,
            usuario: usuario,
        };

        // Agora mandamos o pacote completo (com o dono) para o banco de dados
        const novaTransacao =
            await transactionService.criarTransacao(dadosDaTransacao);

        res.status(201).json(novaTransacao);
    } catch (error) {
        console.error("ERRO NO BANCO:", error);
        res.status(500).json({ error: "Erro ao criar transação" });
    }
};

export const getSaldoTotal = async (req: Request, res: Response) => {
    try {
        const usuario = req.headers["x-usuario"] as string;
        if (!usuario) {
            return res.status(400).json({ error: "Usuário não fornecido" });
        }
        const saldoTotal = await transactionService.calcularSaldoTotal(usuario);
        res.status(200).json(saldoTotal);
    } catch (error) {
        console.error("ERRO NO BANCO:", error);
        res.status(500).json({ error: "Erro ao calcular saldo total" });
    }
};

// Adicione esta função no final do seu controller
export const deleteTransacao = async (req: Request, res: Response) => {
    try {
        // Pegamos o ID que vem na URL e transformamos em Número
        const id = Number(req.params.id);

        // Pedimos para o Service apagar
        await transactionService.deletarTransacao(id);

        // Retornamos o status 204 (No Content) -> Significa "Deu certo, mas não tenho texto para devolver"
        res.status(204).send();
    } catch (error) {
        console.error("❌ ERRO AO DELETAR TRANSAÇÃO:", error);
        res.status(500).json({ error: "Erro ao deletar a transação" });
    }
};
