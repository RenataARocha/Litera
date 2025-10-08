import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
    // Lê os arquivos JSON
    const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
    const books = JSON.parse(fs.readFileSync("books.json", "utf-8"));

    // Insere usuários
    for (const user of users) {
        await prisma.user.create({ data: user });
    }

    // Insere livros
    for (const book of books) {
        await prisma.book.create({ data: book });
    }

    console.log("Dados importados com sucesso!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
