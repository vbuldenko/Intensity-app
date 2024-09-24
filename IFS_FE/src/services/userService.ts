import { User } from "../types/User";
import axiosClient from "../api/axiosClient";

function getProfile(): Promise<User> {
  return axiosClient.get("/users/profile");
}

export const userService = {
  getProfile,
};
