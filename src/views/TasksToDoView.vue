/*#####################################
/
/ # TaskToDoView.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een view om uw openstaande taken te controleren
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 13/03/2025
/
#################
/
/ Changelog:
/ ----------
/ 13/03/2025---Arno Defillet----Start van de view + toevoegen van icon toggler
/ 17/03/2025---Arno Defillet----Aanpassing van icoon variabelen
/ 19/03/2025---Arno Defillet----Toevoeging: Begin taken op te halen en nieuwe taak aan te maken
/ 31/01/2025---Arno Defillet----Aanpassing: taak bewerkbaar maken
/ 02/04/2025---Arno Defillet----Aanpassing: Modal kunnen openen en de backend waarden ingeven voor de geselecteerde taak
/ 02/04/2025---Arno Defillet----Toevoeging: toevoegen van update en delete functionaliteit
/ 03/04/2025---Arno Defillet----Toevoeging: FontAwasomeIconToggler kunnen aanduiden als completed
/ 03/04/2025---Arno Defillet----Toevoeging: Task completed naar de backend kunnen versturen
/ 03/04/2025---Arno Defillet----Toevoeging: Bij herladen van de pagina meteen kunnen aangeven of een taak completed is
/
/ To do:
/ -
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { ref, type Reactive, computed } from 'vue';
import FontAwesomeIconToggler from "@/components/FontAwasomeIconToggler.vue";
import StyledButton from "@/components/StyledButton.vue";
import StyledInputByType from "@/components/StyledInputByType.vue";
import { useTasks } from "@/services/tasks.service";
import type { Task } from '@/components/models';

const { tasks, postNewTask, updateTask, deleteTask, completeTask } = useTasks();

const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
});

const newTask: Reactive<Task> = {
  completed: false,
  title: '',
  description: '',
  dueDate: '',
}

const isCreatingNewTask = ref<boolean>(false);
const isEditingTask = ref<boolean>(false)
const selectedTask = ref<Task>({
  completed: false,
  id: undefined,
  title: '',
  description: '',
  dueDate: '',
  userId: undefined
});

const editedTask = ref<Task>({
  completed: false,
  id: undefined,
  title: '',
  description: '',
  dueDate: '',
  userId: undefined,
});

function formatDueDate(date: string): string {
  return new Date(date).toISOString().slice(0, 16);
}

function toggleCreateNewTask() {
  isCreatingNewTask.value = !isCreatingNewTask.value;
}

function toggleEditTask(taskID: number) {
  const taskToEdit = tasks.value.find((task) => task.id === taskID);

  if (taskToEdit) {
    editedTask.value = {
      ...taskToEdit,
      dueDate: taskToEdit.dueDate ? formatDueDate(taskToEdit.dueDate) : '',
    };
  }

  isEditingTask.value = true;
}

function closeEditTask() {
  isEditingTask.value = false;
  selectedTask.value = {
    completed: false,
    id: undefined,
    title: '',
    description: '',
    dueDate: '',
    userId: undefined,
  };
  editedTask.value = {
    completed: false,
    id: undefined,
    title: '',
    description: '',
    dueDate: '',
    userId: undefined,
  };
}

const PostTaskToBackend = async (): Promise<void> => {
  try {
    await postNewTask(newTask);
    isCreatingNewTask.value = false;
    console.log("Task successfully created!");
  } catch (error) {
    console.error("Error during task creation:", error);
  }
};

const PutTaskToBackend = async (): Promise<void> => {
  try {
    if (editedTask.value.id) {
      await updateTask(editedTask.value);
      isEditingTask.value = false;
      console.log("Task successfully updated!");
    } else {
      console.error("No task ID found for update.");
    }
  } catch (error) {
    console.error("Error during updating task:", error);
  }
};

const DeleteTaskToBackend = async (): Promise<void> => {
  try {
    if (editedTask.value.id) {
      await deleteTask(editedTask.value);
      isEditingTask.value = false;
      console.log("Task successfully deleted!");
    } else {
      console.error("No task ID found for deletion.");
    }
  } catch (error) {
    console.error("Error during deleting task:", error);
  }
};

const CompleteToggler = async (task: Task): Promise<void> => {
  task.completed = !task.completed;

  try {
    if (task.id) {
      await completeTask(task);
      console.log(`Task ${task.id} completion toggled to: ${task.completed}`);
    } else {
      console.error("No task ID found for completion toggle.");
    }
  } catch (error) {
    console.error("Error toggling task completion:", error);
  }
};
</script>

<template>
  <div class="body">
    <div class="todo-item" v-for="task in sortedTasks" :key="task.id">
      <FontAwesomeIconToggler @click="CompleteToggler(task)" :icon1="'check-circle'" :icon2="'circle-notch'"
        :active="task.completed" />
      <div class="task-title" @click="task.id !== undefined ? toggleEditTask(task.id) : null">{{ task.title }}</div>
    </div>
  </div>

  <div v-if="isEditingTask.valueOf()" class="modal-overlay" @click="closeEditTask">
    <div class="new-task-form" @click.stop>
      <button class="close-btn" @click="closeEditTask">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </button>

      <div class="modal-items">
        <div class="item-in-modal">
          <StyledInputByType label="Title" v-model="editedTask.title" placeholder="Enter task title" inputType="text" />
        </div>
        <div class="item-in-modal">
          <div class="textarea-title">Description</div>
          <textarea class="textarea-input" v-model="editedTask.description" placeholder="Enter task description"
            rows="4" cols="1"></textarea>
        </div>
        <div class="item-in-modal">
          <StyledInputByType label="Due Date" v-model="editedTask.dueDate" inputType="datetime-local" />
        </div>
        <div class="btn-container">
          <button @click="PutTaskToBackend" class="btn submit-btn">Update Task</button>
          <button @click="DeleteTaskToBackend" class="btn delete-btn">Delete Task</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isCreatingNewTask.valueOf()" class="modal-overlay" @click="toggleCreateNewTask">
    <div class="new-task-form" @click.stop>
      <button class="close-btn" @click="toggleCreateNewTask">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </button>

      <div class="modal-items">
        <div class="item-in-modal">
          <StyledInputByType label="Title" v-model="newTask.title" placeholder="Enter task title" inputType="text" />
        </div>
        <div class="item-in-modal">
          <div class="textarea-title">Description</div>
          <textarea class="textarea-input" v-model="newTask.description" placeholder="Enter task description" rows="4"
            cols="1"></textarea>
        </div>
        <div class="item-in-modal">
          <StyledInputByType label="Due Date" v-model="newTask.dueDate" inputType="datetime-local" />
        </div>
        <button @click="PostTaskToBackend" class="btn submit-btn">Create Task</button>
      </div>
    </div>
  </div>


  <div class="new-item" @click="toggleCreateNewTask">
    <StyledButton class="new-item-btn" type="save">
      <FontAwesomeIconToggler icon1="plus" icon2="plus" />
    </StyledButton>
  </div>
</template>

<style scoped>
.body {
  margin: 1rem 2rem;
  display: flex;
  flex-direction: column;
}

.todo-item {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  background-color: var(--primary-white);
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.task-title {
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
}

.new-item {
  position: fixed;
  bottom: 40px;
  right: 20px;
  z-index: 1000;
}

.new-item-btn {
  width: 4rem;
  height: 4rem;
  padding: 10px;
  background-color: var(--secundary-green);
  border-radius: 50%;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
}

.new-item-btn:hover {
  background-color: var(--primary-green);
  transform: scale(1.1);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Modal content */
.new-task-form {
  display: flex;
  justify-content: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  position: relative;
  animation: fadeInScale 0.5s ease-out;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Close button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--primary-purple);
  cursor: pointer;
}

.modal-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-in-modal {
  display: flex;
  flex-direction: column;
  align-content: center;
  flex-wrap: wrap;
}

.textarea-title {
  font-weight: bold;
  color: var(--primary-purple);
}

.textarea-input {
  width: 13rem;
  border: 2px solid var(--primary-blue);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.textarea-input:focus {
  background-color: var(--tertiary-purple);
}

.btn-container {
  display: flex;
  width: 100%;
}

.btn {
  width: 100%;
  padding: 10px;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn {
  background-color: #4CAF50;
}

.delete-btn {
  background-color: red;
}

.submit-btn:hover {
  background-color: #45a049;
}

.delete-btn:hover {
  background-color: rgb(234, 36, 36);
}
</style>
