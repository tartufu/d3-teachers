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
