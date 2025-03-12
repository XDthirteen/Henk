<template>
	<div class="container">
		<header>
			<h1>Groups</h1>
			<div class="header-buttons">
				<button
					class="invite-button"
					@click="navigateToInvites"
					v-if="groupStore.invites.length > 0"
				>
					<span class="invite-badge">{{ groupStore.invites.length }}</span>
				</button>
			</div>
		</header>

		<!-- Navigatiebalk -->
		<nav class="navigation-bar">
			<button @click="showAddGroupForm">➕ Add Group</button>
			<button @click="toggleInviteMode">📨 Invite Members</button>
			<button @click="leaveGroup">🚪 Leave Group</button>
		</nav>

		<!-- Groepen weergave -->
		<div class="group-container">
			<!-- Me Group (Navigatie naar persoonlijke agenda) -->
			<div class="main-group" @click="navigateToAgenda('me')">
				<img :src="groupStore.meGroup?.icon || defaultIcon" alt="Me" />
				<span>{{ groupStore.meGroup?.name || 'My Agenda' }}</span>
			</div>

			<div class="group-items-container">
				<div
					v-for="group in groups"
					:key="group.id"
					class="group-item"
					:class="{ selectable: inviteMode, selected: selectedGroup?.id === group.id }"
					@click="inviteMode ? selectGroup(group) : navigateToAgenda(group.id)"
				>
					<img :src="group.icon || defaultIcon" :alt="group.name" />
					<span>{{ group.name }}</span>
				</div>
			</div>
		</div>

		<!-- Invite formulier -->
		<div v-if="selectedGroup" class="invite-form">
			<h3>Invite to: {{ selectedGroup.name }}</h3>
			<input
				type="text"
				v-model="inviteInput"
				placeholder="Enter User ID or Email"
				class="input-field"
			/>
			<button class="send-btn" @click="sendInvite">Send Invite</button>
			<button class="cancel-btn" @click="cancelInvite">Cancel</button>
		</div>

		<!-- Succesbericht -->
		<p v-if="inviteSent" class="invite-sent-message">
			Invite Sent to {{ selectedGroup?.name }} ✅
		</p>

		<!-- Groep Toevoegen Formulier -->
		<div v-if="isAddGroupFormOpen" class="add-group-form">
			<!-- Voeg hier je formulier content toe -->
			<h2>Add New Group</h2>
			<input v-model="newGroupName" placeholder="Group Name" class="input-field" />
			<button @click="addGroup">Add Group</button>
			<button @click="closeAddGroupForm">Cancel</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/services/auth.service'
import { useGroupStore } from '@/stores/groupStore' // ✅ Import store

/* ✅ TypeScript interface voor groepen */
interface Group {
	id: string
	name: string
	icon: string
}

/* ✅ API Setup */
const API_URL = '/api/groups'
const defaultIcon = '/images/default.png'

/* ✅ Vue & Router setup */
const router = useRouter()
const { getAuthToken, isAuthenticated } = useAuth()
const groupStore = useGroupStore() // ✅ Gebruik de store voor groepsdata

/* ✅ Reactieve variabelen */
const groups = ref<Group[]>([])
const selectedGroup = ref<Group | null>(null)
const inviteMode = ref(false)
const inviteInput = ref('')
const inviteSent = ref(false)
const isAddGroupFormOpen = ref(false) // ✅ Formulier status
const newGroupName = ref('') // ✅ Voor nieuwe groep naam

/* ✅ Groepen ophalen bij opstarten */
onMounted(async () => {
	await fetchGroups()
})

const fetchGroups = async () => {
	try {
		const token = getAuthToken()
		const response = await axios.get<Group[]>(API_URL, {
			headers: { Authorization: `Bearer ${token}` },
		})
		groups.value = response.data
	} catch (error) {
		console.error('Error fetching groups:', error)
	}
}

/* ✅ Ga naar de invites-pagina */
const navigateToInvites = () => {
	router.push({ name: 'invites' })
}

/* ✅ Ga naar een groep of persoonlijke agenda */
const navigateToAgenda = (groupId: string) => {
	router.push({ name: 'agenda', params: { id: groupId } })
}

/* ✅ Invite Mode activeren */
const toggleInviteMode = () => {
	inviteMode.value = !inviteMode.value
	selectedGroup.value = null
	inviteInput.value = ''
}

/* ✅ Selecteer een groep voor uitnodigingen */
const selectGroup = (group: Group) => {
	selectedGroup.value = group
}

/* ✅ Nodig een gebruiker uit */
const sendInvite = async () => {
	if (!inviteInput.value.trim()) {
		alert('Please enter a valid User ID or Email.')
		return
	}

	if (!selectedGroup.value) {
		alert('Please select a group first.')
		return
	}

	if (!isAuthenticated.value) {
		alert('You are not authenticated. Please log in again.')
		return
	}

	const token = getAuthToken()

	try {
		await axios.post(
			`${API_URL}/${selectedGroup.value.id}/invites/${inviteInput.value}`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } },
		)

		inviteSent.value = true
		inviteMode.value = false // Zet inviteMode uit na versturen
		setTimeout(() => {
			inviteSent.value = false
			cancelInvite()
		}, 2000)
	} catch (error) {
		console.error('Error sending invite:', error)
		alert('Failed to send invite.')
	}
}

/* ✅ Annuleer uitnodiging */
const cancelInvite = () => {
	selectedGroup.value = null
	inviteInput.value = ''
}

/* ✅ Groep verlaten */
const leaveGroup = async () => {
	if (!selectedGroup.value) {
		alert('Please select a group to leave.')
		return
	}

	if (!isAuthenticated.value) {
		alert('You are not authenticated. Please log in again.')
		return
	}

	const token = getAuthToken()

	try {
		await axios.delete(`${API_URL}/${selectedGroup.value.id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})

		alert(`Successfully left ${selectedGroup.value.name}`)
		await fetchGroups() // Refresh groepenlijst
		cancelInvite()
	} catch (error) {
		console.error('Error leaving group:', error)
		alert('Failed to leave group.')
	}
}

/* ✅ Groep toevoegen formulier openen */
const showAddGroupForm = () => {
	console.log('Button clicked, opening form')
	isAddGroupFormOpen.value = true
}

/* ✅ Groep toevoegen */
const addGroup = async () => {
	if (!newGroupName.value.trim()) {
		alert('Please enter a valid group name.')
		return
	}

	const token = getAuthToken()

	try {
		await axios.post(
			API_URL,
			{ name: newGroupName.value },
			{ headers: { Authorization: `Bearer ${token}` } },
		)

		alert('Group added successfully!')
		await fetchGroups() // Refresh groepenlijst
		closeAddGroupForm()
	} catch (error) {
		console.error('Error adding group:', error)
		alert('Failed to add group.')
	}
}

/* ✅ Sluit formulier voor toevoegen van groep */
const closeAddGroupForm = () => {
	isAddGroupFormOpen.value = false
	newGroupName.value = ''
}
</script>

<style scoped>
/* Algemene container */
.container {
	text-align: center;
	padding: 20px;
}

/* Header */
header {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

.header-buttons {
	position: absolute;
	right: 10px;
	display: flex;
	align-items: center;
}

/* Selecteerbare groepen */
.selectable {
	cursor: pointer;
	border: 2px dashed #0078a5;
	padding: 5px;
}

.selected {
	border: 3px solid #0078a5;
	background-color: rgba(0, 120, 165, 0.2);
}

/* Groep-item wanneer Invite Mode is ingeschakeld */
.group-item.selectable:hover {
	background-color: rgba(0, 120, 165, 0.1);
	border: 2px dashed #0078a5;
}

.group-item.selected {
	background-color: rgba(0, 120, 165, 0.2);
	border: 3px solid #0078a5;
}

.invite-button {
	background: none;
	border: none;
	cursor: pointer;
}

.invite-badge {
	position: absolute;
	top: -5px;
	right: -5px;
	background-color: green;
	color: white;
	font-size: 14px;
	font-weight: bold;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
}

/* 🚀 Nieuwe Navigatiebalk */
.navigation-bar {
	display: flex;
	justify-content: center;
	gap: 15px;
	background-color: #f4f4f4;
	padding: 12px;
	margin-bottom: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navigation-bar button {
	background: #008cba;
	color: white;
	border: none;
	padding: 10px 15px;
	cursor: pointer;
	font-size: 14px;
	border-radius: 5px;
	transition:
		background 0.3s,
		transform 0.2s;
}

.navigation-bar button:hover {
	background: #0078a5;
	transform: scale(1.05);
}

.group-container {
	display: grid;
	grid-template-columns: 1fr;
	gap: 15px;
	justify-content: center;
	margin-top: 20px;
  margin-bottom: 20px;
}

/* Main Group (Me Group) */
.main-group {
	display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.main-group img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

/* Groep Items */
.group-items-container {
	display: grid;
	grid-template-columns: repeat(2, 1fr); /* Twee iconen per rij voor de andere groepen */
	gap: 15px;
	justify-content: center;
}

/* Groep Item */
.group-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.group-item img {
	width: 70px;
	height: 70px;
	border-radius: 50%;
	object-fit: cover;
}


.invite-form {
	background: white;
	padding: 20px;
	border-radius: 8px;
	width: 300px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	text-align: center;
	margin: 20px auto;
}

.input-field {
	width: 100%;
	padding: 8px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.send-btn {
	background-color: #4caf50;
	color: white;
	border: none;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
}

.cancel-btn {
	background-color: #f44336;
	color: white;
	border: none;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
}

.invite-sent-message {
	margin-top: 20px;
	color: green;
	font-weight: bold;
}

/* 📌 Groep Toevoegen Formulier */
.add-group-form {
	background: white;
	padding: 20px;
	border-radius: 8px;
	width: 300px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	text-align: center;
	margin: 20px auto;
}
</style>
