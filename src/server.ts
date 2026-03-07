import express from "express";
import { initDb } from "./db/database.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import transactionRoutes from "./routes/transaction.routes.v1.js";
import userRoutes from "./routes/user.route.v1.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use(loggerMiddleware);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/v1/transacoes", transactionRoutes);
app.use("/api/v1/users", userRoutes);
const port = 3001;

app.use(errorMiddleware);
// Iniciamos o banco de dados
initDb()
    .then(() => {
        // Se der tudo certo no banco, liga o servidor
        app.listen(port, () => {
            console.log("🚀 Servidor rodando na porta 3001");
        });
    })
    .catch((erro) => {
        // Se o banco der erro, mostre essa mensagem com o erro exato
        console.error("❌ Erro ao inicializar o banco de dados:", erro);
    });
