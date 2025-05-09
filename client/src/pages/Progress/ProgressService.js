import { getProgressAPI, addProgressEntryAPI, getProgressStatsAPI } from './ProgressAPI';

class ProgressService {
  static async getProgress(startDate, endDate) {
    try {

      const data =  await getProgressAPI(startDate, endDate);
      return data.progress;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  static async addProgressEntry(progressData) {
    try {
      return await addProgressEntryAPI(progressData);
    } catch (error) {
      console.error('Error logging progress:', error);
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

export default ProgressService; 