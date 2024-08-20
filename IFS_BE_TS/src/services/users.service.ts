import bcrypt from 'bcrypt';
import db from '../db/models';
import { ApiError } from '../exceptions/api.error';
import { hashPassword } from '../utils';
import { sendActivationLink } from './email.service';

interface NormalizedUser {
  id: number;
  name: string;
  email: string;
}

const normalize = ({
  id,
  name,
  email,
}: {
  id: number;
  name: string;
  email: string;
}): NormalizedUser => {
  return { id, name, email };
};

const getAllActive = async () => {
  return db.User.findAll({
    where: {
      activationToken: null,
    },
  });
};

const findByEmail = async (email: string) => {
  return db.User.findOne({ where: { email } });
};

const findByToken = async (activationToken: string) => {
  return db.User.findOne({ where: { activationToken } });
};

const findById = async (id: number) => {
  return db.User.findOne({ where: { id } });
};

const create = async (name: string, email: string, password: string) => {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw ApiError.BadRequest('User already exists', {
      email: 'User already exists',
    });
  }

  const hash = await hashPassword(password);
  const activationToken = bcrypt.genSaltSync(1);

  await db.User.create({
    name,
    email,
    password: hash,
    activationToken,
  });

  await sendActivationLink(name, email, activationToken);
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

const findOrCreateGoogleUser = async ({
  name,
  email,
}: {
  name: string;
  email: string;
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
  findByEmail,
  findById,
  findByToken,
  create,
  update,
  findOrCreateGoogleUser,
};
