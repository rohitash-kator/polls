import apiClient from "./apiClient";

const signup = async (userData) => {
  const signupResponse = await apiClient.post("/auth/signup", userData);
  const { token } = await signupResponse.data;

  return token;
};

const login = async (email, password) => {
  const loginResponse = await apiClient.post("/auth/login", {
    email,
    password,
  });
  const { token } = await loginResponse.data;

  return token;
};

const logout = async () => {
  await apiClient.post("/auth/logout");
};

export default { login, signup, logout };
