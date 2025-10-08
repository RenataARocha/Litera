import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Teste: listar todos os usuários
    const users = await prisma.user.findMany();
    console.log(users);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
