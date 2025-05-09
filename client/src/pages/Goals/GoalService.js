import { getGoalsAPI, createGoalAPI, updateGoalProgressAPI, deleteGoalAPI } from './GoalsAPI';

class GoalService {
  static async getGoals() {
    try {
      const goals = await getGoalsAPI();
      return goals;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  static async createGoal(goalData) {
    try {
      const newGoal = await createGoalAPI(goalData);
      return newGoal;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  static async updateGoalProgress(goalId, progress) {
    try {
      const updatedGoal = await updateGoalProgressAPI(goalId, progress);
      return updatedGoal;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }

  static async deleteGoal(goalId) {
    try {
      await deleteGoalAPI(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }
}

export default GoalService;
