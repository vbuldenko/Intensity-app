import { Transaction } from 'sequelize';
import db from '../db/models';
import { ApiError } from '../exceptions/api.error';
import { Abonement } from '../types/Abonement';
import { Training } from '../types/Training';
import { User } from '../types/User';
import { canTrainingProceed } from '../utils';

export const updateReservation = async (
  abonementId: number,
  trainingId: number,
  userId: number,
  updateType: 'reservation' | 'cancellation',
) => {
  // Fetch relevant data with necessary associations
  const [abonement, training, user] = await Promise.all([
    db.Abonement.findByPk(abonementId, {
      include: [
        {
          model: db.Training,
          as: 'visitedTrainings',
          attributes: { exclude: ['capacity'] },
          through: { attributes: [] },
        },
      ],
    }),
    db.Training.findByPk(trainingId, {
      include: [
        {
          model: db.User,
          as: 'instructor',
          attributes: ['firstName', 'lastName'],
        },
        {
          model: db.User,
          as: 'visitors',
          attributes: ['firstName', 'lastName'],
          through: { attributes: [] }, // Exclude History attributes
        },
      ],
    }),
    db.User.findByPk(userId),
  ]);

  if (!user || !abonement || !training) {
    throw ApiError.NotFound({
      error: 'User, Abonement, or Training not found.',
    });
  }

  // Start a transaction
  const transaction = await db.sequelize.transaction();

  try {
    switch (updateType) {
      case 'reservation':
        await handleReservation(abonement, training, user, transaction);
        break;
      case 'cancellation':
        await handleCancellation(abonement, training, user, transaction);
        break;
      default:
        throw ApiError.BadRequest('Invalid updateType');
    }

    // Commit the transaction to apply changes
    await transaction.commit();

    // Reload the models to get the updated data without re-fetching everything
    await Promise.all([abonement.reload(), training.reload()]);
    // await training.reload();

    return {
      updatedAbonement: abonement,
      updatedTraining: training,
    };
  } catch (error) {
    // Rollback the transaction in case of any errors
    await transaction.rollback();
    throw error;
  }
};

const handleReservation = async (
  abonement: any,
  training: any,
  user: any,
  transaction: any,
) => {
  // Check if the user has already reserved the training
  const hasVisited = await training.hasVisitor(user);
  if (hasVisited) {
    throw ApiError.BadRequest(
      'Already reserved: You have already reserved your place!',
    );
  }

  if (abonement.status !== 'inactive' && abonement.status !== 'active') {
    throw ApiError.BadRequest('Abonement has ended!');
  }

  if (abonement.status === 'inactive') {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    expirationDate.setMonth(currentDate.getMonth() + 1);

    abonement.activatedAt = currentDate;
    abonement.expiratedAt = expirationDate;
    abonement.status = 'active';
  }

  // Create history record and update Abonement and Training as per your logic
  await db.History.create(
    {
      abonementId: abonement.id,
      trainingId: training.id,
      userId: user.id,
    },
    { transaction },
  );

  // Update the Abonement: decrement left count, set status if needed
  abonement.left -= 1;
  if (abonement.left === 0) {
    abonement.status = 'ended';
  }

  await abonement.save({ transaction });
};

// look for types later

const handleCancellation = async (
  abonement: any,
  training: any,
  user: any,
  transaction: any,
) => {
  // Check if the user has a reservation for the training
  const hasVisited = await training.hasVisitor(user);
  if (!hasVisited) {
    throw ApiError.BadRequest('Not reserved: You have not reserved a place!');
  }

  // Remove the history record
  await db.History.destroy({
    where: {
      abonementId: abonement.id,
      trainingId: training.id,
      userId: user.id,
    },
    transaction,
  });

  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }

  await abonement.save({ transaction });
};

const handleReturn = async (
  abonement: any,
  trainingId: any,
  userId: any,
  transaction: any,
) => {
  // Remove the history record
  await db.History.destroy({
    where: {
      abonementId: abonement.id,
      trainingId,
      userId,
    },
    transaction,
  });

  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }

  await abonement.save({ transaction });
};

export const cancelNotHeldTrainings = async (abonementId: number) => {
  const abonement = await db.Abonement.findByPk(abonementId, {
    include: [
      {
        model: db.Training,
        as: 'visitedTrainings',
        include: [
          {
            model: db.User,
            as: 'visitors',
            through: { attributes: [] },
          },
        ],
      },
    ],
  });

  if (!abonement) {
    throw ApiError.NotFound({ error: 'Abonement not found.' });
  }

  const transaction = await db.sequelize.transaction();
  const updatedTrainings = [];

  try {
    for (const training of abonement.visitedTrainings) {
      const canProceed = canTrainingProceed(
        training.date,
        training.visitors.length,
      );
      if (!canProceed) {
        await handleReturn(
          abonement,
          training.id,
          abonement.userId,
          transaction,
        );
        updatedTrainings.push(training.id);
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  if (updatedTrainings.length > 0) {
    const trainings = await db.Training.findAll({
      where: {
        id: updatedTrainings,
      },
      include: [
        {
          model: db.User,
          as: 'instructor',
          attributes: ['firstName', 'lastName'],
        },
        {
          model: db.User,
          as: 'visitors',
          attributes: ['firstName', 'lastName'],
          through: { attributes: [] },
        },
      ],
    });
    await abonement.reload();
    return { trainingsCanceled: true, abonement, trainings };
  }

  return { trainingsCanceled: false };
};
