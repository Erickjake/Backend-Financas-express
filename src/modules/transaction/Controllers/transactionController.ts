import { Request, Response } from "express";
import * as transactionService from "../services/transactionService.js";
import { insertTransacaoSchema } from "@/db/schema.js";
import z from "zod";

// Esquema simples para validar IDs que vêm na URL
const idParamSchema = z.coerce.number().int().positive();

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const usuarioId = idParamSchema.parse(Number(req.query.usuarioId));
        const transaction = insertTransacaoSchema.parse(req.body);
        await transactionService.createTransaction({
            ...transaction,
            usuarioId,
        });
        res.status(201).json({ message: "Transação criada com sucesso" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Dados inválidos",
                details: error.flatten().fieldErrors,
            });
        }
        res.status(500).json({ error: "Erro interno ao criar transação" });
    }
};

// No arquivo transactionController.ts
export const deleteTransacao = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idNumerico = idParamSchema.parse(Number(id));

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
        const idNumerico = idParamSchema.parse(Number(usuarioId));
        if (isNaN(idNumerico)) {
            return res
                .status(400)
                .json({ error: "O ID do usuário deve ser um número válido." });
        }
        const transacoesDoUsuario =
            await transactionService.listTransactions(idNumerico);
        res.status(200).json(transacoesDoUsuario);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Dados inválidos",
                details: error.flatten().fieldErrors,
            });
        }
        console.error("Erro ao listar transações:", error);
        res.status(500).json({ error: "Erro ao listar transações" });
    }
};

export const editarTransaction = async (req: Request, res: Response) => {
    try {
        const id = idParamSchema.parse(Number(req.params.id));

        const updateSchema = insertTransacaoSchema.partial();
        const transaction = updateSchema.parse(req.body);

        const resultado = await transactionService.editarTransaction(
            id,
            transaction,
        );
        if (resultado.length === 0) {
            return res.status(404).json({ error: "Transação não encontrada." });
        }
        res.status(200).json({ message: "Transação atualizada com sucesso." });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "ID ou dados inválidos" });
        }
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
