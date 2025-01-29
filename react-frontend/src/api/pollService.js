import apiClient from "./apiClient";

const createPoll = async (pollData) => {
  const apiResponse = await apiClient.post("/polls", pollData);
  const poll = await apiResponse.data;
  return poll;
};

const fetchAllPolls = async () => {
  const apiResponse = await apiClient.get("/polls");
  const { polls } = await apiResponse.data;

  return polls;
};

const fetchPollById = async (pollId) => {
  const apiResponse = await apiClient.get(`/polls/${pollId}`);
  const { poll } = await apiResponse.data;
  return poll;
};

const submitPoll = async (pollId, pollAnswers) => {
  const apiResponse = await apiClient.post(
    `/polls/${pollId}/submit`,
    pollAnswers
  );
  const { message } = await apiResponse.data;
  return message;
};

const closePoll = async (pollId) => {
  const apiResponse = await apiClient.post(`/polls/${pollId}/close`);
  const { message } = await apiResponse.data;

  return message;
};

const getPollResult = async (pollId) => {
  const apiResponse = await apiClient.get(`/polls/${pollId}/result`);
  const { result } = await apiResponse.data;

  return result;
};

const fetchLivePolls = async () => {
  const apiResponse = await apiClient.get("/polls/active");
  const { polls } = await apiResponse.data;

  return polls;
};

export default {
  createPoll,
  fetchAllPolls,
  fetchPollById,
  submitPoll,
  closePoll,
  getPollResult,
  fetchLivePolls,
};
