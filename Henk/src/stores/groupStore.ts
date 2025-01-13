import { defineStore } from 'pinia';

export const useGroupStore = defineStore('groupStore', {
  state: () => ({
    invites: [
      { id: 1, name: 'School', icon: './src/assets/school.png' },
      { id: 2, name: 'Work', icon: './src/assets/work.png' },
    ],
    groups: [
      { id: 101, name: 'Me', icon: './src/assets/me.png' },
      { id: 102, name: 'Family', icon: './src/assets/family.png' },
      { id: 103, name: 'Friends', icon: './src/assets/friends.png' },
    ],
    acceptedGroups: [] as Array<{ id: number; name: string; icon: string }>,
  }),
  actions: {
    acceptGroup(group: { id: number; name: string; icon: string }) {
      this.acceptedGroups.push(group);
      this.groups.push(group);
      this.invites = this.invites.filter(inv => inv.id !== group.id);
    },
    declineGroup(group: { id: number; name: string; icon: string }) {
      this.invites = this.invites.filter(inv => inv.id !== group.id);
    },
  },
});
