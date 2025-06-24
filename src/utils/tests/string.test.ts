import {
  getMentionedStudents,
  combinedStudentEmailsWithoutDupes,
} from "../strings";

describe("getMentionedStudents Func", () => {
  it("should return empty array if string arr has no @", () => {
    expect(getMentionedStudents(["hello", "world"])).toStrictEqual([]);
  });

  it("should return array of student emails if string arr has @", () => {
    expect(
      getMentionedStudents(["@student.com", "@student1.com"])
    ).toStrictEqual(["student.com", "student1.com"]);
  });

  it("should return only array of student emails if string arr has @ and non @", () => {
    expect(
      getMentionedStudents(["Hello", "@student.com", "@student1.com"])
    ).toStrictEqual(["student.com", "student1.com"]);
  });
});

describe("combinedStudentEmailsWithoutDupes Func", () => {
  it("should return unique combined student emails email", () => {
    expect(
      combinedStudentEmailsWithoutDupes(["hello", "world"], ["students"])
    ).toStrictEqual(["hello", "world", "students"]);
  });

  it("should return unique combined student emails email even if there is duplicates", () => {
    expect(
      combinedStudentEmailsWithoutDupes(
        ["hello", "world"],
        ["students", "hello"]
      )
    ).toStrictEqual(["hello", "world", "students"]);
  });

  it("should return empty array if 2 empty arrays are given", () => {
    expect(combinedStudentEmailsWithoutDupes([], [])).toStrictEqual([]);
  });
});
