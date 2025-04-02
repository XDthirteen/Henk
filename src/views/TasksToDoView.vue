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
/
/ To do:
/ - Bewerking kunnen bewaren naar de backend
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
const selectedTask = ref<Task>({
  id: undefined,
  title: '',
  description: '',
  dueDate: '',
  userId: undefined
});

const editedTask = ref<Task>({
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
    console.log(editedTask.value.dueDate);
  }

  isEditingTask.value = true;
  console.log(taskToEdit);
}

function closeEditTask() {
  isEditingTask.value = false;
  selectedTask.value = {
    id: undefined,
    title: '',
    description: '',
    dueDate: '',
    userId: undefined,
  };
  editedTask.value = {
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


</script>

<template>
  <div class="body">
    <div class="todo-item" v-for="task in tasks" :key="task.id">
      <FontAwesomeIconToggler icon1="check-circle" icon2="circle-notch" />
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
          <button class="btn submit-btn">Update Task</button>
          <button class="btn delete-btn">Delete Task</button>
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
