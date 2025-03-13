import mongoose from 'mongoose';
import {
  updateReservation,
  cancelTrainingByAdmin,
  cancelNotHeldTrainings,
  handleReservation,
} from '../../src/services/reservation.service';
import Abonement from '../../src/db/models/abonement';
import Training from '../../src/db/models/training';
import User from '../../src/db/models/user';
import Reservation from '../../src/db/models/reservation';
import { ApiError } from '../../src/exceptions/api.error';
import { toZonedTime } from 'date-fns-tz';
import { IAbonement } from '../../src/db/models/abonement';
import {
  activateAbonement,
  reservationAccess,
} from '../../src/utils/reservation.helpers';

jest.mock('../../src/db/models/abonement');
jest.mock('../../src/db/models/training');
jest.mock('../../src/db/models/user');
jest.mock('../../src/db/models/reservation');
jest.mock('../../src/utils', () => ({
  reservationAccess: jest.fn(),
}));

describe.skip('Reservation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateReservation', () => {
    describe('should throw an error', () => {
      it('if abonementId is not provided', async () => {
        await expect(
          updateReservation('', 'trainingId', 'userId', 'reservation'),
        ).rejects.toThrow(ApiError.BadRequest('Abonement Id is required!'));
      });

      it('if abonement is not found', async () => {
        (Abonement.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        });
        (Training.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        });
        await expect(
          updateReservation(
            'abonementId',
            'trainingId',
            'userId',
            'reservation',
          ),
        ).rejects.toThrow(ApiError.NotFound({ error: 'Abonement not found.' }));
      });

      it('if training is not found', async () => {
        (Abonement.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue({}),
        });

        (Training.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        });
        await expect(
          updateReservation(
            'abonementId',
            'trainingId',
            'userId',
            'reservation',
          ),
        ).rejects.toThrow(ApiError.NotFound({ error: 'Training not found.' }));
      });

      it('if invalid abonement owner', async () => {
        (Abonement.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            user: { toString: jest.fn().mockReturnValue('id_1') },
          }),
        });

        (Training.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue({}),
        });
        await expect(
          updateReservation('abonementId', 'trainingId', 'id_2', 'reservation'),
        ).rejects.toThrow(ApiError.BadRequest('Invalid abonement owner'));
      });

      it('if abonement expired', async () => {
        (Abonement.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            user: { toString: jest.fn().mockReturnValue('id_1') },
            expiratedAt: new Date(Date.now() - 1000),
            save: jest.fn(),
          }),
        });

        (Training.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue({}),
        });

        await expect(
          updateReservation('abonementId', 'trainingId', 'id_1', 'reservation'),
        ).rejects.toThrow(ApiError.BadRequest('Abonement has expired!'));
      });

      it('if invalid training instructor', async () => {
        (Abonement.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            user: { toString: jest.fn().mockReturnValue('id_1') },
            expiratedAt: new Date(Date.now() + 1000),
            save: jest.fn(),
          }),
        });

        (Training.findById as jest.Mock).mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            instructor: { id: 'instructorId' },
          }),
        });

        (User.findById as jest.Mock).mockResolvedValue(null);

        await expect(
          updateReservation('abonementId', 'trainingId', 'id_1', 'reservation'),
        ).rejects.toThrow(
          ApiError.BadRequest(
            'Invalid training instructor, ask admin for help',
          ),
        );
      });
    });

    describe('handleReservation', () => {
      it('should throw an error if the training is already reserved', async () => {
        const abonement = { user: 'Id_1', reservations: [] };
        const training = { reservations: [{ user: 'Id_1' }] };
        const trainer = { trainings: [] };

        await expect(
          handleReservation(abonement, training, trainer),
        ).rejects.toThrow(
          ApiError.BadRequest(
            'Already reserved: You have already reserved your place!',
          ),
        );
      });

      it('should throw an error if there are no places left', async () => {
        const abonement = { user: 'userId', reservations: [] };
        const training = { reservations: [], capacity: 0 };
        const trainer = { trainings: [] };

        await expect(
          handleReservation(abonement, training, trainer),
        ).rejects.toThrow(ApiError.BadRequest('No places left!'));
      });

      it('should throw an error if the abonement has ended', async () => {
        const abonement = { user: 'userId', status: 'ended', reservations: [] };
        const training = { reservations: [], capacity: 10 };
        const trainer = { trainings: [] };

        await expect(
          handleReservation(abonement, training, trainer),
        ).rejects.toThrow(ApiError.BadRequest('Abonement has ended!'));
      });

      it('should throw an error if the reservation period has passed', async () => {
        const abonement = { user: 'userId', reservations: [] };
        const training = { reservations: [], capacity: 10, date: new Date() };
        const trainer = { trainings: [] };
        (reservationAccess as jest.Mock).mockReturnValue(false);

        await expect(
          handleReservation(abonement, training, trainer),
        ).rejects.toThrow(
          ApiError.BadRequest('Reservation period has passed!'),
        );
      });

      it('should activate the abonement if it is inactive', async () => {
        const abonement: IAbonement = {
          _id: new mongoose.Types.ObjectId(),
          activatedAt: null,
          expiratedAt: null,
          user: 'userId',
          status: 'inactive',
          reservations: [],
          left: 4,
          save: jest.fn(),
        } as any;

        const training = {
          _id: new mongoose.Types.ObjectId(),
          reservations: [],
          capacity: 10,
          date: new Date(),
          save: jest.fn(),
        };

        const trainer = {
          trainings: [],
          save: jest.fn(),
        };

        (reservationAccess as jest.Mock).mockReturnValue(true);
        (Reservation.prototype.save as jest.Mock).mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
        });

        await handleReservation(abonement, training, trainer);

        expect(abonement.status).toBe('active');
        expect(abonement.save).toHaveBeenCalled();
      });

      it('should create a new reservation and update the abonement, training, and trainer', async () => {
        const abonement = {
          user: 'userId',
          status: 'active',
          reservations: [],
          left: 1,
          save: jest.fn(),
        };

        const training = {
          _id: new mongoose.Types.ObjectId(),
          reservations: [],
          capacity: 10,
          date: new Date(),
          save: jest.fn(),
        };

        const trainer = {
          trainings: [],
          save: jest.fn(),
        };

        (reservationAccess as jest.Mock).mockReturnValue(true);
        (Reservation.prototype.save as jest.Mock).mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
        });

        await handleReservation(abonement, training, trainer);

        expect(abonement.reservations.length).toBe(1);
        expect(training.reservations.length).toBe(1);
        expect(trainer.trainings.length).toBe(1);
        expect(abonement.left).toBe(0);
        expect(abonement.status).toBe('ended');
        expect(abonement.save).toHaveBeenCalled();
        expect(training.save).toHaveBeenCalled();
        expect(trainer.save).toHaveBeenCalled();
      });
    });
  });
});

describe.skip('activateAbonement', () => {
  it('should set the activation and expiration dates correctly', () => {
    const mockAbonement: IAbonement = {
      activatedAt: null,
      expiratedAt: null,
      status: 'inactive',
      user: 'userId',
      left: 10,
    } as any;

    const trainingDate = new Date('2023-01-01T10:00:00Z');
    const expectedActivationDate = new Date(trainingDate);
    const expectedExpirationDate = new Date(expectedActivationDate);
    expectedExpirationDate.setMonth(expectedActivationDate.getMonth() + 1);

    activateAbonement(mockAbonement, trainingDate);

    expect(mockAbonement.activatedAt).toEqual(expectedActivationDate);
    expect(mockAbonement.expiratedAt).toEqual(expectedExpirationDate);
    expect(mockAbonement.status).toBe('active');
  });

  it('should set the status to active', () => {
    const mockAbonement: IAbonement = {
      activatedAt: null,
      expiratedAt: null,
      status: 'inactive',
      user: 'userId',
      left: 10,
    } as any;

    const trainingDate = new Date('2023-01-01T10:00:00Z');

    activateAbonement(mockAbonement, trainingDate);

    expect(mockAbonement.status).toBe('active');
  });
});
