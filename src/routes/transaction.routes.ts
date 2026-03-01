import { Router } from "express";
import {
    deleteTransacao,
    getSaldoTotal,
    getTransacao,
    postTransacao,
} from "../modules/transaction/Controllers/transactionController";

const router = Router();

router.get("/", getTransacao);
router.post("/", postTransacao);

router.get("/saldo", getSaldoTotal);
router.delete("/:id", deleteTransacao);
console.log(deleteTransacao);

export default router;
