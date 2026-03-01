import sqlite3 from "sqlite3";
import { open } from "sqlite";

// 1. Função que abre a "porta" do nosso banco de dados
export async function openDb() {
    return open({
        filename: "./financas.db", // O nome do arquivo que será criado na sua pasta
        driver: sqlite3.Database,
    });
}

// 2. Função que cria a tabela (a nossa "planilha") caso ela não exista
export async function initDb() {
    const db = await openDb();

    // ATENÇÃO: Repare que não há vírgula no final da linha do "usuario"
    await db.exec(`
        CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            valor REAL NOT NULL,
            tipo TEXT NOT NULL,
            usuario TEXT NOT NULL 
        )
    `);

    console.log("📦 Banco de dados SQLite inicializado com sucesso!");
}
