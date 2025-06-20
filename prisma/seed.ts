import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();

  await prisma.teacher.createMany({
    data: [
      { name: "Alice Tan", email: "alice.tan@email.com" },
      { name: "Ben Lee", email: "ben.lee@email.com" },
      { name: "Catherine Goh", email: "catherine.goh@email.com" },
      { name: "Daniel Ng", email: "daniel.ng@email.com" },
      { name: "Emily Lim", email: "emily.lim@email.com" },
    ],
  });

  await prisma.student.createMany({
    data: [
      { name: "Liam Ong", email: "liam.ong@email.com" },
      { name: "Emma Koh", email: "emma.koh@email.com" },
      { name: "Noah Teo", email: "noah.teo@email.com" },
      { name: "Olivia Chia", email: "olivia.chia@email.com" },
      { name: "Aiden Sim", email: "aiden.sim@email.com" },
      { name: "Sophia Chan", email: "sophia.chan@email.com" },
      { name: "Ethan Tay", email: "ethan.tay@email.com" },
      { name: "Isabella Quek", email: "isabella.quek@email.com" },
      { name: "Lucas Goh", email: "lucas.goh@email.com" },
      { name: "Mia Tan", email: "mia.tan@email.com" },
      { name: "James Liew", email: "james.liew@email.com" },
      { name: "Charlotte Ng", email: "charlotte.ng@email.com" },
      { name: "Alexander Lim", email: "alexander.lim@email.com" },
      { name: "Amelia Seah", email: "amelia.seah@email.com" },
      { name: "Logan Toh", email: "logan.toh@email.com" },
      { name: "Grace Yeo", email: "grace.yeo@email.com" },
      { name: "Jacob Chua", email: "jacob.chua@email.com" },
      { name: "Chloe Phua", email: "chloe.phua@email.com" },
      { name: "Mason Fong", email: "mason.fong@email.com" },
      { name: "Harper Yip", email: "harper.yip@email.com" },
    ],
  });

  console.log("🌱 Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
