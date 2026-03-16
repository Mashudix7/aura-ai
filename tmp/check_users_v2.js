const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, subscription_tier: true, promptCount: true, lastPromptDate: true }
    });
    fs.writeFileSync("tmp/users_validated.json", JSON.stringify(users, null, 2), "utf-8");
    console.log("Written to tmp/users_validated.json");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
