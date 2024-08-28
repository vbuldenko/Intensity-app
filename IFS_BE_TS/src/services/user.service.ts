import bcrypt from 'bcrypt';
import db from '../db/models';
import { ApiError } from '../exceptions/api.error';
import { hashPassword } from '../utils';
import { sendActivationLink } from './email.service';
import { UserDTO } from '../types/UserDTO';
import { User } from '../types/User';

const normalize = ({ id, firstName, lastName, email }: UserDTO): UserDTO => {
  return { id, firstName, lastName, email };
};

const getAllActive = async () => {
  return db.User.findAll({
    where: {
      activationToken: null,
    },
  });
};

const getByEmail = async (email: string) => {
  return db.User.findOne({ where: { email } });
};

const getByToken = async (activationToken: string) => {
  return db.User.findOne({ where: { activationToken } });
};

const getById = async (id: number) => {
  return db.User.findOne({ where: { id } });
};

const create = async (user: User) => {
  const existingUser = await getByEmail(user.email);

  if (existingUser) {
    throw ApiError.BadRequest('User already exists', {
      email: 'User already exists',
    });
  }

  const hash = await hashPassword(user.password);
  const activationToken = bcrypt.genSaltSync(1);

  await db.User.create({
    ...user,
    password: hash,
    activationToken,
  });

  await sendActivationLink(user.firstName, user.email, activationToken);
};

const update = async (
  data: Partial<{ name: string; email: string; password: string }>,
  userId: number,
) => {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw ApiError.NotFound();
  }

  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  await user.update(data);

  return user;
};

const getOrCreateGoogleUser = async ({
  name,
  email,
}: {
  name: string | undefined;
  email: string | undefined;
}) => {
  let user = await db.User.findOne({ where: { email } });

  if (!user) {
    const hash = await hashPassword('defaultpassword');

    user = await db.User.create({
      email,
      name,
      password: hash,
      activationToken: null,
    });
  }

  return user;
};

export {
  normalize,
  getAllActive,
  getByEmail,
  getById,
  getByToken,
  create,
  update,
  getOrCreateGoogleUser,
};
