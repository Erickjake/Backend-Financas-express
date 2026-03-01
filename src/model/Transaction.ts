export type Transaction = {
    id?: number;
    titulo: string;
    valor: number;
    tipo: "despesa" | "receita";
    date?: string;
    usuario: string;
};

export type Transactions = Transaction[];
