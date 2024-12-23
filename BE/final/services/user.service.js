import crypto from 'crypto';
import User from '../db/models/User.js';
import { ApiError } from '../exceptions/api.error.js';
import { hashPassword } from '../utils/index.js';
import { sendActivationLink } from './email.service.js';
const normalize = ({ id, firstName, lastName, email, role }) => {
  return { id, firstName, lastName, email, role };
};
const getAllActive = async () => {
  return User.find({ activationToken: null }).populate('abonements');
};
const getUserByIdentifier = async identifier => {
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
const getByEmail = async email => {
  return User.findOne({ email });
};
const getByPhone = async phone => {
  return User.findOne({ phone });
};
const getByToken = async activationToken => {
  return User.findOne({ activationToken });
};
const getById = async id => {
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
      populate: {
        path: 'reservations',
        populate: {
          path: 'user',
          select: 'firstName lastName',
        },
      },
    });
};
const create = async user => {
  const existingUser = await getByEmail(user.email);
  if (existingUser) {
    throw ApiError.BadRequest('User already exists', {
      email: 'User already exists',
    });
  }
  const hash = await hashPassword(user.password);
  const activationToken = crypto.randomBytes(32).toString('hex');
  const newUser = new User({
    ...user,
    password: hash,
    activationToken,
  });
  await newUser.save();
  await sendActivationLink(user.firstName, user.email, activationToken);
};
const update = async (data, userId) => {
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
const getOrCreateGoogleUser = async ({ name, email }) => {
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
const remove = async id => {
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
