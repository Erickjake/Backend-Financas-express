import { Request, Response } from "express";
import * as transactionService from "../services/transactionService.js";

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const usuarioId = Number(req.query.usuarioId);
        const transaction = req.body;
        await transactionService.createTransaction({
            ...transaction,
            usuarioId: Number(usuarioId),
        });
        res.status(201).json({ message: "Transação criada com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar transação" });
    }
};

// No arquivo transactionController.ts
export const deleteTransacao = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idNumerico = Number(id);

        if (isNaN(idNumerico)) {
            return res.status(400).json({
                error: "O ID da transação deve ser um número válido.",
            });
        }
        const apagar = await transactionService.deleteTransaction(idNumerico);
        if (apagar.length === 0) {
            return res.status(404).json({ error: "Transação não encontrada." });
        }
        res.status(200).json({ message: "Transação apagada com sucesso." });
    } catch (error) {
        console.error("Erro ao apagar transação:", error);
        res.status(500).json({ error: "Erro ao apagar transação." });
    }
    // sua lógica aqui
};

export const listaTransacoes = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.params;
        const idNumerico = Number(usuarioId);
        if (isNaN(idNumerico)) {
            return res
                .status(400)
                .json({ error: "O ID do usuário deve ser um número válido." });
        }
        const transacoesDoUsuario =
            await transactionService.listTransactions(idNumerico);
        res.status(200).json(transacoesDoUsuario);
    } catch (error) {
        console.error("Erro ao listar transações:", error);
        res.status(500).json({ error: "Erro ao listar transações" });
    }
};

export const editarTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const transaction = req.body;
        const idNumerico = Number(id);
        if (isNaN(idNumerico)) {
            return res.status(400).json({
                error: "O ID da transação deve ser um número válido.",
            });
        }
        const editarTransaction = await transactionService.editarTransaction(
            idNumerico,
            transaction,
        );
        if (editarTransaction.length === 0) {
            return res.status(404).json({ error: "Transação não encontrada." });
        }
        res.status(200).json({ message: "Transação editada com sucesso." });
    } catch (error) {
        console.error("Erro ao editar transação:", error);
        res.status(500).json({ error: "Erro ao editar transação." });
    }
};

export const getSaldoTotal = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.params;
        const idNumerico = Number(usuarioId);
        if (isNaN(idNumerico)) {
            return res
                .status(400)
                .json({ error: "O ID do usuário deve ser um número válido." });
        }
        const saldoTotal = await transactionService.getSaldoTotal(idNumerico);
        res.status(200).json(saldoTotal);
    } catch (error) {
        console.error("Erro ao calcular saldo total:", error);
        res.status(500).json({ error: "Erro ao calcular saldo total." });
    }
};
