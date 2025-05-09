import { 
  getDashboardSummaryAPI, 
  getRecentActivitiesAPI, 
  getProgressStatsAPI 
} from './DashboardAPI';

class DashboardService {
  static async getDashboardData() {
    try {
      const [summary, activities, stats] = await Promise.all([
        getDashboardSummaryAPI(),
        getRecentActivitiesAPI(),
        getProgressStatsAPI()
      ]);

      return {
        summary,
        activities,
        stats
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  static async getSummary() {
    try {
      return await getDashboardSummaryAPI();
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  static async getRecentActivities() {
    try {
      return await getRecentActivitiesAPI();
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  static async getProgressStats() {
    try {
      return await getProgressStatsAPI();
    } catch (error) {
      console.error('Error fetching progress stats:', error);
      throw error;
    }
  }
}

export default DashboardService;
