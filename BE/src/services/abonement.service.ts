import { ApiError } from '../exceptions/api.error';
import Abonement from '../db/models/abonement';
import User from '../db/models/user';

interface Payload {
  updateType: string;
  trainingId?: number;
}

export const getAll = async () => {
  return Abonement.find().populate({
    path: 'user',
    select: 'firstName lastName',
  });
};

export const getAllByUserId = async (userId: string) => {
  return Abonement.find({ user: userId }).populate({
    path: 'reservations',
    populate: {
      path: 'training',
    },
  });
};

export const getOne = async (id: number) => {
  return Abonement.findById(id);
};

export const getById = async (id: string) => {
  return Abonement.findById(id).populate({
    path: 'reservations',
    populate: {
      path: 'training',
    },
  });
};

export const create = async (payload: any, user: any) => {
  const { role } = user;

  const client =
    role === 'admin'
      ? await User.findById(payload.clientId)
      : await User.findById(user.id);

  if (!client) {
    throw ApiError.NotFound({ user: 'User not found' });
  }

  const abonements = await Abonement.find({
    user: client._id,
    status: { $in: ['active', 'inactive'] },
  });

  if (abonements.length > 0) {
    throw ApiError.BadRequest('Existing element', {
      abonement: 'was already created',
    });
  }

  if (!payload.amount || payload.amount === 0) {
    throw ApiError.BadRequest('Validation error', { amount: 'Required field' });
  }

  const newAbonement = new Abonement({
    user: client._id,
    status: 'inactive',
    type: payload.type,
    amount: payload.amount,
    price: payload.price,
    left: payload.amount,
  });

  const savedAbonement = await newAbonement.save();

  client.abonements = client.abonements.concat(savedAbonement._id);
  await client.save();

  return savedAbonement;
};

// export const update = async (
//   abonementId: string,
//   userId: string,
//   payload: Payload,
// ) => {
//   const abonement = await Abonement.findById(abonementId);
//   if (!abonement || abonement.user.toString() !== userId) {
//     throw ApiError.NotFound({
//       abonement: 'Abonement not found or not owned by the user',
//     });
//   }

//   const currentDate = new Date();
//   if (payload.updateType === 'freeze' && !abonement.paused) {
//     abonement.paused = true;
//     abonement.expiratedAt.setDate(abonement.expiratedAt.getDate() + 7);
//   } else if (payload.updateType === 'freeze' && abonement.paused) {
//     throw new Error('Abonement is already paused.');
//   }

//   await abonement.save();

//   return Abonement.findById(abonement._id).populate({
//     path: 'visitedTrainings',
//     populate: {
//       path: 'visitors',
//     },
//   });
// };

export const remove = async (abonementId: string, user: any) => {
  const abonement = await Abonement.findById(abonementId);
  if (!abonement) {
    throw new Error('Abonement not found');
  }
  if (user.role !== 'admin') {
    throw new Error(
      'Unauthorized: You are not authorized to perform this operation.',
    );
  }

  await Abonement.deleteOne({ _id: abonementId });
};
