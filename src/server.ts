import express from "express";
import { initDb } from "./db/database.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import transactionRoutes from "./routes/transaction.routes.v1.js";
import userRoutes from "./routes/user.route.v1.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import dotenv from "dotenv";
import { cleanExpiredTokens } from "./utils/cleanUp.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

// ... seus imports

const app = express();

// 1. Configurações Globais e Segurança
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
app.use(express.json());
app.use(cookieParser()); // Movi para cima das rotas!
app.use(loggerMiddleware);

// 2. Rotas
app.get("/", (req, res) => res.send("API Ativa 🚀"));
app.use("/api/v1/transacoes", transactionRoutes);
app.use("/api/v1/users", userRoutes);

// 3. Middlewares de Erro (Sempre por último)
app.use(errorMiddleware);

const port = process.env.PORT || 3001;

// 4. Inicialização do Banco e Servidor
initDb()
    .then(async () => {
        console.log("✅ Banco de dados inicializado");

        // Limpeza inicial de tokens expirados (Opcional, mas recomendado)
        try {
            await cleanExpiredTokens();
            console.log("🧹 Tokens expirados limpos com sucesso");
        } catch (e) {
            console.error("Erro na limpeza de tokens:", e);
        }

        app.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
        });
    })
    .catch((erro) => {
        console.error("❌ Erro ao inicializar o banco de dados:", erro);
    });
