const User = require("../models/User");

const { isEncrypted } = require("../utils/checkEncryption");
const {
  createUser,
  findUserByEmail,
  findUserById,
  findAll,
  deleteUserById,
  upgradeUser,
  downgradeUser,
} = require("../services/user.service");

jest.mock("../models/User");
jest.mock("../utils/checkEncryption");

const DUMMY_USER = {
  firstName: "Test",
  lastName: "User",
  email: "test@test.com",
  password: "encryptedPassword",
};

describe("User Service", () => {
  beforeEach(() => {
    // Reset mocks before each test
    User.mockClear();
    isEncrypted.mockClear();
  });

  test("should throw error if password is not encrypted while creating new user", async () => {
    isEncrypted.mockReturnValue(false);

    await expect(
      createUser("Test", "User", "test@test.com", "plainPassword")
    ).rejects.toThrow("Password must be encrypted before saving");
  });

  test("should throw an error if failed to save user", async () => {
    isEncrypted.mockReturnValue(true);

    User.mockImplementation(() => ({
      ...DUMMY_USER,
      save: jest.fn().mockRejectedValue(new Error("Database error")),
    }));

    await expect(
      createUser("Test", "User", "test@test.com", "encryptedPassword")
    ).rejects.toThrow("Database error");
  });

  test("should create user if password encrypted and no database error", async () => {
    isEncrypted.mockReturnValue(true);
    User.mockImplementation(() => ({
      ...DUMMY_USER,
      _id: "67765c1e4d549e4d2e5772cd",
      save: jest.fn().mockResolvedValue(true),
    }));

    const user = await createUser(
      "Test",
      "User",
      "test@test.com",
      "encryptedPassword"
    );

    expect(user._id).toBeDefined();
    expect(user._id).toBe("67765c1e4d549e4d2e5772cd");
  });

  test("should throw error if a non Admin user tries to upgrade a user", async () => {
    await expect(
      upgradeUser("67765c1e4d549e4d2e5772cd", { role: "User" })
    ).rejects.toThrow("You are not authorized to perform this action");
  });

  test("should throw error if user to be upgraded doesn't exists", async () => {
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue(null),
    });

    await expect(
      upgradeUser("67765c1e4d549e4d2e5772cd", { role: "Admin" })
    ).rejects.toThrow("User not found");
  });

  test("should to upgrade a user", async () => {
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        ...DUMMY_USER,
        save: jest.fn().mockReturnValue(null),
      }),
    });

    await expect(
      upgradeUser("67765c1e4d549e4d2e5772cd", { role: "Admin" })
    ).resolves.toBeUndefined();
  });

  test("should throw error if your downgrade themselves", async () => {
    await expect(
      downgradeUser("67765c1e4d549e4d2e5772cd", {
        _id: "67765c1e4d549e4d2e5772cd",
      })
    ).rejects.toThrow("You cannot downgrade yourself");
  });

  test("should throw error if non-admin downgrade a user", async () => {
    await expect(
      downgradeUser("67765c1e4d549e4d2e5772cd", {
        _id: "67765c1e4d549e4d2e5772ce",
        role: "User",
      })
    ).rejects.toThrow("You are not authorized to perform this action");
  });

  test("should throw error if user not found which to be downgraded", async () => {
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue(null),
    });

    await expect(
      downgradeUser("67765c1e4d549e4d2e5772cd", {
        _id: "67765c1e4d549e4d2e5772ce",
        role: "Admin",
      })
    ).rejects.toThrow("User not found");
  });

  test("should downgrade a user if everything goes fine", async () => {
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        ...DUMMY_USER,
        save: jest.fn().mockReturnValue(null),
      }),
    });

    await expect(
      downgradeUser("67765c1e4d549e4d2e5772cd", {
        _id: "67765c1e4d549e4d2e5772ce",
        role: "Admin",
      })
    ).resolves.toBeUndefined();
  });
});
