interface TrainingStats {
  totalTrainingsHeld: number;
  totalAbonementsSold: number;
  revenueFromAbonements: number;
  attendanceRate: {
    trainingId: number;
    trainingName: string;
    totalSpots: number;
    attendees: number;
    attendancePercentage: number;
  }[];
  topTrainersByAttendance: {
    trainerId: number;
    trainerName: string;
    totalAttendees: number;
  }[];
  topClientsByAbonements: {
    clientId: number;
    clientName: string;
    abonementsPurchased: number;
  }[];
  trainingPopularity: {
    trainingId: number;
    trainingName: string;
    attendeesCount: number;
  }[];
  abonementExpiryStatus: {
    activeAbonements: number;
    expiringSoon: number;
    expiredAbonements: number;
  };
  // trainingFeedbackScores: {
  //   trainingId: number;
  //   trainingName: string;
  //   averageScore: number;
  //   totalReviews: number;
  // }[];
  clientRetentionRate: number; // in percentage
  abonementDurationAnalysis: {
    shortTerm: number; // abonements for 1 month
    midTerm: number; // abonements for 3 months
    longTerm: number; // abonements for 6+ months
  };
  expenses: {
    rent: number;
    utilities: number;
    taxes: number;
    wages: number;
  };
  income: {
    daily: number;
    monthly: number;
  };
  profit: {
    daily: number;
    monthly: number;
  };
}

export const studioStats: TrainingStats = {
  totalTrainingsHeld: 120,
  totalAbonementsSold: 250,
  revenueFromAbonements: 15000,
  attendanceRate: [
    {
      trainingId: 1,
      trainingName: "Yoga",
      totalSpots: 30,
      attendees: 28,
      attendancePercentage: 93.33,
    },
    {
      trainingId: 2,
      trainingName: "Pilates",
      totalSpots: 25,
      attendees: 20,
      attendancePercentage: 80,
    },
  ],
  topTrainersByAttendance: [
    { trainerId: 1, trainerName: "John Doe", totalAttendees: 200 },
    { trainerId: 2, trainerName: "Jane Smith", totalAttendees: 180 },
  ],
  topClientsByAbonements: [
    { clientId: 1, clientName: "Alice Johnson", abonementsPurchased: 5 },
    { clientId: 2, clientName: "Bob Lee", abonementsPurchased: 4 },
  ],
  trainingPopularity: [
    { trainingId: 1, trainingName: "Yoga", attendeesCount: 150 },
    { trainingId: 2, trainingName: "Pilates", attendeesCount: 120 },
  ],
  abonementExpiryStatus: {
    activeAbonements: 200,
    expiringSoon: 30,
    expiredAbonements: 20,
  },
  clientRetentionRate: 75.5,
  abonementDurationAnalysis: {
    shortTerm: 100,
    midTerm: 80,
    longTerm: 70,
  },
  expenses: {
    rent: 30000,
    utilities: 1500,
    taxes: 1600 + 800 + 1760,
    wages: 6000,
  },
  income: {
    daily: 500, // Example data - total revenue per day
    monthly: 15000, // Example data - total revenue per month
  },
  profit: {
    daily: 500 - (30000 / 30 + 1500 / 30 + 1420 / 30 + 2400 / 30), // Daily profit calculation
    monthly: 15000 - (30000 + 1500 + 1420 + 2400), // Monthly profit calculation
  },
};
