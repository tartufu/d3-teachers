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

export const getCommonStudentsService = async (reqBody: any[]) => {
  try {
    console.log("reqBody", reqBody);

    const teachersWithStudents = await prisma.teacher.findMany({
      where: {
        email: {
          in: reqBody,
        },
      },
      include: {
        students: {
          select: {
            email: true,
          },
        },
      },
    });

    const studentEmailLists = teachersWithStudents.map((teacher) =>
      teacher.students.map((student) => student.email)
    );

    console.log(studentEmailLists);

    const commonStudentEmails = studentEmailLists.reduce((a, b) =>
      a.filter((email) => b.includes(email))
    );

    console.log(commonStudentEmails);

    // do db call here

    return commonStudentEmails;
  } catch (error) {
    console.log(error);
  }
};
