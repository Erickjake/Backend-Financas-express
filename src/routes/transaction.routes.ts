// Arquivo: src/routes/transaction.routes.ts

import { Router } from "express";
import {
    createTransaction,
    deleteTransacao,
    editarTransaction,
    getSaldoTotal,
    listaTransacoes,
} from "../modules/transaction/Controllers/transactionController.js"; // <-- O .js é obrigatório aqui!

// ... resto do seu códigoaqui!

const router = Router();

router.post("/", createTransaction);
router.get("/:usuarioId", listaTransacoes);
router.delete("/:id", deleteTransacao);
router.put("/:id", editarTransaction);
router.get("/saldo/:usuarioId", getSaldoTotal);
// router.get("/saldo", getSaldoTotal);
// router.delete("/:id", deleteTransacao);
// console.log(deleteTransacao);

export default router;
