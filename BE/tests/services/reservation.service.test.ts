import mongoose from 'mongoose';
import {
  updateReservation,
  cancelTrainingByAdmin,
  cancelNotHeldTrainings,
  activateAbonement,
} from '../../src/services/reservation.service';
import Abonement from '../../src/db/models/abonement';
import Training from '../../src/db/models/training';
import User from '../../src/db/models/user';
import Reservation from '../../src/db/models/reservation';
import { ApiError } from '../../src/exceptions/api.error';
import { toZonedTime } from 'date-fns-tz';
import { timeZone } from '../../src/utils/trainingInitiator';
import { IAbonement } from '../../src/db/models/abonement';

jest.mock('../../src/db/models/abonement');
jest.mock('../../src/db/models/training');
jest.mock('../../src/db/models/user');
jest.mock('../../src/db/models/reservation');

describe('Reservation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateReservation', () => {
    it('should throw an error if abonementId is not provided', async () => {
      await expect(
        updateReservation('', 'trainingId', 'userId', 'reservation'),
      ).rejects.toThrow(ApiError.BadRequest('Abonement Id is required!'));
    });

    it('should throw an error if abonement is not found', async () => {
      (Abonement.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      (Training.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      await expect(
        updateReservation('abonementId', 'trainingId', 'userId', 'reservation'),
      ).rejects.toThrow(ApiError.NotFound({ error: 'Abonement not found.' }));
    });

    // it('should throw an error if training is not found', async () => {
    //   (Abonement.findById as jest.Mock).mockResolvedValue({});
    //   (Training.findById as jest.Mock).mockResolvedValue(null);
    //   await expect(
    //     updateReservation('abonementId', 'trainingId', 'userId', 'reservation'),
    //   ).rejects.toThrow(ApiError.NotFound({ error: 'Training not found.' }));
    // });

    // Add more tests for different scenarios
  });

  // describe('cancelTrainingByAdmin', () => {
  //   it('should throw an error if training is not found', async () => {
  //     (Training.findById as jest.Mock).mockResolvedValue(null);
  //     await expect(cancelTrainingByAdmin('trainingId')).rejects.toThrow(
  //       ApiError.NotFound({ training: 'Not found' }),
  //     );
  //   });

  //   it('should throw an error if training is in the past', async () => {
  //     (Training.findById as jest.Mock).mockResolvedValue({
  //       date: new Date(Date.now() - 1000),
  //     });
  //     await expect(cancelTrainingByAdmin('trainingId')).rejects.toThrow(
  //       ApiError.BadRequest('Cannot cancel a training that is in the past'),
  //     );
  //   });

  //   // Add more tests for different scenarios
  // });

  // describe('cancelNotHeldTrainings', () => {
  //   it('should throw an error if abonement is not found', async () => {
  //     (Abonement.findById as jest.Mock).mockResolvedValue(null);
  //     await expect(cancelNotHeldTrainings('abonementId')).rejects.toThrow(
  //       ApiError.NotFound({ error: 'Abonement not found.' }),
  //     );
  //   });

  //   it('should handle returning reservations for not held trainings', async () => {
  //     const mockAbonement = {
  //       _id: 'abonementId',
  //       reservations: [
  //         {
  //           training: {
  //             date: new Date(Date.now() + 1000),
  //             reservations: [],
  //           },
  //         },
  //       ],
  //     };
  //     (Abonement.findById as jest.Mock).mockResolvedValue(mockAbonement);
  //     (Reservation.findById as jest.Mock).mockResolvedValue({
  //       _id: 'reservationId',
  //     });
  //     (Training.findById as jest.Mock).mockResolvedValue({
  //       _id: 'trainingId',
  //       reservations: [],
  //     });
  //     (User.findById as jest.Mock).mockResolvedValue({ _id: 'userId' });

  //     const result = await cancelNotHeldTrainings('abonementId');
  //     expect(result).toBeDefined();
  //   });

  //   // Add more tests for different scenarios
  // });
});

describe('activateAbonement', () => {
  it('should set the activation and expiration dates correctly', () => {
    const mockAbonement: IAbonement = {
      activatedAt: null,
      expiratedAt: null,
      status: 'inactive',
      user: 'userId', // Add any other required properties
      left: 10, // Example property
    } as any;

    const trainingDate = new Date('2023-01-01T10:00:00Z');
    const expectedActivationDate = toZonedTime(
      new Date(trainingDate),
      timeZone,
    );
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
      user: 'userId', // Add any other required properties
      left: 10, // Example property
    } as any;

    const trainingDate = new Date('2023-01-01T10:00:00Z');

    activateAbonement(mockAbonement, trainingDate);

    expect(mockAbonement.status).toBe('active');
  });
});
