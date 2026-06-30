export const dashboardData = {
  metrics: {
    totalTests: 1520,
    passed: 1462,
    failed: 58,
    openBugs: 17,
  },

  executionTrend: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    data: [120, 180, 150, 220, 260],
  },

  passFail: {
    labels: ["Passed", "Failed"],
    data: [1462, 58],
  },

  bugSeverity: {
    labels: ["Critical", "High", "Medium", "Low"],
    data: [5, 12, 26, 41],
  },

  teamPerformance: {
    labels: ["Gautam", "Rahul", "Ankit", "Priya"],
    data: [96, 90, 88, 94],
  },

  recentTests: [
    {
      id: "TC-101",
      name: "Login Test",
      status: "Passed",
      executedBy: "Gautam",
    },
    {
      id: "TC-102",
      name: "Checkout Test",
      status: "Failed",
      executedBy: "Rahul",
    },
  ],

  bugs: [
    {
      id: "BUG-201",
      title: "Payment Gateway Error",
      severity: "Critical",
      status: "Open",
    },
  ],
};
