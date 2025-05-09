import { 
  getWorkoutsAPI, 
  createWorkoutAPI, 
  updateWorkoutAPI, 
  deleteWorkoutAPI 
} from './WorkoutsAPI';

class WorkoutsService {
  static async getWorkouts() {
    try {
      return await getWorkoutsAPI();
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  }

  static async createWorkout(workoutData) {
    try {
      return await createWorkoutAPI(workoutData);
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  }

  static async updateWorkout(workoutId, workoutData) {
    try {
      return await updateWorkoutAPI(workoutId, workoutData);
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  }

  static async deleteWorkout(workoutId) {
    try {
      await deleteWorkoutAPI(workoutId);
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }
}

export default WorkoutsService; 