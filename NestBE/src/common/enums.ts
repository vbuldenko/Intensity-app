export enum UserRole {
  CLIENT = 'client',
  TRAINER = 'trainer',
  ADMIN = 'admin',
}

export enum TrainingStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  ACTIVE = 'active',
}

export enum AbonementType {
  GROUP = 'group',
  PERSONAL = 'personal',
  SPLIT = 'split',
}

export enum AbonementStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
}

export enum TrainingFormat {
  GROUP = 'group',
  PERSONAL = 'personal',
  SPLIT = 'split',
}

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
}

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}
