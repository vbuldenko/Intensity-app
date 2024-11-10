import Abonement, { IAbonement } from '../db/models/abonement';
import Training, { ITraining } from '../db/models/training';
import { ApiError } from '../exceptions/api.error';
import { canTrainingProceed } from '../utils';

export const updateReservation = async (
  abonementId: string,
  trainingId: string,
  userId: string,
  updateType: 'reservation' | 'cancellation',
) => {
  // Fetch relevant data with necessary associations
  const [abonement, training] = await Promise.all([
    Abonement.findById(abonementId).populate({
      path: 'visitedTrainings',
      select: '-capacity',
    }),
    Training.findById(trainingId).populate([
      {
        path: 'instructor',
        select: 'firstName lastName',
      },
      {
        path: 'visitors',
        select: 'firstName lastName',
      },
    ]),
  ]);

  if (!abonement || !training) {
    throw ApiError.NotFound({
      error: 'Abonement, or Training not found.',
    });
  }
  if (abonement.user.toString() !== userId) {
    throw ApiError.BadRequest('Invalid abonement owner');
  }

  try {
    switch (updateType) {
      case 'reservation':
        await handleReservation(abonement, training);
        break;
      case 'cancellation':
        await handleCancellation(abonement, training);
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

const handleReservation = async (abonement: any, training: any) => {
  // Check if the user has already reserved the training
  if (isTrainingReserved(abonement, training)) {
    throw ApiError.BadRequest(
      'Already reserved: You have already reserved your place!',
    );
  }

  if (!isAbonementActive(abonement)) {
    throw ApiError.BadRequest('Abonement has ended!');
  }

  if (abonement.status === 'inactive') {
    activateAbonement(abonement);
  }

  // Add training to visitedTrainings and user to visitors
  abonement.visitedTrainings.push(training._id);
  training.visitors.push(abonement.user);

  // Update the Abonement: decrement left count, set status if needed
  abonement.left -= 1;
  if (abonement.left === 0) {
    abonement.status = 'ended';
  }

  await abonement.save();
  await training.save();
};

const handleCancellation = async (abonement: any, training: any) => {
  // Check if the user has a reservation for the training
  if (!isTrainingReserved(abonement, training)) {
    throw ApiError.BadRequest('Not reserved: You have not reserved a place!');
  }

  // Remove the training from visitedTrainings and user from visitors
  abonement.visitedTrainings = removeTraining(
    abonement.visitedTrainings,
    training._id,
  );
  training.visitors = removeVisitor(training.visitors, abonement.user);

  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }

  await abonement.save();
  await training.save();
};

const handleReturn = async (abonement: any, trainingId: any, userId: any) => {
  const training = (await Training.findById(trainingId)) as ITraining;

  // Remove the training from visitedTrainings and user from visitors
  abonement.visitedTrainings = removeTraining(
    abonement.visitedTrainings,
    trainingId,
  );
  training.visitors = removeVisitor(training.visitors, userId);

  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }

  await abonement.save();
  await training.save();
};

export const cancelNotHeldTrainings = async (abonementId: string) => {
  const abonement = (await Abonement.findById(abonementId).populate({
    path: 'visitedTrainings',
    populate: {
      path: 'visitors',
      select: 'firstName lastName',
    },
  })) as IAbonement;

  if (!abonement) {
    throw ApiError.NotFound({ error: 'Abonement not found.' });
  }

  const updatedTrainings: string[] = [];

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

// Helper functions
const isTrainingReserved = (abonement: any, training: any) => {
  return abonement.visitedTrainings.some(
    (visitedTraining: any) =>
      visitedTraining._id.toString() === training._id.toString(),
  );
};

const isAbonementActive = (abonement: any) => {
  return abonement.status === 'inactive' || abonement.status === 'active';
};

const activateAbonement = (abonement: any) => {
  const currentDate = new Date();
  const expirationDate = new Date(currentDate);
  expirationDate.setMonth(currentDate.getMonth() + 1);

  abonement.activatedAt = currentDate;
  abonement.expiratedAt = expirationDate;
  abonement.status = 'active';
};

const removeTraining = (trainings: any[], trainingId: any) => {
  return trainings.filter((visitedTraining: any) => {
    const visitedTrainingId = visitedTraining._id
      ? visitedTraining._id.toString()
      : visitedTraining.toString();
    return visitedTrainingId !== trainingId.toString();
  });
};

const removeVisitor = (visitors: any[], userId: any) => {
  return visitors.filter((visitor: any) => {
    const visitorId = visitor._id ? visitor._id.toString() : visitor.toString();
    return visitorId !== userId.toString();
  });
};
