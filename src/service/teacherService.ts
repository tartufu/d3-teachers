import prisma from "@/libs/prisma";
import { generateErrorObj } from "@/utils/error";
import {
  combinedStudentEmailsWithoutDupes,
  getMentionedStudents,
} from "@/utils/strings";

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
    throw error;
  }
};

export const retrieveNotificationsService = async (
  reqBody: RetrieveNotificationsRequestBody
) => {
  try {
    const studentsEmails = await prisma.teacher
      .findFirstOrThrow({
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
      })
      .then((teacherRecord) =>
        teacherRecord.students.map((student) => student.email)
      );

    const mentionedStudentEmails = getMentionedStudents(
      reqBody.notification.split(" ")
    );

    // const studentsEmails = query.students.map((student) => student.email);

    return {
      recipients: combinedStudentEmailsWithoutDupes(
        mentionedStudentEmails,
        studentsEmails
      ),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
