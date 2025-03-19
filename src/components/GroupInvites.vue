<template>
	<div class="container">
		<button @click="navigateBack" class="close-button">✖</button>
		<h1>Group invites</h1>

		<div v-if="invites.length === 0">
			<p>No invites available.</p>
		</div>

		<div class="invite-container">
			<div
				v-for="group in invites"
				:key="group.id"
				class="invite-item"
				@click="openPopup(group)"
			>
				<img :src="group.icon" :alt="group.name" class="invite-icon" />
				<span>{{ group.name }}</span>
			</div>
		</div>

		<div v-if="selectedGroup" class="popup-overlay">
			<div class="popup">
				<h2>Group Invitation</h2>
				<img :src="selectedGroup!.icon" :alt="selectedGroup!.name" class="popup-icon" />
				<p>{{ selectedGroup.name }}</p>
				<div class="popup-buttons">
					<button class="accept-btn" @click="acceptInvite">Accept</button>
					<button class="decline-btn" @click="declineInvite">Decline</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { Group } from '@/types/Group'
import { useAuth } from '@/services/auth.service'

const invites = ref<Group[]>([])
const selectedGroup = ref<Group | null>(null)
const router = useRouter()

const navigateBack = () => {
	router.go(-1)
}

const openPopup = (group: Group) => {
	selectedGroup.value = group
}

const acceptInvite = async () => {
	if (selectedGroup.value) {
		try {
			const { getAuthToken } = useAuth()
			const token = getAuthToken()

			if (!token) {
				throw new Error('No authentication token found.')
			}

			await axios.post(
				`/api/invitations/${selectedGroup.value.id}/accept`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)

			invites.value = invites.value.filter((invite) => invite.id !== selectedGroup.value!.id)
			selectedGroup.value = null
		} catch (error) {
			console.error('Error accepting invite:', error)
			alert('Failed to accept invite.')
		}
	}
}

const declineInvite = async () => {
	if (selectedGroup.value) {
		try {
			const { getAuthToken } = useAuth()
			const token = getAuthToken()

			if (!token) {
				throw new Error('No authentication token found.')
			}

			await axios.post(
				`/api/invitations/${selectedGroup.value.id}/reject`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)

			invites.value = invites.value.filter((invite) => invite.id !== selectedGroup.value!.id)
			selectedGroup.value = null
		} catch (error) {
			console.error('Error declining invite:', error)
			alert('Failed to decline invite.')
		}
	}
}

const fetchInvites = async () => {
	try {
		const { getAuthToken } = useAuth()
		const token = getAuthToken()

		if (!token) {
			throw new Error('No authentication token found.')
		}

		const response = await axios.get('/api/invitations', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		invites.value = response.data
	} catch (error) {
		console.error('Error fetching invitations:', error)
		alert('Failed to fetch invitations. Please make sure you are logged in.')
	}
}

onMounted(() => {
	fetchInvites()
})
</script>

<style scoped>
.container {
	text-align: center;
	padding: 20px;
	position: relative;
}

.close-button {
	position: absolute;
	right: 15px;
	top: 15px;
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
}

.invite-container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
	justify-content: center;
	margin-top: 20px;
}

.invite-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
	transition: transform 0.2s ease-in-out;
}

.invite-item:hover {
	transform: scale(1.1);
}

.invite-icon {
	width: 80px;
	height: 80px;
	border-radius: 50%;
}

.popup-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
}

.popup {
	background: white;
	padding: 20px;
	border-radius: 10px;
	text-align: center;
	width: 250px;
}

.popup-icon {
	width: 60px;
	height: 60px;
	margin-bottom: 10px;
}

.popup-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 15px;
}

.accept-btn {
	background-color: green;
	color: white;
	border: none;
	padding: 10px;
	cursor: pointer;
	flex: 1;
	margin: 5px;
}

.decline-btn {
	background-color: red;
	color: white;
	border: none;
	padding: 10px;
	cursor: pointer;
	flex: 1;
	margin: 5px;
}
</style>
