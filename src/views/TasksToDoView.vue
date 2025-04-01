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
/
/ To do:
/ - juiste id meegeven aan een taak waarop je klikt
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { ref, type Reactive } from 'vue';
import FontAwesomeIconToggler from "@/components/FontAwasomeIconToggler.vue";
import StyledButton from "@/components/StyledButton.vue";
import StyledInputByType from "@/components/StyledInputByType.vue";
import { useTasks } from "@/services/tasks.service";
import type { Task } from '@/components/models';

const { tasks, postNewTask } = useTasks();

const newTask: Reactive<Task> = {
  title: '',
  description: '',
  dueDate: '',
}


const isCreatingNewTask = ref<boolean>(false);
const isEditingTask = ref<boolean>(false)
const selectedTask = ref<Task | null>(null);

function toggleCreateNewTask() {
  isCreatingNewTask.value = !isCreatingNewTask.value;
}


function toggleEditTask(taskID?: number) {
  isEditingTask.value = !isEditingTask.value;

  if (!taskID) {
    selectedTask.value = null;
    isEditingTask.value = false;
    return;
  }

  selectedTask.value = tasks.value.find((task) => task.id === taskID) || null;
  isEditingTask.value = !!selectedTask.value;
}

function closeEditTask() {
  isEditingTask.value = false;
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
</script>

<template>
  <div class="body">
    <div class="todo-item" v-for="task in tasks" :key="task.id">
      <FontAwesomeIconToggler icon1="check-circle" icon2="circle-notch" />
      <div class="task-title" @click=toggleEditTask(task.id)>{{ task.title }}</div>
    </div>
  </div>

  <div v-if="isEditingTask.valueOf()" class="modal-overlay" @click="closeEditTask">
    <div class="new-task-form" @click.stop>
      <button class="close-btn" @click="closeEditTask">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </button>

      <div class="modal-items">
        <div class="item-in-modal">
          <StyledInputByType label="Title" v-model="newTask.title" placeholder="Enter task title" inputType="text" />
        </div>
        <div class="item-in-modal">
          <StyledInputByType label="Description" v-model="newTask.description" placeholder="Enter task description"
            inputType="text" />
        </div>
        <div class="item-in-modal">
          <StyledInputByType label="Due Date" v-model="newTask.dueDate" placeholder="YYYY-MM-DD" inputType="date" />
        </div>
        <button @click="PostTaskToBackend" class="submit-btn">Create Task</button>
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
          <StyledInputByType label="Description" v-model="newTask.description" placeholder="Enter task description"
            inputType="text" />
        </div>
        <div class="item-in-modal">
          <StyledInputByType label="Due Date" v-model="newTask.dueDate" placeholder="YYYY-MM-DD" inputType="date" />
        </div>
        <button @click="PostTaskToBackend" class="submit-btn">Create Task</button>
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
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>
