// import db from '../db/models';
import { ApiError } from '../exceptions/api.error';
// const { Abonement, User, Training } = db;
import Abonement from '../db/mdbmodels/Abonement';
import User from '../db/mdbmodels/User';
import Training from '../db/mdbmodels/Training';
import History from '../db/mdbmodels/History';

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
    path: 'visitedTrainings',
    populate: {
      path: 'visitors',
    },
  });
};

export const getOne = async (id: number) => {
  return Abonement.findById(id);
};

export const getById = async (id: string) => {
  return Abonement.findById(id).populate({
    path: 'visitedTrainings',
    populate: {
      path: 'visitors',
      model: 'User',
    },
  });
};

export const create = async (payload: any, user: any) => {
  const { role } = user;

  const client =
    role === 'admin' ? await User.findById(payload.clientId) : user;

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
//   abonementId: number,
//   userId: number,
//   payload: payload,
// ) => {
//   const abonement = await Abonement.findByPk(abonementId);
//   if (!abonement || abonement.userId !== userId) {
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
//   } else if (
//     payload.updateType === 'reservation' &&
//     (abonement.status === 'active' || abonement.status === 'inactive')
//   ) {
//     const training = await Training.findByPk(payload.trainingId);
//     if (await abonement.hasTraining(training)) {
//       throw new Error('Training already reserved.');
//     }

//     if (!abonement.activatedAt) {
//       const expirationDate = new Date(currentDate);
//       expirationDate.setMonth(currentDate.getMonth() + 1);

//       abonement.activatedAt = currentDate;
//       abonement.expiratedAt = expirationDate;
//       abonement.status = 'active';
//     }

//     abonement.left -= 1;

//     if (abonement.left === 0) {
//       abonement.status = 'ended';
//     }

//     await abonement.addTraining(training);
//   } else if (payload.updateType === 'cancellation') {
//     if (abonement.left === 0) {
//       abonement.status = 'active';
//     }
//     abonement.left += 1;
//     const training = await Training.findByPk(payload.trainingId);
//     await abonement.removeTraining(training);
//   } else {
//     return payload.updateType;
//   }

//   await abonement.save();

//   return await Abonement.findByPk(abonement.id, {
//     include: [
//       {
//         model: Training,
//         as: 'trainings',
//         include: [
//           {
//             model: User,
//             as: 'instructor',
//           },
//         ],
//       },
//     ],
//   });
// };

export const update = async (
  abonementId: string,
  userId: string,
  payload: Payload,
) => {
  const abonement = await Abonement.findById(abonementId);
  if (!abonement || abonement.user.toString() !== userId) {
    throw ApiError.NotFound({
      abonement: 'Abonement not found or not owned by the user',
    });
  }

  const currentDate = new Date();
  if (payload.updateType === 'freeze' && !abonement.paused) {
    abonement.paused = true;
    abonement.expiratedAt.setDate(abonement.expiratedAt.getDate() + 7);
  } else if (payload.updateType === 'freeze' && abonement.paused) {
    throw new Error('Abonement is already paused.');
  } else if (
    payload.updateType === 'reservation' &&
    (abonement.status === 'active' || abonement.status === 'inactive')
  ) {
    const training = await Training.findById(payload.trainingId);
    if (!training) {
      throw new Error('Training not found.');
    }

    const history = await History.findOne({
      abonementId: abonement._id,
      trainingId: training._id,
    });

    if (history) {
      throw new Error('Training already reserved.');
    }

    if (!abonement.activatedAt) {
      const expirationDate = new Date(currentDate);
      expirationDate.setMonth(currentDate.getMonth() + 1);

      abonement.activatedAt = currentDate;
      abonement.expiratedAt = expirationDate;
      abonement.status = 'active';
    }

    abonement.left -= 1;

    if (abonement.left === 0) {
      abonement.status = 'ended';
    }

    await new History({
      abonementId: abonement._id,
      trainingId: training._id,
      userId: abonement.user,
    }).save();
  } else if (payload.updateType === 'cancellation') {
    if (abonement.left === 0) {
      abonement.status = 'active';
    }
    abonement.left += 1;
    const training = await Training.findById(payload.trainingId);
    if (!training) {
      throw new Error('Training not found.');
    }
    await History.deleteOne({
      abonementId: abonement._id,
      trainingId: training._id,
    });
  } else {
    return payload.updateType;
  }

  await abonement.save();

  return Abonement.findById(abonement._id).populate({
    path: 'visitedTrainings',
    populate: {
      path: 'visitors',
    },
  });
};

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
