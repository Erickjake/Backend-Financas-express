import { openDb } from "../../../data/database";
import { Transaction } from "../../../model/Transaction";

// Transformamos a função em 'async' porque buscar no banco de dados demora alguns milissegundos
export const listarTransacoes = async (usuario: string) => {
    const db = await openDb();
    // SELECT * FROM transacoes -> "Busque tudo na tabela transacoes"
    const transacoes = await db.all(
        "SELECT * FROM transacoes WHERE usuario = ?",
        usuario,
    );
    console.log("🚀 ~ listarTransacoes ~ transacoes:", transacoes);
    return transacoes;
};

// Recebe o objeto completo que veio do req.body
export const criarTransacao = async (transacao: Transaction) => {
    const db = await openDb();

    // ATENÇÃO AQUI: Trocamos 'nome' por 'titulo' no SQL e na variável
    const resultado = await db.run(
        "INSERT INTO transacoes (titulo, valor, tipo, usuario) VALUES (?, ?, ?,?)",
        transacao.titulo,
        transacao.valor,
        transacao.tipo,
        transacao.usuario,
    );

    // Adicionamos o ID gerado pelo banco ao nosso objeto
    transacao.id = resultado.lastID;

    // Criamos a data atual e adicionamos ao objeto
    transacao.date = new Date().toISOString();

    // Retornamos o objeto completo para o Controller
    return transacao;
};

export const calcularSaldoTotal = async (usuario: string) => {
    const db = await openDb();
    const transacoes = await db.all(
        "SELECT * FROM transacoes WHERE usuario = ?",
        usuario,
    );
    let totalReceita = 0;
    let totalDespesa = 0;

    for (const transacao of transacoes) {
        if (transacao.tipo === "receita") {
            totalReceita += transacao.valor;
        } else {
            totalDespesa += transacao.valor;
        }
    }

    const saldoTotal = totalReceita - totalDespesa;
    return {
        receita: totalReceita,
        despesa: totalDespesa,
        saldoTotal: saldoTotal,
    };
};

// Nova função para deletar uma transação pelo ID
export const deletarTransacao = async (id: number) => {
    const db = await openDb();

    // DELETE FROM -> "Apague da tabela transacoes ONDE o id for igual a..."
    await db.run("DELETE FROM transacoes WHERE id = ?", id);

    // Não precisamos retornar nada, se chegou aqui é porque apagou com sucesso!
};
