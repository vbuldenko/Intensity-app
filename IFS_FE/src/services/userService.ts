import { User } from "../types/User";
import axiosClient from "../api/axiosClient";

function getProfile(): Promise<User> {
  return axiosClient.get("/users/profile");
}
function getAll(): Promise<User[]> {
  return axiosClient.get("/users");
}

export const userService = {
  getAll,
  getProfile,
};
