import { User } from '../types/User';

const users: User[] = [];

export function getAll() {
  return users;
}

export function getById(id: string) {
  return users.find(user => user.id === id);
}

export function create(title: string) {
  const user = { title, completed: false };

  users.push(user);

  return user;
}

export function deleteById(id: string) {
  const index = users.findIndex(user => user.id === id);

  if (index === -1) return;

  const [user] = users.splice(index, 1);

  return user;
}

export function update({ id, title, completed }: User) {
  const user = users.find(user => user.id === id);

  if (!user) return;

  return Object.assign(user, { title, completed });
}

export const usersService = {
  getAll,
  getById,
  create,
  deleteById,
  update,
};
