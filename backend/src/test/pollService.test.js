const Poll = require("../models/Poll");
const Question = require("../models/Question");
const Option = require("../models/Option");
const PollSubmission = require("../models/PollSubmission");

const {
  createPoll,
  getPollById,
  closePoll,
  submitPoll,
  getPollResult,
} = require("../services/poll.service");

jest.mock("../models/Poll");
jest.mock("../models/Question");
jest.mock("../models/Option");
jest.mock("../models/PollSubmission");

const DUMMY_USER = {
  _id: "67765c1e4d549e4d2e5772cd",
  firstName: "Test",
  lastName: "User",
  email: "test@test.com",
  password: "encryptedPassword",
  role: "User",
};

const DUMMY_POLL = {
  title: "Lifestyle Preferences",
  expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
  questions: [
    {
      isRequired: true,
      question: "Which season do you enjoy the most?",
      options: ["Spring", "Summer", "Fall", "Winter"],
    },
  ],
};

const FAKE_POLL_RESPONSE = {
  _id: "677666d262022e7a2c7b5133",
  title: "Test Poll",
  totalSubmissions: 3,
  questions: [
    {
      isRequired: false,
      _id: "677666d262022e7a2c7b5134",
      question: "What is your favorite type of music?",
      options: [
        {
          _id: "677666d262022e7a2c7b5135",
          option: "Rock",
          createdAt: "2025-01-02T10:13:38.573Z",
          updatedAt: "2025-01-02T10:13:38.573Z",
          __v: 0,
        },
        {
          _id: "677666d262022e7a2c7b5138",
          option: "Pop",
          createdAt: "2025-01-02T10:13:38.964Z",
          updatedAt: "2025-01-02T10:13:38.964Z",
          __v: 0,
        },
        {
          _id: "677666d362022e7a2c7b513b",
          option: "Classical",
          createdAt: "2025-01-02T10:13:39.211Z",
          updatedAt: "2025-01-02T10:13:39.211Z",
          __v: 0,
        },
        {
          _id: "677666d362022e7a2c7b513e",
          option: "Hip Hop",
          createdAt: "2025-01-02T10:13:39.512Z",
          updatedAt: "2025-01-02T10:13:39.512Z",
          __v: 0,
        },
        {
          _id: "677666d362022e7a2c7b5141",
          option: "Jazz",
          createdAt: "2025-01-02T10:13:39.590Z",
          updatedAt: "2025-01-02T10:13:39.590Z",
          __v: 0,
        },
      ],
      createdAt: "2025-01-02T10:13:39.659Z",
      updatedAt: "2025-01-02T10:13:39.659Z",
      __v: 0,
    },
  ],
  expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
  isActive: true,
  createdBy: {
    _id: "67765e8a56940f9f109c38a9",
    firstName: "Rohitash",
    lastName: "Kator",
  },
  createdAt: "2025-01-02T10:13:41.582Z",
  updatedAt: "2025-01-02T11:23:57.166Z",
  __v: 0,
  closedAt: null,
  closedBy: null,
};

const FAKE_POLL_ANSWERS = [
  {
    questionId: "677666d262022e7a2c7b5134",
    optionId: "677666d262022e7a2c7b5138",
  },
  {
    questionId: "677666d362022e7a2c7b5146",
    optionId: "677666d362022e7a2c7b5147",
  },
];

const FAKE_POLL_SUBMISSIONS = [
  {
    _id: "67767fd435722c02dd112c1f",
    pollId: "677666d262022e7a2c7b5133",
    userId: "67765e8a56940f9f109c38a9",
    answers: [
      {
        questionId: "677666d262022e7a2c7b5134",
        optionId: "677666d262022e7a2c7b5138",
        _id: "67767fd435722c02dd112c20",
      },
      {
        questionId: "677666d362022e7a2c7b5146",
        optionId: "677666d362022e7a2c7b5147",
        _id: "67767fd435722c02dd112c21",
      },
      {
        questionId: "677666d462022e7a2c7b5155",
        optionId: "677666d462022e7a2c7b5159",
        _id: "67767fd435722c02dd112c22",
      },
      {
        questionId: "677666d462022e7a2c7b516a",
        optionId: "677666d562022e7a2c7b5171",
        _id: "67767fd435722c02dd112c23",
      },
      {
        questionId: "677666d562022e7a2c7b517c",
        optionId: "677666d562022e7a2c7b5183",
        _id: "67767fd435722c02dd112c24",
      },
    ],
    submittedAt: "2025-01-02T12:00:20.950Z",
    __v: 0,
  },
  {
    _id: "6776814c3b676fb85822366d",
    pollId: "677666d262022e7a2c7b5133",
    userId: "67765c1e4d549e4d2e5772cd",
    answers: [
      {
        questionId: "677666d262022e7a2c7b5134",
        optionId: "677666d262022e7a2c7b5138",
        _id: "6776814c3b676fb85822366e",
      },
      {
        questionId: "677666d362022e7a2c7b5146",
        optionId: "677666d362022e7a2c7b5147",
        _id: "6776814c3b676fb85822366f",
      },
      {
        questionId: "677666d462022e7a2c7b5155",
        optionId: "677666d462022e7a2c7b5159",
        _id: "6776814c3b676fb858223670",
      },
      {
        questionId: "677666d462022e7a2c7b516a",
        optionId: "677666d562022e7a2c7b5171",
        _id: "6776814c3b676fb858223671",
      },
      {
        questionId: "677666d562022e7a2c7b517c",
        optionId: "677666d562022e7a2c7b5183",
        _id: "6776814c3b676fb858223672",
      },
    ],
    submittedAt: "2025-01-02T12:06:36.303Z",
    __v: 0,
  },
  {
    _id: "6776818335b1b64981257566",
    pollId: "677666d262022e7a2c7b5133",
    userId: "67765c1e4d549e4d2e5772cd",
    answers: [
      {
        questionId: "677666d262022e7a2c7b5134",
        optionId: "677666d262022e7a2c7b5138",
        _id: "6776818335b1b64981257567",
      },
      {
        questionId: "677666d362022e7a2c7b5146",
        optionId: "677666d362022e7a2c7b5147",
        _id: "6776818335b1b64981257568",
      },
      {
        questionId: "677666d462022e7a2c7b5155",
        optionId: "677666d462022e7a2c7b5162",
        _id: "6776818335b1b64981257569",
      },
      {
        questionId: "677666d462022e7a2c7b516a",
        optionId: "677666d562022e7a2c7b5177",
        _id: "6776818335b1b6498125756a",
      },
      {
        questionId: "677666d562022e7a2c7b517c",
        optionId: "677666d562022e7a2c7b5183",
        _id: "6776818335b1b6498125756b",
      },
    ],
    submittedAt: "2025-01-02T12:07:31.764Z",
    __v: 0,
  },
];

describe("Poll Service", () => {
  beforeEach(() => {
    // Reset mocks before each test
    Poll.mockClear();
    Question.mockClear();
    Option.mockClear();
    PollSubmission.mockClear();
  });

  test("should throw error if non-admin user tries to create a poll", async () => {
    await expect(
      createPoll(
        DUMMY_POLL.title,
        DUMMY_POLL.questions,
        DUMMY_POLL.expiresAt,
        DUMMY_USER
      )
    ).rejects.toThrow("You are not allowed to create a poll");
  });

  test("should create a new poll if admin user tries to create a poll", async () => {
    Poll.mockImplementation(() => ({
      title: DUMMY_POLL.title,
      questions: [],
      save: jest.fn().mockResolvedValue(true),
    }));

    Question.mockImplementation(() => ({
      question: DUMMY_POLL.questions[0].question,
      isRequired: DUMMY_POLL.questions[0].isRequired,
      options: [],
      save: jest.fn().mockResolvedValue(true),
    }));

    Option.mockImplementation(() => ({
      option: "Spring",
      save: jest.fn().mockResolvedValue(true),
    }));

    await expect(
      createPoll(DUMMY_POLL.title, DUMMY_POLL.questions, DUMMY_POLL.expiresAt, {
        ...DUMMY_USER,
        role: "Admin",
      })
    ).resolves.toBeUndefined();
  });

  test("should throw error if failed to fetch poll by ID", async () => {
    Poll.findById.mockReturnValue(null);
    await expect(getPollById("fake-poll-id")).rejects.toThrow();
  });

  test("should throw error if poll not exists which need to be deleted", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue(null),
    });

    await expect(
      closePoll("fake-poll-id", { ...DUMMY_USER, role: "Admin" })
    ).rejects.toThrow("Poll not found");
  });

  test("should throw an error if an inactive or closed poll is closed", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue({
        ...FAKE_POLL_RESPONSE,
        isActive: false,
      }),
    });

    await expect(
      closePoll("fake-poll-id", { ...DUMMY_USER, role: "Admin" })
    ).rejects.toThrow("Poll is already closed");
  });

  test("should close a poll if an Admin closes existing poll", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue({
        ...FAKE_POLL_RESPONSE,
        save: jest.fn().mockResolvedValue(true),
      }),
    });

    await expect(
      closePoll("fake-poll-id", { ...DUMMY_USER, role: "Admin" })
    ).resolves.toBeUndefined();
  });

  test("should throw an error if user try to submit a poll with does not exits", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue(null),
    });

    await expect(
      submitPoll("fake-poll-id", FAKE_POLL_ANSWERS, DUMMY_USER)
    ).rejects.toThrow("Poll not found");
  });

  test("should throw an error if an inactive or closed poll is closed", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue({
        ...FAKE_POLL_RESPONSE,
        isActive: false,
      }),
    });

    await expect(
      submitPoll("fake-poll-id", FAKE_POLL_ANSWERS, DUMMY_USER)
    ).rejects.toThrow("Poll is closed");
  });

  test("should throw an error if poll is expired", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue({
        ...FAKE_POLL_RESPONSE,
        expiresAt: new Date(new Date().getTime() - 60 * 60 * 1000),
      }),
    });

    await expect(
      submitPoll("fake-poll-id", FAKE_POLL_ANSWERS, DUMMY_USER)
    ).rejects.toThrow("Poll is already expired");
  });

  test("should throw an error if user resubmits a poll", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue(FAKE_POLL_RESPONSE),
    });

    PollSubmission.findOne.mockReturnValue({ _id: "fake-id" });

    await expect(
      submitPoll("fake-poll-id", FAKE_POLL_ANSWERS, DUMMY_USER)
    ).rejects.toThrow("You have already submitted this poll");
  });

  // Should throw an error if any required question is missed
  // test("should throw an error if any required question is missed", async () => {
  //   jest.mock("../services/poll.service", () => ({
  //     isAllRequiredQuestionsSubmitted: jest.fn().mockReturnValue(false),
  //   }));
  //   Poll.findById.mockReturnValue({
  //     populate: jest.fn().mockReturnValue({
  //       populate: jest.fn().mockReturnValue({
  //         populate: jest.fn().mockReturnValue(FAKE_POLL_RESPONSE),
  //       }),
  //     }),
  //   });
  // Poll.findById.mockReturnValue({
  //   populate: jest.fn().mockReturnValue(null),
  //   exec: jest
  //     .fn()
  //     .mockReturnValue(FAKE_POLL_RESPONSE),
  // });
  //   PollSubmission.findOne.mockReturnValue(null);
  //   await expect(
  //     submitPoll("fake-poll-id", FAKE_POLL_ANSWERS, DUMMY_USER)
  //   ).rejects.toThrow(
  //     "You must submit all the mandatory questions of the poll"
  //   );
  // });

  test("should submit the poll if active existing poll is submitted first time", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue({
        ...FAKE_POLL_RESPONSE,
        save: jest.fn().mockResolvedValue(true),
      }),
    });

    PollSubmission.findOne.mockReturnValue(null);

    await expect(
      submitPoll("fake-poll-id", FAKE_POLL_ANSWERS, DUMMY_USER)
    ).resolves.toBeUndefined();
  });

  test("should throw error if requested to generate result for a non-existing poll", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue(null),
    });

    await expect(getPollResult("fake-poll-id")).rejects.toThrow(
      "Poll not found"
    );
  });

  test("should return result for a existing poll", async () => {
    Poll.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue(null),
      exec: jest.fn().mockReturnValue(FAKE_POLL_RESPONSE),
    });

    PollSubmission.find.mockReturnValue(FAKE_POLL_SUBMISSIONS);

    const result = await getPollResult("fake-poll-id");

    expect(result).toBeDefined();
    expect(result.pollId).toBeDefined();
    expect(result.title).toBeDefined();
    expect(result.totalSubmissions).toBeDefined();
    expect(result.result.length).toBeDefined();
  });
});
