import prisma from "@/prisma/client";

interface RegisterStudentRequestBody {
  teacher: string;
  students: string[];
}

export const registerStudentsService = async (
  reqBody: RegisterStudentRequestBody
) => {
  try {
    console.log(reqBody);
    // do db call here

    await prisma.teacher.findFirstOrThrow({
      where: {
        email: reqBody.teacher,
      },
    });

    await prisma.teacher.update({
      where: { email: reqBody.teacher },
      data: {
        students: {
          connect: reqBody.students.map((email) => ({ email })),
        },
      },
    });

    const teachersWithStudents = await prisma.teacher.findFirst({
      where: { email: reqBody.teacher },
      include: {
        students: {
          select: {
            email: true,
          },
        },
      },
    });

    console.log(teachersWithStudents);

    // await prisma.student.findMany

    // console.log("isTeacherExist", isTeacherExist);
    // const users = await prisma.teacher.findMany();

    // console.log("USERS", users);
    return null;
  } catch (error) {
    console.log(error);
  }
};
