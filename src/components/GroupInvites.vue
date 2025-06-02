<template>
    <div class="container">
        <header>
            <h1>Group invites</h1>
            <button @click="navigateBack" class="close-button">✖</button>
        </header>

        <div v-if="invites.length === 0">
            <p>No invites available.</p>
        </div>

        <div v-else class="group-items-container">
            <div v-for="group in invites" :key="group.id" class="group-item" @click="openPopup(group)">
                <font-awesome-icon v-if="group.icon" :icon="['fas', group.icon]" class="group-fa-icon" />
                <img v-else-if="group.image" :src="group.image" alt="Group Icon" class="group-img-icon" />
                <img v-else :src="defaultIcon" alt="Default Group Icon" class="group-img-icon" />
                <span>{{ group.name }}</span>
            </div>
        </div>

        <div v-if="selectedGroup" class="popup-overlay">
            <div class="popup">
                <h2>Group Invitation</h2>
                <font-awesome-icon v-if="isValidIcon(selectedGroup.icon)" :icon="['fas', selectedGroup.icon]"
                    class="popup-icon" />
                <img v-else :src="defaultIcon" alt="Default Group Icon" class="popup-icon" />
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
import type { Group } from '@/components/models.ts'
import { useAuth } from '@/services/auth.service'

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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
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
)

const iconList = [
    'user',
    'coffee',
    'car',
    'dog',
    'bicycle',
    'home',
    'tree',
    'sun',
    'moon',
    'rocket',
]

const defaultIcon = '/images/default.png'

const invites = ref<Group[]>([])
const selectedGroup = ref<Group | null>(null)
const router = useRouter()

const isValidIcon = (icon: string) => iconList.includes(icon)

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

        console.log('API /api/invitations response:', response.data)

        interface InviteApiResponse {
            id: number
            invitedFor?: {
                id: number
                name: string
                image?: string
            }
        }

        invites.value = (response.data as InviteApiResponse[]).map((invite) => {
            const group = invite.invitedFor
            const isValidIcon = group && iconList.includes(group.image ?? '')
            return {
                id: group?.id ?? invite.id,
                name: group?.name ?? 'Onbekende groep',
                icon: isValidIcon ? (group?.image as string) : '',
                tasks: [],
                image: !isValidIcon ? group?.image : undefined,
                defaultGroup: false,
            }
        })
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
    color: var(--purple-text);
}

header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--input-border);
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

.group-items-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    width: 100%;
    max-width: 600px;
    margin: 30px auto 0 auto;
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

.group-item:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.group-fa-icon {
    font-size: 48px;
    margin-bottom: 8px;
    color: #008cba;
}

.group-img-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 8px;
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
    padding: 25px;
    border-radius: 12px;
    text-align: center;
    width: 320px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.popup-icon {
    font-size: 48px;
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
    color: #008cba;
    border-radius: 50%;
    object-fit: cover;
}

.popup-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.accept-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    flex: 1;
    margin: 5px;
    border-radius: 5px;
}

.decline-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    flex: 1;
    margin: 5px;
    border-radius: 5px;
}
</style>
