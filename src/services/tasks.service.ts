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
      console.log(response.data)
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
        completed: taskID.completed,
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

  const completeTask = async (task: Task) => {
    console.log("Task:", task.id);

    const endpoint = task.completed
      ? `api/tasks/${task.id}/complete`
      : `api/tasks/${task.id}/uncomplete`;

    try {
      //endpoint.startsWith('/') moeten toevoegen, aangezien de call gedaan wordt op path: '/tasks/todo
      //Request URL zou dan "http://localhost:5173/tasks/api/tasks/taskID/complete" zijn (1 'tasks' teveel in URL)
      const response = await axios.post(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, {}, {
        headers: { Authorization: userToken }
      });

      console.log("Task completion toggled: ", response.data);
      await fetchTasks();
      return response.data;
    } catch (error) {
      console.error('Could not toggle complete: ', error);
      return null;
    }
  };

  onMounted(fetchTasks);
  return {
    tasks,
    postNewTask,
    updateTask,
    deleteTask,
    completeTask
  };
};

export { useTasks };
