const request = require("supertest");
const app = require("../../server");

describe("GET /", () => {
  it("responds with 200 and backend message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("PlaceMentor AI Backend Running");
  });
});
