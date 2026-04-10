const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const connectDB = require("../../config/db");
const app = require("../../server");

describe("POST /api/auth", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    process.env.JWT_SECRET = "test-jwt-secret-for-api-tests";
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    if (mongoServer) await mongoServer.stop();
  });

  describe("register", () => {
    it("creates a user with 201", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/successful/i);
    });

    it("returns 409 when email already exists", async () => {
      await request(app).post("/api/auth/register").send({
        name: "A",
        email: "dup@example.com",
        password: "password123",
      });
      const res = await request(app).post("/api/auth/register").send({
        name: "B",
        email: "dup@example.com",
        password: "password123",
      });
      expect(res.status).toBe(409);
    });

    it("returns 400 when fields are missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "only@example.com",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("login", () => {
    beforeAll(async () => {
      await request(app).post("/api/auth/register").send({
        name: "Login User",
        email: "login@example.com",
        password: "secret12345",
      });
    });

    it("returns token and user on valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "secret12345",
      });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("login@example.com");
      expect(res.body.user.password).toBeUndefined();
    });

    it("returns 401 for wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "wrongpassword",
      });
      expect(res.status).toBe(401);
    });
  });
});
