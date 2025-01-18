import bcrypt from 'bcrypt';
import User, { IUser, UserDTO } from '../db/models/user';
import { ApiError } from '../exceptions/api.error';
import { hashPassword } from '../utils';
import { sendActivationLink } from './email.service';

const normalize = ({
  id,
  firstName,
  lastName,
  email,
  role,
}: IUser): UserDTO => {
  return { id, firstName, lastName, email, role };
};

const getAllActive = async () => {
  return User.find({ activationToken: null })
    .select('-activationToken -password -settings')
    .populate('abonements');
};

const getUserByIdentifier = async (identifier: string) => {
  if (identifier.includes('@')) {
    return await getByEmail(identifier);
  } else if (/^\d+$/.test(identifier)) {
    return await getByPhone(identifier);
  } else {
    throw ApiError.BadRequest('Wrong input data', {
      identifier: 'Input data should be email or phone number',
    });
  }
};

const getByEmail = async (email: string) => {
  return User.findOne({ email });
};

const getByPhone = async (phone: string) => {
  return User.findOne({ phone });
};

const getByToken = async (activationToken: string) => {
  return User.findOne({ activationToken });
};

const getById = async (id: string) => {
  return User.findById(id)
    .select('-activationToken -password')
    .populate({
      path: 'abonements',
      populate: {
        path: 'reservations',
        populate: {
          path: 'training',
        },
      },
    })
    .populate({
      path: 'trainings',
      options: { sort: { date: 1 } }, // Sort trainings by date in ascending order
      populate: {
        path: 'reservations',
        populate: {
          path: 'user',
          select: 'firstName lastName',
        },
      },
    });
};

const create = async (user: IUser) => {
  const existingUser = await getByEmail(user.email);

  if (existingUser) {
    throw ApiError.BadRequest('User already exists', {
      email: 'User already exists',
    });
  }

  const hash = await hashPassword(user.password);
  const activationToken = bcrypt.genSaltSync(1);

  const newUser = new User({
    ...user,
    password: hash,
    activationToken,
  });

  await newUser.save();

  await sendActivationLink(user.firstName, user.email, activationToken);
};

const update = async (
  data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    settings: { fontSize: number };
  }>,
  userId: string,
) => {
  const user = await getById(userId);

  if (!user) {
    throw ApiError.NotFound();
  }

  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  Object.assign(user, data);
  await user.save();

  return user;
};

const getOrCreateGoogleUser = async ({
  name,
  email,
}: {
  name: string | undefined;
  email: string | undefined;
}) => {
  let user = await User.findOne({ email });

  if (!user) {
    const hash = await hashPassword('defaultpassword');

    user = new User({
      email,
      name,
      password: hash,
      activationToken: null,
    });

    await user.save();
  }

  return user;
};

const remove = async (id: string) => {
  const user = await getById(id);

  if (!user) {
    throw ApiError.BadRequest('User does not exists', {
      id: 'User not found',
    });
  }

  await user.deleteOne();
};

const removeMany = async () => {
  await User.deleteMany({});
};

export {
  normalize,
  getAllActive,
  getUserByIdentifier,
  getByEmail,
  getById,
  getByToken,
  create,
  update,
  getOrCreateGoogleUser,
  remove,
  removeMany,
};
