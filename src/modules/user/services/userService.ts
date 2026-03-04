import { db } from "@/db";
import { usuarios } from "@/db/schema";

await db.insert(usuarios).values({
    nome: "Erickson",
    email: "erickson@email.com",
});
