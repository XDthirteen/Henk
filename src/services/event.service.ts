/*#####################################
/
/      #  event.service.ts
/      #  ==================
/      #  Beschrijving:
/      #  ------------
/      #  Alle typescript code dat te maken heeft met "calendar events"
/
/      #  Auteur: Jorn Vierbergen
/      #  Datum aangemaakt: 13/02/2025
/
#################
/
/      Changelog:
/      ----------
/       13/02/2025 - Jorn Vierbergen
/           - Opmaken van service voor "events"
/
/      Opmerkingen:
/      ------------
/      ...
/
#####################################*/
//import axios, { AxiosRequestConfig } from 'axios'
import axios from 'axios'

const apiBasePath = '/api'

let apiToken = localStorage.getItem('token')
console.log(apiToken)
//let apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc0MjEyMjEwOSwiZXhwIjoxNzQyMTI1NzA5fQ.P8ayjFGLXy4pE1OwuWHGRvNRbE5R6qCuaZBazn5Ql50'

const testing = false

let testData = [
	{
		id: 3,
		groupId: 4,
		organizer: 5,
		title: 'test1',
		description: 'string',
		start: '2025-03-21T10:43:25.668Z',
		end: '2025-03-21T10:43:25.668Z',
		createdAt: '2025-02-19T18:56:27.805Z',
		updatedAt: '2025-02-19T18:56:27.898Z',
	},
	{
		id: 4,
		groupId: 4,
		organizer: 5,
		title: 'test2',
		description: 'string',
		start: '2025-03-19T20:43:25.668Z',
		end: '2025-03-19T20:43:25.668Z',
		createdAt: '2025-02-19T18:56:27.805Z',
		updatedAt: '2025-02-19T18:56:27.898Z',
	},
	{
		id: 5,
		groupId: 0,
		organizer: 5,
		title: 'test3',
		description: 'string',
		start: '2025-03-18T20:43:25.668Z',
		end: '2025-03-18T20:43:25.668Z',
		createdAt: '2025-02-19T18:56:27.805Z',
		updatedAt: '2025-02-19T18:56:27.898Z',
	},
	{
		id: 6,
		groupId: 1,
		organizer: 5,
		title: 'test4',
		description: 'string',
		start: '2025-03-18T20:43:25.668Z',
		end: '2025-03-18T20:43:25.668Z',
		createdAt: '2025-02-19T18:56:27.805Z',
		updatedAt: '2025-02-19T18:56:27.898Z',
	},
]

const handleError = (error) =>{
	console.log(error)
	console.log(error.response.status)
	console.log("Hi, fancy seeing you here. FIX IT!")
}

export const eventService = () => {
	const config = {
		headers: {
			Authorization: `Bearer ${apiToken}`,
			accept: 'application/json',
		},
	}

	const getData = async (apiPath) => {
		console.log("API CALL")
		if (testing) return testData
			
		try {
			const response = await axios.get(`${apiBasePath}/${apiPath}`, config)
			return response.data
		} catch (error) {
			handleError(error)
		}
	}

	const postData = async (apiPath, data) => {
		console.log('API CALL')
		try {
			const response = await axios.post(`${apiBasePath}/${apiPath}`, data, config)
			return response.data
		} catch (error) {
			handleError(error)
		}
	}

	// return functions
	return { getData, postData };

}

/*
(async () => {
	const data = await eventService()
	console.log('Fetched Events:', data)
})()
*/
