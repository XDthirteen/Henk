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
/
/ To do:
/ - Bij aanmaak nieuwe taak, meteen de nieuwe taak tonen op het scherm
/ -
/
/ Opmerkingen:
/ ------------
/ Enige opmerkingen?
/
#####################################*/

<script setup lang="ts">
import { ref } from 'vue';
import FontAwesomeIconToggler from "@/components/FontAwasomeIconToggler.vue";
import StyledButton from "@/components/StyledButton.vue";
import { useTasks } from "@/services/tasks.service";
import type { Task } from '@/components/models';

const { tasks, postNewTask } = useTasks();

const newTask: Task = {
  title: '',
  description: '',
  dueDate: '',
}

const isCreatingNewTask = ref<boolean>(false);
console.log(isCreatingNewTask.value)


function toggleCreateNewTask() {
  isCreatingNewTask.value = !isCreatingNewTask.value
  console.log(isCreatingNewTask.value)
}

const PostTaskToBackend = async (): Promise<void> => {
  try {
    await postNewTask(newTask);
    isCreatingNewTask.value = false;
    console.log("Update succesvol!");
  } catch (error) {
    console.error("Error during task creation:", error);
  }
};

</script>

<template>
  <div class="body">
    <div class="todo-item" v-for="task in tasks" :key="task.id">
      <FontAwesomeIconToggler icon1="check-circle" icon2="circle-notch" />
      <div>{{ task.title }}</div>
    </div>
  </div>
  <div v-if="isCreatingNewTask.valueOf()">
    <div class="new-task-item">
      <label for="taskTitle">Title: </label>
      <input type="text" name="taskTitle" v-model="newTask.title">
    </div>
    <div class="new-task-item">
      <label for="taskDescription">Description: </label>
      <input type="text" name="taskDescription" v-model="newTask.description">
    </div>
    <div class="new-task-item">
      <label for="taskDueDate">DueDate: </label>
      <input type="text" name="taskDueDate" v-model="newTask.dueDate">
    </div>
    <button @click="PostTaskToBackend">Create task</button>
  </div>
  <div class="new-item" @click="toggleCreateNewTask">
    <StyledButton class="new-item-btn" type="save">
      <FontAwesomeIconToggler icon1="plus" icon2="plus" />
    </StyledButton>
  </div>
</template>

<style scoped>
.body {
  margin: 1rem 2rem 1rem 2rem;
}

.todo-item {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
}

.new-item {
  position: fixed;
  bottom: 40px;
  right: 20px;
  z-index: 1000;
}

.new-item-btn {
  width: 5rem;
  height: 5rem;
  margin: 5px;
  padding: 5px;
}

.new-task-item {
  display: flex;
}
</style>
