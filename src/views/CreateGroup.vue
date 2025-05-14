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

		<nav class="navigation-bar">
			<button @click="openAddGroupPopup">➕ Add Group</button>
			<button @click="toggleInviteMode">📨 Invite Members</button>
			<button @click="toggleLeaveMode">🚪 Leave Group</button>
		</nav>

		<div class="group-container">
			<div class="main-group" @click="navigateToAgenda('me')">
				<img :src="groupStore.meGroup?.icon || defaultIcon" alt="Me" />
				<span>{{ groupStore.meGroup?.name || 'My Agenda' }}</span>
			</div>

			<div class="group-items-container">
				<div
					v-for="group in groups"
					:key="group.id"
					class="group-item"
					:class="{
						selectable: inviteMode || leaveMode,
						selected: selectedGroup?.id === group.id,
					}"
					@click="
						inviteMode
							? selectGroupForInvite(group)
							: leaveMode
								? selectGroupForLeave(group)
								: navigateToAgenda(String(group.id))
					"
				>
					<font-awesome-icon v-if="group.icon" :icon="['fas', group.icon]" />
					<img v-else :src="defaultIcon" alt="Default Group Icon" />
					<span>{{ group.name }}</span>
				</div>
			</div>
		</div>

		<div v-if="showInvitePopup" class="popup">
			<h3>Invite to: {{ selectedGroup?.name }}</h3>
			<input
				type="text"
				v-model="inviteInput"
				placeholder="Enter User ID or Email"
				class="input-field"
			/>
			<button class="send-btn" @click="sendInvite">Send Invite</button>
			<button class="cancel-btn" @click="cancelInvite">Cancel</button>

			<p v-if="successMessage" class="success-message">{{ successMessage }}</p>
		</div>

		<div v-if="showLeavePopup" class="popup">
			<h3>Wil je {{ selectedGroup?.name }} verlaten?</h3>
			<button class="confirm-btn" @click="confirmLeaveGroup">Bevestig</button>
			<button class="cancel-btn" @click="cancelLeave">Annuleer</button>

			<p v-if="successMessage" class="success-message">{{ successMessage }}</p>
		</div>

		<div v-if="showAddGroupPopup" class="popup">
			<h3>Nieuwe Groep Aanmaken</h3>
			<input v-model="newGroupName" placeholder="Groepsnaam" class="input-field" />

			<!-- Aangepaste dropdown -->
			<div class="custom-dropdown">
				<div class="selected-icon" @click="toggleIconDropdown">
					<font-awesome-icon
						v-if="selectedGroupIcon"
						:icon="['fas', selectedGroupIcon]"
					/>
					<span v-else>Selecteer een icoon</span>
				</div>
				<ul v-if="iconDropdownOpen" class="icon-list">
					<li
						v-for="icon in availableIcons"
						:key="icon"
						@click="selectIcon(icon)"
						class="icon-item"
					>
						<font-awesome-icon :icon="['fas', icon]" /> {{ icon }}
					</li>
				</ul>
			</div>

			<button class="send-btn" @click="addGroup">Groep Toevoegen</button>
			<button class="cancel-btn" @click="closeAddGroupPopup">Annuleer</button>

			<p v-if="successMessage" class="success-message">{{ successMessage }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/services/auth.service'
import { useGroupStore } from '@/services/groupservices'
import type { Group } from '@/components/models.ts'

// FontAwesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import {
	faUser,
	faCoffee,
	faCar,
	faDog,
	faBicycle,
	faHome,
	faTree,
	faSun,
	faMoon,
	faRocket,
} from '@fortawesome/free-solid-svg-icons'

library.add(faUser, faCoffee, faCar, faDog, faBicycle, faHome, faTree, faSun, faMoon, faRocket)

const iconList = [
	faUser,
	faCoffee,
	faCar,
	faDog,
	faBicycle,
	faHome,
	faTree,
	faSun,
	faMoon,
	faRocket,
]


const API_URL = '/api/groups'
const defaultIcon = '/images/default.png'

const router = useRouter()
const route = useRoute()
const groupId = route.query.group_id
console.log('Group ID:', groupId)

const { getAuthToken, isAuthenticated } = useAuth()
const groupStore = useGroupStore()

const groups = ref<Group[]>([])
const selectedGroup = ref<Group | null>(null)
const inviteMode = ref(false)
const leaveMode = ref(false)
const inviteInput = ref('')
const showInvitePopup = ref(false)
const showLeavePopup = ref(false)
const showAddGroupPopup = ref(false)
const newGroupName = ref('')
const selectedGroupIcon = ref<string | null>(null)
const availableIcons = ref<string[]>([])
const iconDropdownOpen = ref(false)
const successMessage = ref('')

const generateRandomIcons = () => {
	const shuffled = [...iconList].sort(() => 0.5 - Math.random())
	availableIcons.value = shuffled.slice(0, 10).map((icon) => icon.iconName)
}

const toggleIconDropdown = () => {
	iconDropdownOpen.value = !iconDropdownOpen.value
}

const selectIcon = (icon: string) => {
	console.log('Geselecteerde icoon:', icon)
	selectedGroupIcon.value = icon
	iconDropdownOpen.value = false
}

onMounted(async () => {
	generateRandomIcons()
	await fetchGroups()
})

const fetchGroups = async () => {
  try {
    const token = getAuthToken()
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log('Opgehaalde groepen:', response.data)

    groups.value = response.data.map((group: Group) => {  // Gebruik de Group interface
      const image = (group.image || '').toString()  // 'image' is optioneel
      const isValidIcon = iconList.some((iconDef) => iconDef.iconName === image)

      // Converteer image naar icon (en behoud andere properties)
      const iconGroup: Group = {
        id: group.id,
        name: group.name,
        icon: isValidIcon ? image : 'user',
        tasks: group.tasks ?? [],
        image: group.image,  // Voeg image toe als je die wilt bewaren
      }

      return iconGroup
    })
  } catch (error) {
    console.error('Error fetching groups:', error)
    alert('Failed to fetch groups.')
  }
}



const navigateToInvites = () => {
	router.push({ name: 'invites' })
}

const navigateToAgenda = (groupId: string) => {
	router.push({ name: 'calendar', query: { group_id: groupId } })
}

const toggleInviteMode = () => {
	inviteMode.value = !inviteMode.value
	leaveMode.value = false
	showInvitePopup.value = false
	showLeavePopup.value = false
}

const toggleLeaveMode = () => {
	leaveMode.value = !leaveMode.value
	inviteMode.value = false
	showInvitePopup.value = false
	showLeavePopup.value = false
}

const selectGroupForInvite = (group: Group) => {
	selectedGroup.value = group
	showInvitePopup.value = true
}

const selectGroupForLeave = (group: Group) => {
	selectedGroup.value = group
	showLeavePopup.value = true
}

const sendInvite = async () => {
	if (!inviteInput.value.trim() || !selectedGroup.value || !isAuthenticated.value) return

	const token = getAuthToken()

	try {
		await axios.post(
			`${API_URL}/${selectedGroup.value.id}/invites/${inviteInput.value}`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } },
		)
		successMessage.value = `Uitnodiging succesvol verstuurd naar ${inviteInput.value}!`

		setTimeout(() => {
			successMessage.value = ''
			showInvitePopup.value = false
		}, 2000)
	} catch (error) {
		console.error('Error sending invite:', error)
		alert('Failed to send invite.')
	}
}

const cancelInvite = () => {
	showInvitePopup.value = false
	selectedGroup.value = null
	inviteMode.value = false
}

const confirmLeaveGroup = async () => {
	if (!selectedGroup.value) return

	const token = getAuthToken()

	try {
		await axios.delete(`${API_URL}/${selectedGroup.value.id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		successMessage.value = `Je hebt de groep "${selectedGroup.value.name}" succesvol verlaten!`

		setTimeout(() => {
			successMessage.value = ''
			showLeavePopup.value = false
		}, 2000)

		await fetchGroups()
	} catch (error) {
		console.error('Error leaving group:', error)
		alert('Failed to leave group.')
	}
}

const cancelLeave = () => {
	showLeavePopup.value = false
	selectedGroup.value = null
	leaveMode.value = false
}

const openAddGroupPopup = () => {
	showAddGroupPopup.value = true
}

const closeAddGroupPopup = () => {
	showAddGroupPopup.value = false
	newGroupName.value = ''
	selectedGroupIcon.value = null
}

const addGroup = async () => {
	if (!newGroupName.value.trim() || !selectedGroupIcon.value) {
		alert('Vul alle velden in.')
		return
	}

	const token = getAuthToken()

	try {
		const newGroup = {
			name: newGroupName.value,
			image: selectedGroupIcon.value, // API expects 'image'
		}

		console.log('Nieuwe groep:', newGroup)

		await axios.post(API_URL, newGroup, {
			headers: { Authorization: `Bearer ${token}` },
		})

		successMessage.value = 'Groep succesvol toegevoegd!'

		setTimeout(() => {
			successMessage.value = ''
			closeAddGroupPopup()
		}, 2000)

		await fetchGroups()
	} catch (error) {
		console.error('Error adding group:', error)
		alert('Failed to add group.')
	}
}
</script>

<style scoped>
.container {
	text-align: center;
	padding: 20px;
	font-family: 'Inter', sans-serif;
	background: #f9fafb;
	min-height: 100vh;
}

header {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	padding-bottom: 10px;
	border-bottom: 2px solid #e0e0e0;
}

.header-buttons {
	position: absolute;
	right: 10px;
	display: flex;
	align-items: center;
}

.invite-button {
	background: none;
	border: none;
	cursor: pointer;
	position: relative;
}

.invite-badge {
	position: absolute;
	top: -5px;
	right: -5px;
	background-color: #4caf50;
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
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.navigation-bar {
	display: flex;
	justify-content: center;
	gap: 15px;
	background: white;
	padding: 12px;
	margin: 20px auto;
	border-radius: 10px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	width: fit-content;
}

.navigation-bar button {
	background: #008cba;
	color: white;
	border: none;
	padding: 12px 18px;
	cursor: pointer;
	font-size: 14px;
	border-radius: 6px;
	transition:
		background 0.3s ease,
		transform 0.2s ease;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.navigation-bar button:hover {
	background: #0078a5;
	transform: scale(1.05);
}

.group-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	margin-top: 20px;
}

.main-group {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	cursor: pointer;
	transition: transform 0.2s ease;
}

.main-group img {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	object-fit: cover;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.main-group:hover {
	transform: scale(1.05);
}

.group-items-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 15px;
	width: 100%;
	max-width: 600px;
	margin-top: 10px;
}

.group-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	background: white;
	padding: 10px;
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;
}

.group-item img {
	width: 70px;
	height: 70px;
	border-radius: 50%;
	object-fit: cover;
}

.group-item:hover {
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Selecteerbare groepen */
.selectable {
	cursor: pointer;
	border: 2px dashed #0078a5;
	padding: 5px;
}

.selected {
	border: 3px solid #0078a5;
	background-color: rgba(0, 120, 165, 0.1);
}

.popup {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: white;
	padding: 25px;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	width: 320px;
	text-align: center;
	z-index: 1000;
}

.popup h3 {
	margin-bottom: 15px;
	color: #333;
}

.popup button {
	width: 100%;
	padding: 10px;
	margin-top: 10px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 14px;
	font-weight: bold;
}

.confirm-btn {
	background-color: #4caf50;
	color: white;
	transition: background 0.3s ease;
}

.confirm-btn:hover {
	background-color: #45a049;
}

.cancel-btn {
	background-color: #f44336;
	color: white;
	transition: background 0.3s ease;
}

.cancel-btn:hover {
	background-color: #d32f2f;
}

.input-field {
	width: 100%;
	padding: 10px;
	margin-top: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	font-size: 14px;
}

.send-btn {
	background-color: #008cba;
	color: white;
	border: none;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
	margin-top: 10px;
	transition: background 0.3s ease;
}

.send-btn:hover {
	background-color: #0078a5;
}

.invite-sent-message {
	margin-top: 20px;
	color: green;
	font-weight: bold;
}

.success-message {
	margin-top: 10px;
	color: #4caf50;
	font-weight: bold;
	font-size: 14px;
}

.add-group-form {
	background: white;
	padding: 20px;
	border-radius: 10px;
	width: 320px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	text-align: center;
	margin: 20px auto;
}

.add-group-form input {
	width: 100%;
	padding: 10px;
	margin-top: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	font-size: 14px;
}

.add-group-form button {
	width: 100%;
	padding: 10px;
	margin-top: 10px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 14px;
	font-weight: bold;
}

.add-group-form button:first-child {
	background-color: #008cba;
	color: white;
	transition: background 0.3s ease;
}

.add-group-form button:first-child:hover {
	background-color: #0078a5;
}

.add-group-form button:last-child {
	background-color: #f44336;
	color: white;
	transition: background 0.3s ease;
}

.add-group-form button:last-child:hover {
	background-color: #d32f2f;
}

.custom-dropdown {
	position: relative;
	display: inline-block;
	width: 100%;
	margin-top: 10px;
}

.selected-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	cursor: pointer;
	background: white;
}

.icon-list {
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	max-height: 200px;
	overflow-y: auto;
	background: white;
	border: 1px solid #ddd;
	border-radius: 5px;
	z-index: 10;
	list-style: none;
	padding: 0;
	margin: 5px 0 0;
}

.icon-item {
	display: flex;
	align-items: center;
	padding: 10px;
	cursor: pointer;
	transition: background 0.2s ease;
}

.icon-item:hover {
	background: #f0f0f0;
}
</style>
