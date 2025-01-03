const { signup } = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

jest.mock("jsonwebtoken");
jest.mock("../services/user.service");

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test case
  });

  test("should throw 'User already exists' error with status code 400", async () => {
    // Mock findUserByEmail to simulate an existing user
    userService.findUserByEmail.mockResolvedValue({
      firstName: "Test",
      lastName: "User",
      email: "test@test.com",
      role: "User",
    });

    // Expect signup to throw 'User already exists' error
    await expect(
      signup("Test", "User", "test@test.com", "213456")
    ).rejects.toThrowError("User already exists");
  });

  test("should create a new user and return a JWT token", async () => {
    // Mock findUserByEmail to simulate no existing user
    userService.findUserByEmail.mockResolvedValue(null);

    // Mock createUser to simulate user creation
    userService.createUser.mockResolvedValue({
      _id: "67765e8a56940f9f109c38a9",
      firstName: "Test",
      lastName: "User",
      email: "test@test.com",
      role: "User",
    });

    // Mock jwt.sign to return a fake JWT token
    jwt.sign.mockResolvedValue("fake-jwt-token");

    // Call signup and check if JWT token is returned
    const token = await signup("Test", "User", "test@test.com", "213456");
    expect(token).toBe("fake-jwt-token");
  });
});
