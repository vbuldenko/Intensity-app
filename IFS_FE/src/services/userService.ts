import { User } from "../types/User";
import axiosClient from "../api/axiosClient";

function getProfile(): Promise<User> {
  return axiosClient.get("/users/profile");
}
function getAll(): Promise<User[]> {
  return axiosClient.get("/users");
}
function getOneById(id: string): Promise<User> {
  return axiosClient.get(`/users/${id}`);
}

export const userService = {
  getAll,
  getOneById,
  getProfile,
};
