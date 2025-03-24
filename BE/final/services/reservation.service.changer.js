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
} from '../utils/reservation.helpers.js';
import { timeZone } from '../utils/index.js';

/**
 * Update reservation status (create or cancel)
 * @param {string} abonementId - ID of the abonement
 * @param {string} trainingId - ID of the training
 * @param {string} userId - ID of the user
 * @param {string} updateType - 'reservation' or 'cancellation'
 * @returns {Object} Updated abonement and training
 */
export const updateReservation = async (
  abonementId,
  trainingId,
  userId,
  updateType,
) => {
  // Validate required parameters
  if (!abonementId) {
    throw ApiError.BadRequest('Abonement Id is required!');
  }

  // Fetch required data
  const [abonement, training] = await fetchRequiredData(
    abonementId,
    trainingId,
  );

  // Validate abonement status
  validateAbonementStatus(abonement);

  // Get trainer data
  const trainer = await getTrainer(training);

  try {
    // Handle reservation or cancellation based on updateType
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

    // Return updated data
    return await getUpdatedData(abonementId, trainingId);
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch abonement and training data
 */
async function fetchRequiredData(abonementId, trainingId) {
  const [abonement, training] = await Promise.all([
    Abonement.findById(abonementId).populate('reservations'),
    Training.findById(trainingId).populate([
      { path: 'instructor', select: 'firstName lastName' },
      { path: 'reservations' },
    ]),
  ]);

  if (!abonement) {
    throw ApiError.NotFound({ error: 'Abonement not found!' });
  }

  if (!training) {
    throw ApiError.NotFound({ error: 'Training not found!' });
  }

  return [abonement, training];
}

/**
 * Validate abonement status
 */
function validateAbonementStatus(abonement) {
  const currentTime = toZonedTime(new Date(), timeZone);

  if (new Date(abonement.expiratedAt) < currentTime) {
    abonement.status = 'expired';
    abonement.save();
    throw ApiError.BadRequest('Abonement has expired!');
  }
}

/**
 * Get trainer data
 */
async function getTrainer(training) {
  const trainer = await User.findById(training.instructor.id);

  if (!trainer) {
    throw ApiError.BadRequest(
      'Invalid training instructor, ask admin for help',
    );
  }

  return trainer;
}

/**
 * Handle reservation creation
 */
async function handleReservation(abonement, training, trainer) {
  // Check if already reserved
  if (isTrainingReserved(abonement, training)) {
    throw ApiError.BadRequest(
      'Already reserved: You have already reserved your place!',
    );
  }

  // Validate abonement status
  if (abonement.status === 'ended') {
    throw ApiError.BadRequest('Abonement has ended!');
  }

  // Activate inactive abonement
  if (abonement.status === 'inactive') {
    activateAbonement(abonement, training.date);
  }

  // Create new reservation
  const reservation = await createReservation(abonement, training);

  // Update related documents
  updateDocumentsForReservation(abonement, training, trainer, reservation);

  // Save all changes
  await saveChanges(abonement, training, trainer);
}

/**
 * Create a new reservation
 */
async function createReservation(abonement, training) {
  const reservation = new Reservation({
    training: training._id,
    user: abonement.user,
    abonement: abonement._id,
  });

  return await reservation.save();
}

/**
 * Update documents after creating a reservation
 */
function updateDocumentsForReservation(
  abonement,
  training,
  trainer,
  reservation,
) {
  // Add reservation to abonement and training
  abonement.reservations.push(reservation._id);
  training.reservations.push(reservation._id);

  // Add training to trainer if needed
  if (!trainer.trainings.some(id => id.equals(training._id))) {
    trainer.trainings.push(training._id);
  }

  // Update abonement count and status
  abonement.left -= 1;
  if (abonement.left === 0) {
    abonement.status = 'ended';
  }
}

/**
 * Handle reservation cancellation
 */
async function handleCancellation(abonement, training, trainer) {
  // Check if reservation exists
  if (!isTrainingReserved(abonement, training)) {
    throw ApiError.BadRequest('Not reserved: You have not reserved a place!');
  }

  // Find and delete reservation
  const reservation = await Reservation.findOneAndDelete({
    abonement: abonement._id,
    training: training._id,
  });

  if (!reservation) {
    throw ApiError.BadRequest('Reservation not found');
  }

  // Update related documents
  updateDocumentsForCancellation(abonement, training, trainer, reservation);

  // Save all changes
  await saveChanges(abonement, training, trainer);
}

/**
 * Update documents after cancelling a reservation
 */
function updateDocumentsForCancellation(
  abonement,
  training,
  trainer,
  reservation,
) {
  // Remove reservation from abonement and training
  abonement.reservations = abonement.reservations.filter(
    res => res.id.toString() !== reservation.id.toString(),
  );

  training.reservations = training.reservations.filter(
    res => res.id.toString() !== reservation.id.toString(),
  );

  // Remove training from trainer if needed
  if (training.reservations.length < 2) {
    trainer.trainings = removeTraining(trainer.trainings, training._id);
  }

  // Update abonement count and status
  abonement.left += 1;
  if (abonement.left > 0 && abonement.status === 'ended') {
    abonement.status = 'active';
  }
}

/**
 * Save changes to all documents
 */
async function saveChanges(abonement, training, trainer) {
  await Promise.all([abonement.save(), training.save(), trainer.save()]);
}

/**
 * Get updated abonement and training data
 */
async function getUpdatedData(abonementId, trainingId) {
  const [updatedAbonement, updatedTraining] = await Promise.all([
    Abonement.findById(abonementId).populate({
      path: 'reservations',
      populate: { path: 'training' },
    }),
    Training.findById(trainingId).populate([
      { path: 'instructor', select: 'firstName lastName' },
      {
        path: 'reservations',
        populate: { path: 'user', select: 'firstName lastName' },
      },
    ]),
  ]);

  return { updatedAbonement, updatedTraining };
}
