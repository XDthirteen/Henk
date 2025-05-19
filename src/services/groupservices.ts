import { defineStore } from 'pinia'
// import axios from "axios";


export const useGroupStore = defineStore('groupStore', {
  state: () => ({
    meGroup: { id: 0, name: 'Me',   icon: './src/assets/sunglasses.png' },
    invites: [
      { id: 1, name: 'School', icon: './src/assets/sleepy.png' },
      { id: 2, name: 'Work', icon: './src/assets/rage.png' },
    ],
    groups: [
      { id: 101, name: 'Family', icon: './src/assets/man-woman-boy.png' },
      { id: 102, name: 'Friends', icon: './src/assets/joy.png' },
    ],
    acceptedGroups: [] as Array<{ id: number; name: string; icon: string }>,
  }),
  actions: {
    acceptGroup(group: { id: number; name: string; icon: string }) {
      this.acceptedGroups.push(group)
      this.groups.push(group)
      this.invites = this.invites.filter((inv) => inv.id !== group.id)
    },
    declineGroup(group: { id: number; name: string; icon: string }) {
      this.invites = this.invites.filter((inv) => inv.id !== group.id)
    },
  },
})


export const fetchGroups = async () => {
  try {
    const response = await fetch('/api/groups');
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

