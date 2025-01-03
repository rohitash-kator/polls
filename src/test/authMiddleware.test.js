const { authMiddleware } = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

jest.mock("../models/User"); // Mock the User model

describe("Auth Middleware", () => {
  let originalEnv;

  beforeAll(() => {
    // Preserve original environment variable values
    originalEnv = process.env.JWT_SECRET;
  });

  afterAll(() => {
    // Restore original environment variable values
    process.env.JWT_SECRET = originalEnv;
  });

  // Helper functions
  const mockResponse = () => {
    const res = {
      message: null,
      statusCode: null,
      status: function (status) {
        this.statusCode = status;
        return this;
      },
      json: function ({ error }) {
        this.message = error;
        return this;
      },
    };
    return res;
  };

  const mockRequest = (token) => ({
    get: () => token,
  });

  test("should return 401 if no token is found", () => {
    const req = mockRequest(null);
    const res = mockResponse();

    authMiddleware(req, res, () => {});

    expect(res.statusCode).toBe(401);
    expect(res.message).toBe("No Authorization header");
  });

  test("should return 401 if no token is provided", () => {
    const req = mockRequest("Bearer ");
    const res = mockResponse();

    authMiddleware(req, res, () => {});

    expect(res.statusCode).toBe(401);
    expect(res.message).toBe("No token provided");
  });

  test("should return 401 if secret/public key is not provided", () => {
    const req = mockRequest(
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzY1YzFlNGQ1NDllNGQyZTU3NzJjZCIsImlhdCI6MTczNTgxOTU3MywiZXhwIjoxNzM1OTA1OTczfQ.pESl43GmWdbAfoomPrfON6ytqUn_O2Fpe3qw6UlBHA"
    );
    const res = mockResponse();

    authMiddleware(req, res, () => {});

    expect(res.statusCode).toBe(401);
    expect(res.message).toBe("secret or public key must be provided");
  });

  test("should return 401 if token has invalid signature", () => {
    const req = mockRequest(
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzY1YzFlNGQ1NDllNGQyZTU3NzJjZCIsImlhdCI6MTczNTgxOTU3MywiZXhwIjoxNzM1OTA1OTczfQ.pESl43GmWdbAfoomPrfON6ytqUn_O2Fpe3qw6UlBHA"
    );
    const res = mockResponse();

    process.env.JWT_SECRET = "secret"; // Mock secret

    authMiddleware(req, res, () => {});

    expect(res.statusCode).toBe(401);
    expect(res.message).toBe("invalid signature");
  });

  test("should return 401 if token is expired", () => {
    const req = mockRequest(
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzY1ZThhNTY5NDBmOWYxMDljMzhhOSIsImlhdCI6MTczNTgzNTAyNywiZXhwIjoxNzM1ODM1MDI4fQ.Y4yr2panuP_s9FGjSeVrzXNsFJxY-ux__U2Y2PqMQXA"
    );
    const res = mockResponse();

    process.env.JWT_SECRET =
      "3274ebe78f35e67d0a1f98086e0cdc7e9b2b4f2714ee6bca95665ab08a12bd32edfc1367b46b4f9e4d2008f0bf1d1e653f1efd6440154a410d73b0741c80361c"; // Mock secret

    authMiddleware(req, res, () => {});

    expect(res.statusCode).toBe(401);
    expect(res.message).toBe("jwt expired");
  });

  test("should return 401 if user is unauthorized", async () => {
    const req = mockRequest(
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzY1ZThhNTY5NDBmOWYxMDljMzhhOSIsImlhdCI6MTczNTgxMDk1MCwiZXhwIjoxNzM1ODk3MzUwfQ.quRB3qRKoY27s8P22nbT4k1UHAraNJm0MdusuBfsxmA"
    );
    const res = mockResponse();

    // Mock User.findById to return null (simulating an unauthorized user)
    const User = require("../models/User");
    User.findById = () => ({
      select: () => null,
    });

    const jwtVerify = jest
      .spyOn(jwt, "verify")
      .mockImplementation(() => ({ id: "677666d262022e7a2c7b5133" }));

    await authMiddleware(req, res, () => {});

    expect(res.statusCode).toBe(401);
    expect(res.message).toBe("Unauthorized");

    jwtVerify.mockRestore(); // Clean up the mock
  });

  test("should proceed if user is found", async () => {
    const req = mockRequest(
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzY1ZThhNTY5NDBmOWYxMDljMzhhOSIsImlhdCI6MTczNTgxMDk1MCwiZXhwIjoxNzM1ODk3MzUwfQ.quRB3qRKoY27s8P22nbT4k1UHAraNJm0MdusuBfsxmA"
    );
    const res = mockResponse();

    // Mock User.findById to return a valid user object (simulating a found user)
    const mockUser = {
      id: "677666d262022e7a2c7b5133",
      name: "Test User",
      email: "testuser@example.com",
    };

    // Mock User.findById to return null (simulating an unauthorized user)
    const User = require("../models/User");
    User.findById = () => ({
      select: () => mockUser,
    });

    const jwtVerify = jest
      .spyOn(jwt, "verify")
      .mockImplementation(() => ({ id: "677666d262022e7a2c7b5133" }));

    await authMiddleware(req, res, () => {});

    expect(req.user).toEqual(mockUser); // Ensure the user is attached to the request
    expect(res.statusCode).toBeNull(); // No error status, so it should not be set
    expect(res.message).toBeNull(); // No error message

    jwtVerify.mockRestore(); // Clean up the mock
  });
});
