import request from "supertest";
import app from "../app";
import prisma from "../libs/__mocks__/prisma";

vi.mock("../libs/prisma");

describe("GET /ping 404 path", () => {
  it("responds with pong", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      details: "Route does not exist",
      error: "Not Found",
    });
  });
});

describe("POST /register", () => {
  it("should return 400 error if request body does not match register student schema", async () => {
    const res = await request(app).post("/api/register").send({
      foo: 123,
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid data",
      details: [
        {
          message: "teacher is Required",
        },
        {
          message: "students is Required",
        },
      ],
    });
  });

  it("should return 400 error if request body partially match register student schema", async () => {
    const res = await request(app).post("/api/register").send({
      teacher: "12344",
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid data",
      details: [
        {
          message: "students is Required",
        },
      ],
    });
  });

  it("should return 400 error if request body match register student schema, but wrong type given", async () => {
    const res = await request(app).post("/api/register").send({
      teacher: 12344,
      students: "455",
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid data",
      details: [
        {
          message: "teacher is Expected string, received number",
        },
        {
          message: "students is Expected array, received string",
        },
      ],
    });
  });

  it("should return 404 error if unable to find teacher in db", async () => {
    const error = new Error("There was an error.") as Error & { code: string };
    error.code = "P2025";

    prisma.teacher.findFirstOrThrow.mockImplementation(() => {
      throw error;
    });
    const res = await request(app)
      .post("/api/register")
      .send({
        teacher: "12344",
        students: ["455"],
      });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "Not Found",
      details: "Teacher not found",
    });
  });

  it("should return 204 response if able to find and register student", async () => {
    prisma.teacher.findFirstOrThrow.mockResolvedValue({
      id: "123",
      email: "123",
      name: "123",
    });

    prisma.teacher.update.mockResolvedValue({
      id: "123",
      email: "123",
      name: "123",
    });

    const res = await request(app)
      .post("/api/register")
      .send({
        teacher: "12344",
        students: ["455"],
      });

    expect(res.status).toBe(204);
  });

  it("should return 500 error as a catch all error", async () => {
    const error = new Error("There was an error.");

    prisma.teacher.findFirstOrThrow.mockImplementation(() => {
      throw error;
    });

    const res = await request(app)
      .post("/api/register")
      .send({
        teacher: "12344",
        students: ["455"],
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      details: "There was an error.",
      error: "Internal Server Error",
    });
  });
});

describe("GET /commonstudents", () => {
  it("should return 400 error if request query does not match common student schema", async () => {
    const res = await request(app).get("/api/commonstudents");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid query parameters",
      issues: [
        {
          code: "invalid_union",
          message: "Invalid input",
          path: ["teacher"],
          unionErrors: [
            {
              issues: [
                {
                  code: "invalid_type",
                  expected: "string",
                  message: "Required",
                  path: ["teacher"],
                  received: "undefined",
                },
              ],
              name: "ZodError",
            },
            {
              issues: [
                {
                  code: "invalid_type",
                  expected: "array",
                  message: "Required",
                  path: ["teacher"],
                  received: "undefined",
                },
              ],
              name: "ZodError",
            },
          ],
        },
      ],
    });
  });

  it("should return 400 error if request query does not properly match common student schema", async () => {
    const res = await request(app).get("/api/commonstudents?student=123");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid query parameters",
      issues: [
        {
          code: "invalid_union",
          message: "Invalid input",
          path: ["teacher"],
          unionErrors: [
            {
              issues: [
                {
                  code: "invalid_type",
                  expected: "string",
                  message: "Required",
                  path: ["teacher"],
                  received: "undefined",
                },
              ],
              name: "ZodError",
            },
            {
              issues: [
                {
                  code: "invalid_type",
                  expected: "array",
                  message: "Required",
                  path: ["teacher"],
                  received: "undefined",
                },
              ],
              name: "ZodError",
            },
          ],
        },
      ],
    });
  });

  it("should return 200 response if able to find common students for one teacher", async () => {
    prisma.teacher.findMany.mockResolvedValue([
      {
        id: "123",
        email: "foo",
        name: "teacherOne",
        students: [
          {
            email: "234",
          },
        ],
      },
    ] as any);

    const res = await request(app).get(
      "/api/commonstudents?teacher=ben.lee%40email.com"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      students: ["234"],
    });
  });

  it("should return 200 response if able to find common students for two teachers without duplicates", async () => {
    prisma.teacher.findMany.mockResolvedValue([
      {
        id: "123",
        email: "foo",
        name: "teacherOne",
        students: [
          {
            email: "234",
          },
          {
            email: "555",
          },
        ],
      },
      {
        id: "456",
        email: "bar",
        name: "teacherTwo",
        students: [
          {
            email: "234",
          },
          {
            email: "789",
          },
        ],
      },
    ] as any);

    const res = await request(app).get(
      "/api/commonstudents?teacher=ben.lee%40email.com&teacher=anette.tang%40email.com"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      students: ["234"],
    });
  });

  it("should return 500 error as a catch all error", async () => {
    const error = new Error("There was an error.");

    prisma.teacher.findMany.mockImplementation(() => {
      throw error;
    });

    const res = await request(app).get(
      "/api/commonstudents?teacher=ben.lee%40email.com"
    );

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      details: "There was an error.",
      error: "Internal Server Error",
    });
  });
});

describe("POST /suspend", () => {
  it("should return 400 error if request body does not match schema", async () => {
    const res = await request(app).post("/api/suspend").send({
      foo: 123,
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid data",
      details: [
        {
          message: "student is Required",
        },
      ],
    });
  });

  it("should return 404 error if unable to find student in db", async () => {
    const error = new Error("There was an error.") as Error & { code: string };
    error.code = "P2025";

    prisma.student.findUniqueOrThrow.mockImplementation(() => {
      throw error;
    });
    const res = await request(app).post("/api/suspend").send({
      student: "12343",
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "Not Found",
      details: "Student not found",
    });
  });

  it("should return 204 response if able to find and suspend student", async () => {
    prisma.student.findUniqueOrThrow.mockResolvedValue({
      id: "123",
      email: "123",
      name: "123",
      isSuspended: false,
    });

    prisma.student.update.mockResolvedValue({
      id: "123",
      email: "123",
      name: "123",
      isSuspended: true,
    });

    const res = await request(app).post("/api/suspend").send({
      student: "12343",
    });

    expect(res.status).toBe(204);
  });

  it("should return 500 error as a catch all error", async () => {
    const error = new Error("There was an error.");

    prisma.student.findUniqueOrThrow.mockImplementation(() => {
      throw error;
    });

    const res = await request(app).post("/api/suspend").send({
      student: "12343",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      details: "There was an error.",
      error: "Internal Server Error",
    });
  });
});

describe("POST /retrievefornotifications", () => {
  it("should return 400 error if request body does not match retrieve notifications schema", async () => {
    const res = await request(app).post("/api/retrievefornotifications").send({
      foo: 123,
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid data",
      details: [
        {
          message: "teacher is Required",
        },
        {
          message: "notification is Required",
        },
      ],
    });
  });

  it("should return 400 error if request body partially match register student schema", async () => {
    const res = await request(app).post("/api/retrievefornotifications").send({
      teacher: "12344",
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid data",
      details: [
        {
          message: "notification is Required",
        },
      ],
    });
  });

  it("should return 400 error if request body match register student schema, but wrong type given", async () => {
    const res = await request(app).post("/api/retrievefornotifications").send({
      teacher: 12344,
      notification: 123,
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid data",
      details: [
        {
          message: "teacher is Expected string, received number",
        },
        {
          message: "notification is Expected string, received number",
        },
      ],
    });
  });

  it("should return 404 error if unable to find teacher in db", async () => {
    const error = new Error("There was an error.") as Error & { code: string };
    error.code = "P2025";

    prisma.teacher.findFirstOrThrow.mockImplementation(() => {
      throw error;
    });

    const res = await request(app).post("/api/retrievefornotifications").send({
      teacher: "12344",
      notification: "123",
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "Not Found",
      details: "Teacher not found",
    });
  });

  it("should return 200 response if able to find and retrieve notifications", async () => {
    prisma.teacher.findFirstOrThrow.mockResolvedValue({
      id: "123",
      email: "123",
      name: "123",
      students: [
        {
          email: "123444",
        },
        {
          email: "567567",
        },
      ],
    } as any);

    const res = await request(app).post("/api/retrievefornotifications").send({
      teacher: "12344",
      notification: "Hey everybody @jacob.chua@email.com @chloe.phua@email.com",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      recipients: [
        "jacob.chua@email.com",
        "chloe.phua@email.com",
        "123444",
        "567567",
      ],
    });
  });

  it("should return 500 error as a catch all error", async () => {
    const error = new Error("There was an error.");

    prisma.teacher.findFirstOrThrow.mockImplementation(() => {
      throw error;
    });

    const res = await request(app).post("/api/retrievefornotifications").send({
      teacher: "12344",
      notification: "123",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      details: "There was an error.",
      error: "Internal Server Error",
    });
  });
});
