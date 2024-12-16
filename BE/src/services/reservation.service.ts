import mongoose from 'mongoose';
import Abonement, { IAbonement } from '../db/models/abonement';
import Reservation from '../db/models/reservation';
import Training, { ITraining } from '../db/models/training';
import User, { IUser } from '../db/models/user';
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
      path: 'reservations',
      // populate: {
      //   path: 'training',
      // },
    }),
    Training.findById(trainingId).populate([
      {
        path: 'instructor',
        select: 'firstName lastName',
      },
      {
        path: 'reservations',
        // populate: [
        //   {
        //     path: 'user',
        //   },
        //   {
        //     path: 'abonement',
        //   },
        // ],
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
        await handleReservation(abonement, training, trainer);
        break;
      case 'cancellation':
        await handleCancellation(abonement, training, trainer);
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

const handleReservation = async (
  abonement: any,
  training: any,
  trainer: any,
) => {
  // Check if the user has already reserved the training
  if (isTrainingReserved(abonement, training)) {
    throw ApiError.BadRequest(
      'Already reserved: You have already reserved your place!',
    );
  }

  if (abonement.status === 'ended') {
    throw ApiError.BadRequest('Abonement has ended!');
  }

  if (abonement.status === 'inactive') {
    activateAbonement(abonement);
  }

  const reservation = new Reservation({
    training: training._id,
    user: abonement.user,
    abonement: abonement._id,
    status: 'active',
  });

  const newReservation = await reservation.save();

  // Add training to visitedTrainings and user to visitors
  abonement.reservations.push(newReservation._id);
  training.reservations.push(newReservation._id);
  // Ensure training._id is an ObjectId
  const trainingId = mongoose.Types.ObjectId(training._id);

  if (
    !trainer.trainings.some((id: mongoose.Types.ObjectId) =>
      id.equals(trainingId),
    )
  ) {
    trainer.trainings.push(trainingId);
  }
  // Update the Abonement: decrement left count, set status if needed
  abonement.left -= 1;
  if (abonement.left === 0) {
    abonement.status = 'ended';
  }

  // Reload the models to get the updated data without re-fetching everything
  await Promise.all([abonement.save(), training.save(), trainer.save()]);
};

const handleCancellation = async (
  abonement: any,
  training: any,
  trainer: any,
) => {
  // Check if the user has a reservation for the training
  if (!isTrainingReserved(abonement, training)) {
    throw ApiError.BadRequest('Not reserved: You have not reserved a place!');
  }

  const reservation = await Reservation.findOneAndDelete({
    abonement: abonement._id,
    training: training._id,
  });

  if (training.reservations.length < 2) {
    trainer.trainings = removeTraining(trainer.trainings, training._id);
  }

  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }

  // Reload the models to get the updated data without re-fetching everything
  await Promise.all([abonement.save(), training.save(), trainer.save()]);
};

const handleReturn = async (abonement: any, trainingId: any, userId: any) => {
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
const isTrainingReserved = (abonement: any, training: any) => {
  return training.reservations.some(
    (reservation: any) =>
      reservation.user.toString() === abonement.user.toString(),
  );
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
  return trainings.filter((t: any) => {
    const tId = t._id ? t._id.toString() : t.toString();
    return tId !== trainingId.toString();
  });
};
