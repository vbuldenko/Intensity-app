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
function update(updatedUser: Partial<User>): Promise<User> {
  return axiosClient.patch(`/users/profile/update`, updatedUser);
}

export const userService = {
  getAll,
  getOneById,
  getProfile,
  update,
};
