// Mock user data
export const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  joinDate: "2023-01-15",
  profilePicture: "https://randomuser.me/api/portraits/men/32.jpg"
};

// Mock fitness stats for the dashboard for the new tabs implementation
export const mockDashboardStats = [
  {
    userId: 1,
    steps: 7532,
    water: 64,
    caloriesBurned: 420,
    caloriesConsumed: 1850,
    heartRate: 72,
    restingHeartRate: 65,
    maxHeartRate: 142,
    sleepHours: 7.2
  }
];
export const mockDashboardStatsLegacy = {
  steps: {
    today: 7532,
    goal: 10000,
    weeklyAverage: 8245
  },
  water: {
    today: 1800, // ml
    goal: 2500,
    weeklyAverage: 2100
  },
  calories: {
    burned: 420,
    consumed: 1850,
    goal: 2000
  },
  heartRate: {
    current: 72,
    resting: 65,
    max: 142
  },
  sleep: {
    lastNight: 7.2, 
    weeklyAverage: 6.8,
    goal: 8
  }
};

// Mock workout history
export const mockWorkouts = [
  {
    id: 1,
    type: "Running",
    duration: 35, 
    distance: 5.2, 
    calories: 320,
    date: "2023-06-15T08:30:00Z"
  },
  {
    id: 2,
    type: "Cycling",
    duration: 60,
    distance: 15.7,
    calories: 450,
    date: "2023-06-14T17:15:00Z"
  },
  {
    id: 3,
    type: "Swimming",
    duration: 45,
    distance: 1.5,
    calories: 380,
    date: "2023-06-12T07:45:00Z"
  },
  {
    id: 4,
    type: "Weight Training",
    duration: 50,
    calories: 280,
    date: "2023-06-10T16:00:00Z"
  },
  {
    id: 5,
    type: "Yoga",
    duration: 40,
    calories: 160,
    date: "2023-06-09T06:30:00Z"
  }
];

// Mock fitness goals
export const mockGoals = [
  {
    id: 1,
    title: "Lose 5kg",
    description: "Reach target weight of 75kg",
    targetDate: "2023-07-30",
    progress: 40 
  },
  {
    id: 2,
    title: "Run 10K",
    description: "Complete a 10K run without stopping",
    targetDate: "2023-08-15",
    progress: 65
  },
  {
    id: 3,
    title: "Drink more water",
    description: "Consistently drink 3L of water daily",
    targetDate: "2023-07-01",
    progress: 80
  }
];

// Mock chart data
export const mockChartData = {
  weeklySteps: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [6500, 8200, 7800, 9300, 7200, 8500, 7532]
  },
  weeklyWorkouts: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [45, 60, 0, 45, 30, 0, 35] 
  },
  monthlyProgress: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    weight: [80, 79.2, 78.5, 77.8], 
    bodyFat: [22, 21.5, 21.2, 20.8] 
  },
  calorieBalance: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    consumed: [1900, 2100, 1950, 2000, 2200, 2500, 1850],
    burned: [350, 420, 380, 400, 450, 500, 420]
  }
}; 