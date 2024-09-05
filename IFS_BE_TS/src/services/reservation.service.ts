import db from '../db/models';
import { ApiError } from '../exceptions/api.error';
import { Training } from '../types/Training';

export const updateReservation = async (
  abonementId: number,
  trainingId: number,
  userId: number,
  updateType: 'reservation' | 'cancellation',
) => {
  // Fetch relevant data once with necessary associations
  const [abonement, training, user] = await Promise.all([
    db.Abonement.findByPk(abonementId),
    db.Training.findByPk(trainingId),
    db.User.findByPk(userId),
  ]);
  console.log('Models --- ', abonement);

  if (!user || !abonement || !training) {
    throw ApiError.NotFound({
      error: 'User, Abonement, or Training not found.',
    });
  }

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

  // Fetch updated abonement and training with includes in a single query
  const updatedData = await Promise.all([
    db.Abonement.findByPk(abonement.id, {
      include: [{ model: db.Training, as: 'trainings' }],
    }),
    db.Training.findByPk(training.id, {
      include: [{ model: db.User, as: 'visitors' }],
    }),
  ]);

  return {
    abonement: updatedData[0],
    training: updatedData[1],
  };
};

const handleReservation = async (abonement, training, user) => {
  try {
    // Directly attempt to create the reservation in the History table
    await db.History.create({
      abonementId: abonement.id,
      trainingId: training.id,
      userId: user.id,
    });

    // Update abonement fields and save changes in parallel
    abonement.left -= 1;
    if (abonement.left === 0) abonement.status = 'ended';

    await abonement.save();
  } catch (error) {
    // Handle error if the reservation already exists
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.BadRequest(
        'Already reserved: You have already reserved your place!',
      );
    }
    throw error;
  }
};

const handleCancellation = async (abonement, training, user) => {
  const rowsDeleted = await db.History.destroy({
    where: {
      abonementId: abonement.id,
      trainingId: training.id,
      userId: user.id,
    },
  });

  // Check if a reservation was actually deleted
  if (rowsDeleted === 0) {
    throw ApiError.BadRequest('Not reserved: You have not reserved a place!');
  }

  // Update abonement fields and save changes in parallel
  abonement.left += 1;
  if (abonement.status === 'ended') abonement.status = 'active';

  await abonement.save();
};
