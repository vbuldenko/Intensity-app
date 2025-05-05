interface TrainingStats {
  totalTrainingsHeld: number;
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
  // trainingFeedbackScores: {
  //   trainingId: number;
  //   trainingName: string;
  //   averageScore: number;
  //   totalReviews: number;
  // }[];
  clientRetentionRate: number; // in percentage
  expenses: {
    rent: number;
    utilities: number;
    taxes: number;
    wages: number;
  };
}

export const studioStats: TrainingStats = {
  totalTrainingsHeld: 120,
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
  clientRetentionRate: 75.5,
  expenses: {
    rent: 30000,
    utilities: 1500,
    taxes: 1600 + 800 + 1760,
    wages: 9000 + 6000,
  },
};
