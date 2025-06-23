import request from "supertest";
import app from "../app";

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
