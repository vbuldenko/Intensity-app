import { ApiError } from '../exceptions/api.error';
import Abonement, { IAbonement } from '../db/models/abonement';
import User, { IUser, UserDTO } from '../db/models/user';
import { startOfYear } from 'date-fns';

interface Payload {
  updateType: string;
  trainingId?: number;
}

export const getAll = async () => {
  const startOfCurrentYear = startOfYear(new Date());

  return Abonement.find({
    createdAt: { $gte: startOfCurrentYear },
  }).populate({
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

  const client: IUser | null =
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
  } as IAbonement);

  if (role === 'admin') {
    newAbonement.paymentMethod = payload.paymentMethod;
  }

  const savedAbonement = await newAbonement.save();

  client.abonements = client.abonements.concat(savedAbonement._id);
  await client.save();

  return savedAbonement;
};

export const update = async (
  abonementId: string,
  user: UserDTO,
  payload: IAbonement,
) => {
  const abonement = await Abonement.findById(abonementId);
  if (!abonement) {
    throw ApiError.NotFound({
      abonement: 'Abonement not found',
    });
  }
  // if (abonement.user.toString() !== userId) {
  //   throw ApiError.NotFound({
  //     abonement: 'Abonement not found or not owned by the user',
  //   });
  // }

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
    path: 'user',
    select: 'firstName lastName',
  });
};

export const remove = async (abonementId: string) => {
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
