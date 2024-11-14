import { User } from "../types/User";
import axiosClient from "../api/axiosClient";

function getProfile(): Promise<User> {
  return axiosClient.get("/users/profile");
}
function getAll(): Promise<User[]> {
  return axiosClient.get("/users");
}
async function getTrainers(): Promise<User[]> {
  const trainers: User[] = await axiosClient.get("/users");
  return trainers.filter((user: User) => user.role === "trainer");
}
function getOneById(id: string): Promise<User> {
  return axiosClient.get(`/users/${id}`);
}
function update(updatedUser: Partial<User>): Promise<User> {
  return axiosClient.patch(`/users/profile/update`, updatedUser);
}

export const userService = {
  getAll,
  getTrainers,
  getOneById,
  getProfile,
  update,
};
