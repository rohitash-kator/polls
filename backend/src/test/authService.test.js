const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { signup, login } = require("../services/auth.service");
const userService = require("../services/user.service");

jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

jest.mock("../models/User");
jest.mock("../services/user.service");

const DUMMY_USER = {
  _id: "67765e8a56940f9f109c38a9",
  firstName: "Test",
  lastName: "User",
  email: "test@test.com",
  role: "User",
  password: "fakePassword",
};

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test case
  });

  test("should throw 'User already exists' error with status code 400", async () => {
    // Mock findUserByEmail to simulate an existing user
    userService.findUserByEmail.mockResolvedValue(DUMMY_USER);

    // Expect signup to throw 'User already exists' error
    await expect(
      signup("Test", "User", "test@test.com", "213456")
    ).rejects.toThrow("User already exists");
  });

  test("should create a new user and return a JWT token", async () => {
    // Mock findUserByEmail to simulate no existing user
    userService.findUserByEmail.mockResolvedValue(null);

    // Mock createUser to simulate user creation
    userService.createUser.mockResolvedValue(DUMMY_USER);

    // Mock jwt.sign to return a fake JWT token
    jwt.sign.mockResolvedValue("fake-jwt-token");

    // Call signup and check if JWT token is returned
    await expect(
      signup("Test", "User", "test@test.com", "213456")
    ).resolves.toBe("fake-jwt-token");
  });

  test("should throw error User not found with status code 404 while login", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(login("test@test.com", "fakePassword")).rejects.toThrow(
      "User not found"
    );
  });

  test("should throw error Invalid password if invalid password entered", async () => {
    User.findOne.mockResolvedValue(DUMMY_USER);
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      login("test@test.com", "invalidPassword")
    ).rejects.toThrow("Invalid password");
  });

  test("should return a valid token if user provides correct login info", async () => {
    User.findOne.mockResolvedValue(DUMMY_USER);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockResolvedValue("fake-jwt-token");

    await expect(login("test@test.com", "invalidPassword")).resolves.toBe(
      "fake-jwt-token"
    );
  });
});
