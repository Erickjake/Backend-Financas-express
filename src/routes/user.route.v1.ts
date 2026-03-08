import { Router } from "express";
import * as userController from "../modules/user/controllers/v1/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateMiddleware.js";
import { updateUserSchema } from "../db/schema.js";

const router = Router();

/**
 * ROTAS PÚBLICAS
 * Não exigem token de autenticação.
 * Dica: Pode também criar Zod schemas para o Register e Login e aplicá-los aqui!
 */
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);

/**
 * ROTAS PROTEGIDAS
 * O 'authMiddleware' verifica o Token JWT.
 * O 'validateSchema' verifica se os dados enviados estão corretos.
 */

// Listar todos os usuários (GET)
// router.get("/users", authMiddleware, userController.getAllUsers);

// Buscar utilizador por ID (GET)
// router.get("/users/:id", authMiddleware, userController.getUserByIdController);

// Atualizar Utilizador (PUT) - Aqui aplicamos o Zod!
router.put(
    "/:id",
    authMiddleware, // 1º Verifica quem é
    validateSchema(updateUserSchema), // 2º Verifica os dados recebidos
    userController.updateUserController, // 3º Executa a regra de negócio
);

// Apagar Utilizador (DELETE)
router.delete("/:id", authMiddleware, userController.deleteUserController);

// Rota para renovar o Access Token (Pública, pois o Access Token já expirou)
router.post("/refresh-token", userController.refreshTokenController);

// Rota para encerrar a sessão (Pública ou Protegida, remove o token do banco)
router.post("/logout", userController.logoutController);

export default router;
