import Abonement from '../db/models/Abonement.js';
import Training from '../db/models/Training.js';
import { ApiError } from '../exceptions/api.error.js';
import { canTrainingProceed } from '../utils/index.js';
export const updateReservation = async (
  abonementId,
  trainingId,
  userId,
  updateType,
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
        // select: 'firstName lastName',
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

  if (new Date(abonement.expiratedAt) < new Date()) {
    abonement.status = 'expired';
    await abonement.save();
    throw ApiError.BadRequest('Abonement has expired!');
  }

  const trainer = await User.findById(training.instructor.id);
  if (!trainer) {
    throw ApiError.BadRequest('Invalid training instructor');
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

    return {
      updatedAbonement: abonement,
      updatedTraining: training,
    };
  } catch (error) {
    throw error;
  }
};
const handleReservation = async (abonement, training, trainer) => {
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
  trainer.trainings.push(training._id);
  // Update the Abonement: decrement left count, set status if needed
  abonement.left -= 1;
  if (abonement.left === 0) {
    abonement.status = 'ended';
  }

  await Promise.all([abonement.save(), training.save(), trainer.save()]);
};
const handleCancellation = async (abonement, training, trainer) => {
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
  trainer.trainings = removeTraining(trainer.trainings, training._id);
  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }
  // Reload the models to get the updated data without re-fetching everything
  await Promise.all([abonement.save(), training.save(), trainer.save()]);
};
const handleReturn = async (abonement, trainingId, userId) => {
  const training = await Training.findById(trainingId);
  const trainer = await User.findById(training.instructor.id);
  if (!trainer) {
    throw ApiError.BadRequest('Invalid training instructor');
  }
  // Remove the training from visitedTrainings and user from visitors
  abonement.visitedTrainings = removeTraining(
    abonement.visitedTrainings,
    trainingId,
  );
  training.visitors = removeVisitor(training.visitors, userId);
  trainer.trainings = removeTraining(trainer.trainings, training);
  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }
  // Reload the models to get the updated data without re-fetching everything
  await Promise.all([abonement.save(), training.save(), trainer.save()]);
};
export const cancelNotHeldTrainings = async abonementId => {
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
        path: 'instructor',
        select: 'firstName lastName',
      },
      {
        path: 'visitors',
        select: 'firstName lastName',
      },
    ]);

    return { abonement, trainings };
  }
  return null;
};
// Helper functions
const isTrainingReserved = (abonement, training) => {
  // return abonement.visitedTrainings.some(
  //   visitedTraining =>
  //     visitedTraining._id.toString() === training._id.toString(),
  // );

  return training.visitors.some(
    visitor => visitor.id.toString() === abonement.user.toString(),
  );
};
const isAbonementActive = abonement => {
  return abonement.status === 'inactive' || abonement.status === 'active';
};
const activateAbonement = abonement => {
  const currentDate = new Date();
  const expirationDate = new Date(currentDate);
  expirationDate.setMonth(currentDate.getMonth() + 1);
  abonement.activatedAt = currentDate;
  abonement.expiratedAt = expirationDate;
  abonement.status = 'active';
};
const removeTraining = (trainings, trainingId) => {
  return trainings.filter(visitedTraining => {
    const visitedTrainingId = visitedTraining._id
      ? visitedTraining._id.toString()
      : visitedTraining.toString();
    return visitedTrainingId !== trainingId.toString();
  });
};
const removeVisitor = (visitors, userId) => {
  return visitors.filter(visitor => {
    const visitorId = visitor._id ? visitor._id.toString() : visitor.toString();
    return visitorId !== userId.toString();
  });
};
