import type { Task } from "@/components/models";
import axios from "axios";
import { onMounted, ref } from "vue";



const useTasks = () => {
  const userToken = `Bearer ${localStorage.getItem("token")}`;
  const tasks = ref<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>("/api/tasks", {
        headers: {
          Authorization: userToken
        }
      });

      tasks.value = response.data;
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  const postNewTask = async (newTask: Task) => {
    try {
      const response = await axios.post("/api/tasks", newTask, {
        headers: {
          Authorization: userToken
        }
      }
      );
      console.log('Task succesfully created:', response.data);
      await fetchTasks();
    } catch(error) {
      console.error('Error creating new task: ', error);
      throw error
    }
  }

  const updateTask = async (taskID: Task) => {
    try {
      const response = await axios.put(`/api/tasks/${taskID.id}`, {
        title: taskID.title,
        description: taskID.description,
        dueDate: taskID.dueDate
      }, {
        headers: {
          Authorization: userToken
        }
      });
      console.log("Task updated successfully: ", response.data);
      await fetchTasks();
      return response.data;
    } catch (error) {
      console.error('Could not update task: ', error);
      return null;
    }
  }

  const deleteTask = async (taskID: Task) => {
    try {
      const response = await axios.delete(`/api/tasks/${taskID.id}`, {
        headers: {
          Authorization: userToken
        }
      });
      console.log("Task deleted successfully: ", response.data);
      await fetchTasks();
      return response.data;
    } catch (error) {
      console.error('Could not delete task: ', error);
      return null;
    }
  }

  onMounted(fetchTasks);
  return {
    tasks,
    postNewTask,
    updateTask,
    deleteTask
  };
};

export { useTasks };
