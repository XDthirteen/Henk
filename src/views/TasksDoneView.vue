/*#####################################
/
/ # TasksDoneView.vue
/ # ==================
/ # Beschrijving:
/ # ------------
/ # Een view om uw afgesloten taken te zien
/
/ # Auteur: Arno Defillet
/ # Datum aangemaakt: 14/04/2025
/
#################
/
/ Changelog:
/ ----------
/ 14/04/2025---Arno Defillet----Start van de view
/ 14/04/2025---Arno Defillet----Aanpassing: Toon completed taken
/ 14/04/2025---Arno Defillet----Aanpassing: Animatie voorzien voor uncomplete task
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
import { computed } from 'vue';
import { useTasks } from "@/services/tasks.service";
import FontAwesomeIconToggler from "@/components/FontAwasomeIconToggler.vue";
import type { Task } from '@/components/models';
const { tasks, completeTask } = useTasks();

const completedTasks = computed(() =>
  tasks.value.filter(task => task.completed)
);

const sortedTasks = computed(() => {
  return [...completedTasks.value].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
});

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
    <transition-group name="fade-slide" tag="div">
      <div class="task-item" v-for="task in sortedTasks" :key="task.id">
        <FontAwesomeIconToggler @click="CompleteToggler(task)" :icon1="'check-circle'" :icon2="'circle-notch'"
          :active="task.completed" />
        <div class="task-title">{{ task.title }}</div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.body {
  margin: 1rem 2rem;
  display: flex;
  flex-direction: column;
}

.task-item {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  background-color: var(--taskdone-background);
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.task-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
  text-decoration: line-through;
}

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
