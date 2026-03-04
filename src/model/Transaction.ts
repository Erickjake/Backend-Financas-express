export type Transaction = {
    id?: number;
    titulo: string;
    valor: number;
    tipo: "despesa" | "receita";
    date?: string;
    usuario: number;
};

export type Transactions = Transaction[];
