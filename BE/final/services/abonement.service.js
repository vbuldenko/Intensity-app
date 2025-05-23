import { ApiError } from '../exceptions/api.error.js';
import Abonement from '../db/models/Abonement.js';
import User from '../db/models/User.js';
import { startOfYear } from 'date-fns';
export const getAll = async () => {
  const startOfCurrentYear = startOfYear(new Date());

  return Abonement.find({
    createdAt: { $gte: startOfCurrentYear },
  }).populate({
    path: 'user',
    select: 'firstName lastName',
  });
};
export const getAllByUserId = async userId => {
  return Abonement.find({ user: userId }).populate({
    path: 'reservations',
    populate: {
      path: 'training',
    },
  });
};
export const getOne = async id => {
  return Abonement.findById(id);
};
export const getById = async id => {
  return Abonement.findById(id).populate({
    path: 'reservations',
    populate: {
      path: 'training',
    },
  });
};
export const create = async (payload, user) => {
  const { role } = user;
  const client =
    role === 'admin'
      ? await User.findById(payload.clientId)
      : await User.findById(user.id);
  if (!client) {
    throw ApiError.NotFound({ user: 'User not found' });
  }
  // const abonements = await Abonement.find({
  //   user: client._id,
  //   status: { $in: ['active', 'inactive'] },
  // });
  // if (abonements.length > 0) {
  //   throw ApiError.BadRequest('Existing element', {
  //     abonement: 'was already created',
  //   });
  // }
  if (!payload.amount || payload.amount === 0) {
    throw ApiError.BadRequest('Validation error', { amount: 'Required field' });
  }
  const newAbonement = new Abonement({
    user: client._id,
    status: payload.type === 'group' ? 'inactive' : 'ended',
    type: payload.type,
    amount: payload.amount,
    price: payload.price,
    left: payload.amount,
  });
  if (role === 'admin') {
    newAbonement.paymentMethod = payload.paymentMethod;
  }
  const savedAbonement = await newAbonement.save();
  client.abonements = client.abonements.concat(savedAbonement._id);
  await client.save();
  return savedAbonement;
};
export const update = async (abonementId, user, payload) => {
  const abonement = await Abonement.findById(abonementId);
  if (!abonement) {
    throw ApiError.NotFound({
      abonement: 'Abonement not found',
    });
  }
  if (user.role === 'admin' && !abonement.extended) {
    abonement.extended = true;
    const expirationDate = new Date(abonement.expiratedAt);
    expirationDate.setDate(expirationDate.getDate() + 7);
    abonement.expiratedAt = expirationDate;
  } else if (abonement.extended) {
    throw new Error('Abonement is already paused.');
  }

  await abonement.save();

  return Abonement.findById(abonement._id).populate({
    path: 'reservations',
    populate: {
      path: 'training',
    },
  });
};
export const remove = async abonementId => {
  const abonement = await Abonement.findById(abonementId);
  if (!abonement) {
    throw ApiError.NotFound({ abonement: 'Not found' });
  }
  const user = await User.findById(abonement.user);
  if (!user) {
    throw ApiError.NotFound({ user: 'Not found' });
  }
  if (abonement.status !== 'inactive') {
    throw ApiError.BadRequest('Abonement should be inactive');
  }

  await Abonement.deleteOne({ _id: abonementId });
  user.abonements = user.abonements.filter(id => id.toString() !== abonementId);
  await user.save();
};
