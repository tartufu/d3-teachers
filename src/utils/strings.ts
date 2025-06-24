export const getMentionedStudents = (students: string[]) => {
  let mentionedStudentEmails = students.filter((student) =>
    student.startsWith("@")
  );

  mentionedStudentEmails = mentionedStudentEmails.map((studentEmail) =>
    studentEmail.substring(1)
  );

  return mentionedStudentEmails;
};

export const combinedStudentEmailsWithoutDupes = (
  mentionedStudents: string[],
  studentsLinkedToTeacher: string[]
) => {
  const combinedStudentEmails = [
    ...mentionedStudents,
    ...studentsLinkedToTeacher,
  ];

  const combinedStudentEmailsWithoutDuplicates = new Set(combinedStudentEmails);

  return [...combinedStudentEmailsWithoutDuplicates];
};
