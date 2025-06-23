import prisma from "@/prisma/client";
import { generateErrorObj } from "@/utils/error";

interface RegisterStudentRequestBody {
  teacher: string;
  students: string[];
}

interface SuspendStudentRequestBody {
  student: string;
}

interface RetrieveNotificationsRequestBody {
  teacher: string;
  notification: string;
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

    return null;
  } catch (error: any) {
    if (error.code === "P2025") {
      throw generateErrorObj("Teacher not found", 404);
    }
    throw error;
  }
};

export const getCommonStudentsService = async (reqBody: any[]) => {
  try {
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

    const commonStudentEmails = studentEmailLists.reduce((a, b) =>
      a.filter((email) => b.includes(email))
    );

    console.log(commonStudentEmails);

    return {
      students: commonStudentEmails,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const suspendStudentService = async (
  reqBody: SuspendStudentRequestBody
) => {
  try {
    await prisma.student.findUniqueOrThrow({
      where: { email: reqBody.student },
    });

    await prisma.student.update({
      where: { email: reqBody.student },
      data: { isSuspended: true },
    });

    return null;
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2025") {
      throw generateErrorObj("Student not found", 404);
    }
  }
};

export const retrieveNotificationsService = async (
  reqBody: RetrieveNotificationsRequestBody
) => {
  try {
    const query = await prisma.teacher.findFirstOrThrow({
      where: {
        email: reqBody.teacher,
      },
      include: {
        students: {
          select: {
            email: true,
          },
          where: {
            isSuspended: false,
          },
        },
      },
    });

    // refactor this into an util

    const splitNotifications = reqBody.notification.split(" ");
    const mentionedStudentEmails = splitNotifications.filter((string) =>
      string.startsWith("@")
    );

    console.log("splitNotifications", splitNotifications);
    console.log("mentionedStudentEmails", mentionedStudentEmails);

    const studentsEmails = query.students.map((student) => student.email);

    const combinedStudentEmails = [
      ...studentsEmails,
      ...mentionedStudentEmails,
    ];

    const combinedStudentEmailsWithoutDuplicates = new Set(
      combinedStudentEmails
    );

    return {
      recipients: [...combinedStudentEmailsWithoutDuplicates],
    };
  } catch (error) {
    console.log(error);
  }
};
