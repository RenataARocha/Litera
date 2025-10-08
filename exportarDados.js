import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    const books = await prisma.book.findMany();

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
    fs.writeFileSync("books.json", JSON.stringify(books, null, 2));

    console.log("Dados exportados!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
