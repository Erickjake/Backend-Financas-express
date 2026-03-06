import { Router } from "express";
import * as userController from "../modules/user/controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * ROTAS PÚBLICAS
 * Não exigem token de autenticação.
 */
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);

/**
 * ROTAS PROTEGIDAS
 * O 'authMiddleware' verifica o Token JWT antes de chegar ao Controller.
 */

// Listar todos os usuários e buscar por ID
// router.get("/users", authMiddleware, userController.); // Lembra-te de criar este no controller!
// router.get("/users/:id", authMiddleware, userController);

// Atualizar e Apagar (Operações sensíveis)
router.put("/users/:id", authMiddleware, userController.updateUserController);
router.delete(
    "/users/:id",
    authMiddleware,
    userController.deleteUserController,
);

export default router;
