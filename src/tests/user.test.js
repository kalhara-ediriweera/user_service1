const request = require("supertest");
const app = require("../app");

// mock User model
jest.mock("../models/User", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));

const User = require("../models/User");

describe("User Service Tests", () => {

  // ✅ Health Check
  describe("GET /health", () => {
    it("should return healthy status", async () => {
      const res = await request(app).get("/health");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe("user-service");
      expect(res.body.status).toBe("healthy");
    });
  });

  // ✅ Register Test
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {

      User.create.mockResolvedValue({
        name: "Alice",
        email: "alice@test.com"
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Alice",
          email: "alice@test.com",
          password: "123456"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe("alice@test.com");
    });
  });

  // ✅ Login Test
  describe("POST /api/auth/login", () => {
    it("should login user and return token", async () => {

      User.findOne.mockResolvedValue({
        _id: "123",
        email: "alice@test.com",
        password: "$2a$10$hashedpassword"
      });

      // mock bcrypt
      const bcrypt = require("bcryptjs");
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "alice@test.com",
          password: "123456"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });

});