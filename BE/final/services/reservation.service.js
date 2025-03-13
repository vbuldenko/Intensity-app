import { toZonedTime } from 'date-fns-tz';
import Abonement from '../db/models/Abonement.js';
import Reservation from '../db/models/Reservation.js';
import Training from '../db/models/Training.js';
import User from '../db/models/User.js';
import { ApiError } from '../exceptions/api.error.js';
import {
  activateAbonement,
  isTrainingReserved,
  removeTraining,
  canTrainingProceed,
  isCancellationForbidden,
  reservationAccess,
} from '../utils/reservation.helpers.js';
import { timeZone } from '../utils/index.js';

export const updateReservation = async (
  abonementId,
  trainingId,
  userId,
  updateType,
) => {
  if (!abonementId) {
    throw ApiError.BadRequest('Abonement Id is required!');
  }
  const [abonement, training] = await Promise.all([
    Abonement.findById(abonementId).populate({
      path: 'reservations',
    }),
    Training.findById(trainingId).populate([
      {
        path: 'instructor',
        select: 'firstName lastName',
      },
      {
        path: 'reservations',
      },
    ]),
  ]);
  if (!abonement) {
    throw ApiError.NotFound({
      error: 'Abonement not found!',
    });
  }
  if (!training) {
    throw ApiError.NotFound({
      error: 'Training not found!',
    });
  }

  if (abonement.user.toString() !== userId) {
    throw ApiError.BadRequest('Invalid abonement owner');
  }

  if (new Date(abonement.expiratedAt) < toZonedTime(new Date(), timeZone)) {
    abonement.status = 'expired';
    await abonement.save();
    throw ApiError.BadRequest('Abonement has expired!');
  }
  const trainer = await User.findById(training.instructor.id);
  if (!trainer) {
    throw ApiError.BadRequest(
      'Invalid training instructor, ask admin for help',
    );
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
    const [updatedAbonement, updatedTraining] = await Promise.all([
      Abonement.findById(abonementId).populate({
        path: 'reservations',
        populate: {
          path: 'training',
        },
      }),
      Training.findById(trainingId).populate([
        {
          path: 'instructor',
          select: 'firstName lastName',
        },
        {
          path: 'reservations',
          populate: {
            path: 'user',
            select: 'firstName lastName',
          },
        },
      ]),
    ]);
    return {
      updatedAbonement,
      updatedTraining,
    };
  } catch (error) {
    throw error;
  }
};
const handleReservation = async (abonement, training, trainer) => {
  if (isTrainingReserved(abonement, training)) {
    throw ApiError.BadRequest(
      'Already reserved: You have already reserved your place!',
    );
  }

  if (training.reservations.length === training.capacity) {
    throw ApiError.BadRequest('No places left!');
  }

  if (abonement.status === 'ended') {
    throw ApiError.BadRequest('Abonement has ended!');
  }

  if (!reservationAccess(training.date, training.reservations.length)) {
    throw ApiError.BadRequest('Reservation period has passed!');
  }

  if (abonement.status === 'inactive') {
    activateAbonement(abonement, training.date);
  }
  const reservation = new Reservation({
    training: training._id,
    user: abonement.user,
    abonement: abonement._id,
  });
  const newReservation = await reservation.save();
  // Add training to visitedTrainings and user to visitors
  abonement.reservations.push(newReservation._id);
  training.reservations.push(newReservation._id);
  if (!trainer.trainings.some(id => id.equals(training._id))) {
    trainer.trainings.push(training._id);
  }
  // Update the Abonement: decrement left count, set status if needed
  abonement.left -= 1;
  if (abonement.left === 0) {
    abonement.status = 'ended';
  }
  // Reload the models to get the updated data without re-fetching everything
  await Promise.all([abonement.save(), training.save(), trainer.save()]);
};
const handleCancellation = async (abonement, training, trainer) => {
  // Check if the user has a reservation for the training
  if (!isTrainingReserved(abonement, training)) {
    throw ApiError.BadRequest('Not reserved: You have not reserved a place!');
  }
  if (isCancellationForbidden(training.date)) {
    throw ApiError.BadRequest('Cancel forbidden!');
  }
  const reservation = await Reservation.findOneAndDelete({
    abonement: abonement._id,
    training: training._id,
  });

  if (!reservation) {
    throw ApiError.BadRequest('Reservation not found');
  }
  abonement.reservations = abonement.reservations.filter(
    res => res.id.toString() !== reservation.id.toString(),
  );
  training.reservations = training.reservations.filter(
    res => res.id.toString() !== reservation.id.toString(),
  );
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
  console.log('abonement after reservation deletion save', abonement);
};
const handleReturn = async (reservation, abonement) => {
  const training = await Training.findById(reservation.training.id);
  const trainer = await User.findById(reservation.training.instructor);
  if (!trainer) {
    throw ApiError.BadRequest('Invalid training instructor');
  }
  // Remove the training from visitedTrainings and user from visitors
  abonement.reservations = abonement.reservations.filter(
    res => res.id.toString() !== reservation.id.toString(),
  );
  training.reservations = training.reservations.filter(
    res => res.toString() !== reservation.id.toString(),
  );
  if (training.reservations.length < 2) {
    trainer.trainings = removeTraining(trainer.trainings, training.id);
  }
  // Update the Abonement: increment left count, set status if needed
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }

  // Delete the reservation itself
  await Reservation.deleteOne({ _id: reservation.id });
  // Reload the models to get the updated data without re-fetching everything
  await Promise.all([abonement.save(), training.save(), trainer.save()]);
};
export const cancelNotHeldTrainings = async abonementId => {
  const abonement = await Abonement.findById(abonementId).populate({
    path: 'reservations',
    populate: {
      path: 'training',
      // select: 'firstName lastName',
    },
  });

  if (!abonement) {
    throw ApiError.NotFound({ error: 'Abonement not found.' });
  }
  const updatedTrainings = [];
  try {
    for (const reservation of abonement.reservations) {
      const canProceed = canTrainingProceed(
        reservation.training.date,
        reservation.training.reservations.length,
      );
      if (!canProceed) {
        await handleReturn(reservation, abonement);
        updatedTrainings.push(reservation.training.id);
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
        path: 'reservations',
      },
    ]);

    console.log('abonement AFTER CANCEL', abonement);

    return { abonement, trainings };
  }
  return null;
};

export const cancelTrainingByAdmin = async trainingId => {
  const training = await Training.findById(trainingId).populate({
    path: 'instructor',
    select: 'firstName lastName',
  });

  if (!training) {
    throw ApiError.NotFound({ training: 'Not found' });
  }

  if (new Date(training.date) < new Date()) {
    throw ApiError.BadRequest('Cannot cancel a training that is in the past');
  }

  const trainer = await User.findById(training.instructor._id);
  if (!trainer) {
    throw ApiError.NotFound({ trainer: 'Not found' });
  }

  const reservationIds = training.reservations.map(id => id.toString());
  const reservations = await Reservation.find({
    _id: { $in: reservationIds },
  });

  if (reservations.length !== reservationIds.length) {
    throw ApiError.NotFound({
      reservation: 'Some reservations were not found',
    });
  }

  const abonementUpdates = reservations.map(async res => {
    const abonement = await Abonement.findById(res.abonement.toString());
    if (abonement) {
      abonement.reservations = abonement.reservations.filter(
        id => id.toString() !== res._id.toString(),
      );
      abonement.left += 1;
      if (abonement.left > 0 && abonement.status === 'ended') {
        abonement.status = 'active';
      }
      await abonement.save();
    }
  });

  await Promise.all(abonementUpdates);

  await Reservation.deleteMany({ _id: { $in: reservationIds } });

  training.reservations = [];
  training.isCancelled = true;
  trainer.trainings = removeTraining(trainer.trainings, trainingId);

  const [updatedTraining, _] = await Promise.all([
    training.save(),
    trainer.save(),
  ]);

  return updatedTraining;
};
