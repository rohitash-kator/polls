import apiClient from "./apiClient";

const getCurrentUser = async () => {
  const apiResponse = await apiClient.get("/users/currentUser");
  const { user } = await apiResponse.data;
  return user;
};

export default { getCurrentUser };
