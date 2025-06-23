import { generateErrorObj } from "./error";

describe("should generate", () => {
  it("404 error obj", () => {
    const errObj = generateErrorObj("sdfsdfsdf", 404);
    expect(errObj).toBeInstanceOf(Error);
    expect(errObj.message).toBe("sdfsdfsdf");
    expect((errObj as any).status).toBe(404);
  });
});
