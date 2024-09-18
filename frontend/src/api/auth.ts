/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const login = (user: any) =>
  axios.post("/api/auth/login", user, { withCredentials: true });

const authService = {
  login,
};

export default authService;
