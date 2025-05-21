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
/ 14/04/2025---Arno Defillet----Aanpassing: Getoonde taken zijn enkel 'uncompletedTasks'
/ 14/04/2025---Arno Defillet----Aanpassing: Opkuis van code + Huisstijl toepassen + animatie voorzien voor task
completed
/
/ To do:
/ - taak kunnen inplannen in de agenda
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
import PopUpComponent from '@/components/PopUpComponent.vue';

const { tasks, postNewTask, updateTask, deleteTask, completeTask } = useTasks();

const justCompleted = ref<number[]>([]);

const visibleTasks = computed(() => {
  return [...tasks.value]
    .filter(task => !task.completed || justCompleted.value.includes(task.id!))
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
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
  if (!task.id) {
    console.error("No task ID found for completion toggle.");
    return;
  }

  task.completed = !task.completed;

  try {
    await completeTask(task);
    console.log(`Task ${task.id} completion toggled to: ${task.completed}`);

    if (task.completed) {
      justCompleted.value.push(task.id);
      justCompleted.value = justCompleted.value.filter(id => id !== task.id);
    }
  } catch (error) {
    console.error("Error toggling task completion:", error);
  }
};
</script>


<template>
  <div class="body">
    <transition-group name="fade-slide" tag="div">
      <div class="todo-item" v-for="task in visibleTasks" :key="task.id"
        :class="{ completed: task.completed && justCompleted.includes(task.id!) }">
        <FontAwesomeIconToggler @click="CompleteToggler(task)" :icon1="'check-circle'" :icon2="'circle-notch'"
          :active="task.completed" />
        <div class="task-title" @click="task.id !== undefined ? toggleEditTask(task.id) : null">{{ task.title }}</div>
      </div>
    </transition-group>
  </div>

  <PopUpComponent v-if="isEditingTask" @close="closeEditTask">
    <div class="modal-items">
      <div class="item-in-modal">
        <StyledInputByType label="Title" v-model="editedTask.title" placeholder="Enter task title" inputType="text" />
      </div>
      <div class="item-in-modal">
        <div class="textarea-title">Description</div>
        <textarea class="textarea-input" v-model="editedTask.description" placeholder="Enter task description" rows="4"
          cols="1" />
      </div>
      <div class="item-in-modal">
        <StyledInputByType label="Due Date" v-model="editedTask.dueDate" inputType="datetime-local" />
      </div>
      <div class="btn-container">
        <StyledButton @click="PutTaskToBackend" type="save">Update</StyledButton>
        <StyledButton @click="DeleteTaskToBackend" type="negative">Delete</StyledButton>
      </div>
    </div>
  </PopUpComponent>

  <PopUpComponent v-if="isCreatingNewTask" @close="toggleCreateNewTask">
    <div class="modal-items">
      <div class="item-in-modal">
        <StyledInputByType label="Title" v-model="newTask.title" placeholder="Enter task title" inputType="text" />
      </div>
      <div class="item-in-modal">
        <div class="textarea-title">Description</div>
        <textarea class="textarea-input" v-model="newTask.description" placeholder="Enter task description" rows="4"
          cols="1" />
      </div>
      <div class="item-in-modal">
        <StyledInputByType label="Due Date" v-model="newTask.dueDate" inputType="datetime-local" />
      </div>
      <StyledButton @click="PostTaskToBackend" type="save">Create Task</StyledButton>
    </div>
  </PopUpComponent>

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

.task-count {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: var(--info-background);
  border-radius: 0.5rem;
  font-size: large;
  font-weight: 700;
  margin-bottom: 1rem;
}

.todo-item {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  background-color: var(--tasktodo-background);
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
}

.task-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
}

.new-item {
  position: fixed;
  bottom: 40px;
  right: 20px;
}

.new-item-btn {
  width: 4rem;
  height: 4rem;
  padding: 10px;
  background-color: var(--green-button);
  border-radius: 50%;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
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
  color: var(--purple-text);
}

.textarea-input {
  background-color: var(--item-background);
  width: 13rem;
  border: 2px solid var(--input-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.textarea-input:focus {
  background-color: var(--input-focus);
}

.btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

/*spelen met de animaties :)*/
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 1.0s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
