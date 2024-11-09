import Abonement from '../db/mdbmodels/Abonement';
import User from '../db/mdbmodels/User';
import Training, { ITraining } from '../db/mdbmodels/Training';
import History from '../db/mdbmodels/History';
import { ApiError } from '../exceptions/api.error';
import { canTrainingProceed } from '../utils';

export const updateReservation = async (
  abonementId: string,
  trainingId: string,
  userId: string,
  updateType: 'reservation' | 'cancellation',
) => {
  // Fetch relevant data with necessary associations
  const [abonement, training, user] = await Promise.all([
    Abonement.findById(abonementId).populate({
      path: 'visitedTrainings',
      select: '-capacity',
    }),
    Training.findById(trainingId).populate([
      {
        path: 'instructorId',
        select: 'firstName lastName',
      },
      {
        path: 'visitors',
        select: 'firstName lastName',
      },
    ]),
    User.findById(userId),
  ]);

  if (!user || !abonement || !training) {
    throw ApiError.NotFound({
      error: 'User, Abonement, or Training not found.',
    });
  }

  try {
    switch (updateType) {
      case 'reservation':
        await handleReservation(abonement, training, user);
        break;
      case 'cancellation':
        await handleCancellation(abonement, training, user);
        break;
      default:
        throw ApiError.BadRequest('Invalid updateType');
    }

    // Reload the models to get the updated data without re-fetching everything
    await Promise.all([abonement.save(), training.save()]);

    return {
      updatedAbonement: abonement,
      updatedTraining: training,
    };
  } catch (error) {
    throw error;
  }
};

const handleReservation = async (abonement: any, training: any, user: any) => {
  // Check if the user has already reserved the training
  const hasVisited = await History.findOne({
    abonementId: abonement._id,
    trainingId: training._id,
    userId: user._id,
  });
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
  await new History({
    abonementId: abonement._id,
    trainingId: training._id,
    userId: user._id,
  }).save();

  // Update the Abonement: decrement left count, set status if needed
  abonement.left -= 1;
  if (abonement.left === 0) {
    abonement.status = 'ended';
  }

  await abonement.save();
};

const handleCancellation = async (abonement: any, training: any, user: any) => {
  // Check if the user has a reservation for the training
  const hasVisited = await History.findOne({
    abonementId: abonement._id,
    trainingId: training._id,
    userId: user._id,
  });
  if (!hasVisited) {
    throw ApiError.BadRequest('Not reserved: You have not reserved a place!');
  }

  // Remove the history record
  await History.deleteOne({
    abonementId: abonement._id,
    trainingId: training._id,
    userId: user._id,
  });

  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }

  await abonement.save();
};

const handleReturn = async (abonement: any, trainingId: any, userId: any) => {
  // Remove the history record
  await History.deleteOne({
    abonementId: abonement._id,
    trainingId,
    userId,
  });

  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }

  await abonement.save();
};

export const cancelNotHeldTrainings = async (abonementId: string) => {
  const abonement = await Abonement.findById(abonementId).populate({
    path: 'visitedTrainings',
    populate: {
      path: 'visitors',
      select: 'firstName lastName',
    },
  });

  if (!abonement) {
    throw ApiError.NotFound({ error: 'Abonement not found.' });
  }

  const updatedTrainings = [];

  try {
    for (const training of abonement.visitedTrainings) {
      const canProceed = canTrainingProceed(
        training.date,
        training.visitors.length,
      );
      if (!canProceed) {
        await handleReturn(abonement, training._id, abonement.user);
        updatedTrainings.push(training._id);
      }
    }
  } catch (error) {
    throw error;
  }

  if (updatedTrainings.length > 0) {
    const trainings = await Training.find({
      _id: { $in: updatedTrainings },
    }).populate([
      {
        path: 'instructorId',
        select: 'firstName lastName',
      },
      {
        path: 'visitors',
        select: 'firstName lastName',
      },
    ]);
    await abonement.save();
    return { abonement, trainings };
  }

  return null;
};
