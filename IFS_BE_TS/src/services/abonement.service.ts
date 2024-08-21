import db from '../db/models';

const { Abonement, User, Training } = db;

interface payload {
  updateType: string;
  trainingId?: number;
}

export const getAll = async () => {
  return await Abonement.findAll({
    include: {
      model: User,
      as: 'user',
      attributes: ['firstName', 'lastName'],
    },
  });
};

export const getOne = async (id: number) => {
  return await Abonement.findByPk(id);
};

export const getById = async (id: number) => {
  return await Abonement.findByPk(id, {
    include: [
      // eager loading
      {
        model: Training,
        as: 'trainings',
        through: { attributes: [] }, // Exclude attributes from the History table
      },
    ],
  });
};

export const update = async (
  abonementId: number,
  userId: number,
  payload: payload,
) => {
  const abonement = await Abonement.findByPk(abonementId);
  if (!abonement || abonement.userId !== userId) {
    throw new Error('Abonement not found or not owned by the user.');
  }

  const currentDate = new Date();
  if (payload.updateType === 'freeze' && !abonement.paused) {
    abonement.paused = true;
    abonement.expiratedAt.setDate(abonement.expiratedAt.getDate() + 7);
  } else if (payload.updateType === 'freeze' && abonement.paused) {
    throw new Error('Abonement is already paused.');
  } else if (payload.updateType === 'reservation') {
    const training = await Training.findByPk(payload.trainingId);
    if (await abonement.hasTraining(training)) {
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

    await abonement.addTraining(training);
  } else if (payload.updateType === 'cancellation') {
    if (abonement.left === 0) {
      abonement.status = 'active';
    }
    abonement.left += 1;
    const training = await Training.findByPk(payload.trainingId);
    await abonement.removeTraining(training);
  } else {
    return payload.updateType;
  }

  await abonement.save();

  return await Abonement.findByPk(abonement.id, {
    include: [
      {
        model: Training,
        as: 'trainings',
        include: [
          {
            model: User, // Assuming Training has a relationship with User (instructor)
            as: 'instructor', // Adjust if necessary
          },
        ],
      },
    ],
  });
};

export const createAbonement = async (payload: any, user: any) => {
  const { role } = user;

  const client = role === 'admin' ? await getOne(payload.clientId) : user;

  if (!client) {
    throw new Error('Cannot find client');
  }

  const abonements = await Abonement.findAll({
    where: {
      userId: client.id,
      status: ['active', 'non-active'],
    },
  });

  if (abonements.length > 0) {
    throw new Error('Already have an abonement');
  }

  if (!payload.amount || payload.amount === 0) {
    throw new Error('Amount in abonement is not chosen');
  }

  const newAbonement = await Abonement.create({
    userId: client.id,
    status: 'non-active',
    type: payload.type,
    amount: payload.amount,
    price: payload.price,
    left: payload.amount,
    paused: false,
  });

  return newAbonement;
};

export const removeAbonement = async (abonementId: number, user: any) => {
  const abonement = await Abonement.findByPk(abonementId);
  if (!abonement) {
    throw new Error('Abonement not found');
  }
  if (user.role !== 'admin') {
    throw new Error(
      'Unauthorized: You are not authorized to perform this operation.',
    );
  }

  await Abonement.destroy({
    where: { id: abonementId },
  });
};
