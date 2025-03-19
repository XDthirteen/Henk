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


  onMounted(fetchTasks);

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

  return {
    tasks,
    postNewTask
  };
};

export { useTasks };
