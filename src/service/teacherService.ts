import prisma from "@/prisma/client";

export const tempService = async () => {
  // do db call here
  const users = await prisma.user.findMany();

  console.log("USERS", users);
  return null;
};
