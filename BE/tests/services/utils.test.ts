import { isToday } from 'date-fns';
import {
  calculateHoursDiff,
  isCancellationForbidden,
  // isTomorrow,
} from '../../src/utils/index';
import { toZonedTime } from 'date-fns-tz';

// jest.mock('date-fns-tz', () => ({
//   toZonedTime: jest.fn(),
// }));

// jest.mock('../../src/utils/index', () => ({
//   calculateHoursDiff: jest.fn(),
//   isTomorrow: jest.fn(),
//   isToday: jest.fn(),
// }));

describe('isCancellationForbidden', () => {
  // const mockCurrentTime = new Date('2023-01-01T20:00:00Z');
  const mockTrainingTime = '2025-03-07T09:00:00Z';

  // beforeEach(() => {
  //   jest.clearAllMocks();
  //   (toZonedTime as jest.Mock).mockImplementation(date => date);
  //   (calculateHoursDiff as jest.Mock).mockReturnValue(5);
  //   (isTomorrow as jest.Mock).mockReturnValue(false);
  //   // (isToday as jest.Mock).mockReturnValue(false);
  // });

  it('should return true if hours difference is less than 3', () => {
    // (calculateHoursDiff as jest.Mock).mockReturnValue(2);
    const mockCurrentTime = '2025-03-07T08:00:00Z';
    expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
      true,
    );
  });

  describe('Today cancel at >= 00 a.m. Kyiv timezone for today 9, 10, 11 a.m training', () => {
    const mockTrainingTime = '2025-03-08T09:00:00Z';

    it('should return true at 00 a.m.', () => {
      const mockCurrentTime = '2025-03-07T22:00:00Z';
      expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
        true,
      );
    });

    it('should return true after 00 a.m.', () => {
      const mockCurrentTime = '2025-03-07T23:42:00Z';
      expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
        true,
      );
    });

    it('should return true after 1 a.m.', () => {
      const mockCurrentTime = '2025-03-07T00:42:00Z';
      expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
        true,
      );
    });
  });

  describe('Today cancel at >= 21 p.m. Kyiv timezone for tomorrow 9, 10, 11 a.m training', () => {
    const mockTrainingTime = '2025-03-09T08:00:00Z';

    it('should return true at 21 p.m.', () => {
      const mockCurrentTime = '2025-03-08T19:00:00Z';
      expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
        true,
      );
    });

    it('should return true at > 22 p.m.', () => {
      const mockCurrentTime = '2025-03-08T20:42:00Z';
      expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
        true,
      );
    });

    it('should return true at 23 p.m.', () => {
      const mockCurrentTime = '2025-03-08T21:01:00Z';
      expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
        true,
      );
    });
  });

  // it('should return true if hours difference === 3', () => {
  //   // (calculateHoursDiff as jest.Mock).mockReturnValue(2);
  //   const mockCurrentTime = '2025-03-07T06:00:00Z';
  //   expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
  //     false,
  //   );
  // });

  // it('should return true if it is late reservation update and early morning training', () => {
  //   (toZonedTime as jest.Mock).mockImplementation(date => {
  //     if (date === mockCurrentTime) return new Date('2023-01-01T21:00:00Z');
  //     if (date === mockTrainingTime) return new Date('2023-01-02T09:00:00Z');
  //     return date;
  //   });
  //   (isTomorrow as jest.Mock).mockReturnValue(true);
  //   expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
  //     true,
  //   );
  // });

  // it('should return true if it is early reservation update and early morning training', () => {
  //   (toZonedTime as jest.Mock).mockImplementation(date => {
  //     if (date === mockCurrentTime) return new Date('2023-01-01T07:00:00Z');
  //     if (date === mockTrainingTime) return new Date('2023-01-01T09:00:00Z');
  //     return date;
  //   });
  //   (isToday as jest.Mock).mockReturnValue(true);
  //   expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
  //     true,
  //   );
  // });

  it('should return false if none of the conditions are met', () => {
    const mockCurrentTime = '2025-03-06T08:00:00Z';
    expect(isCancellationForbidden(mockTrainingTime, mockCurrentTime)).toBe(
      false,
    );
  });
});
