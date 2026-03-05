import { Router } from "express";
import {
    userLogin,
    userRegister,
} from "@/modules/user/controllers/userController";

const router = Router();

// Rota para criar conta: POST /users
router.post("/register", userRegister);

// Rota para login: POST /users/login (Mais seguro que GET)
router.post("/login", userLogin);

export default router;
