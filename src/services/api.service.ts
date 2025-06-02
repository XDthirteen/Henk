/*#####################################
/
/ # api.service.ts
/ # ==================
/ # Description:
/ # ------------
/ # All functions needed for a rest api
/
/ # Author: Jorn Vierbergen
/ # Creation date: 13/02/2025
/
#################
/
/ Changelog:
/ ----------
/ 13/02/2025 - Jorn Vierbergen
/ - Added reading and posting service for "events"
/ 24/05/2025 - Jorn Vierbergen
/ - Added deleting "events"
/ 26/05/2025 - Jorn Vierbergen
/ - Added put "events"
/ - Changed event.service.ts to api.service.ts
/ - Added default config for HENK api
/ 28/05/2025 - Jorn Vierbergen
/ - Added error handeling with messages and status
/
/ To do:
/
/ Comments:
/ ------------
/ None
/
#####################################*/
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

export type ApiError = { error: true; status: number | null; message: string }

// check if data is apiError, since we can not be sure if a api will not give a status back
export const isApiError = (data: unknown): data is ApiError => {
	if (typeof data !== 'object' || data === null) {
		return false
	}

	const copy = { ...data }

	// check if the correct keys are in the object
	if (!('error' in copy) || !('status' in copy) || !('message' in copy)) {
		return false
	}

	// check if the keys have the correct type
	if (
		copy.error !== true ||
		(typeof copy.status !== 'number' && copy.status !== null) ||
		typeof copy.message !== 'string'
	) {
		return false
	}

	// remove keys in copy to check if something remains, nothing should
	delete copy.error
	delete copy.status
	delete copy.message

	if (Object.keys(copy).length > 0) {
		return false
	}

	return true
};

// change console logs and warnings to error popup when component is finished.
const apiHandleError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		const { response, request, message } = error
		if (!response) {
			if (!request) {
				return { error: true, status: null, message: `Request failed: ${message}` }
			}
			return {
				error: true,
				status: null,
				message: `Network error or no response from the server.`,
			}
		}

		const status = response.status
		switch (status) {
			case 400:
				return {
					error: true,
					status,
					message: `Bad request.`,
				}
			case 401:
				return {
					error: true,
					status,
					message: `Unauthorized. Token may be missing or expired.`,
				}
			case 403:
				return {
					error: true,
					status,
					message: `Forbidden. You don't have permission to perform this action.`,
				}
			case 404:
				return {
					error: true,
					status,
					message: `Not found. The requested item could not be found.`,
				}
			case 422:
				return {
					error: true,
					status,
					message: `Validation error: ${JSON.stringify(response.data?.errors || response.data)}`,
				}
			case 500:
				return {
					error: true,
					status,
					message: `Internal server error. Try again later.`,
				}
			default:
				return {
					error: true,
					status,
					message: `Unexpected error. Status: ${status}`,
				}
		}
	}

	return { error: true, status: null, message: `An unexpected error occurred: ${error}` }
}

export const apiService = () => {
	// default configuration for HENK api
	const getDefaultConfig = (): AxiosRequestConfig => {
		const token = localStorage.getItem('token')
		console.log(token)
		return {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		}
	}

	const setConfig = (apiPath: string, config?: AxiosRequestConfig): AxiosRequestConfig => {
		return apiPath.startsWith('/api') ? getDefaultConfig() : config || {}
	}

	const getData = async (apiPath: string, config?: AxiosRequestConfig) => {
		console.log('API CALL GET')
		try {
			const response = await axios.get(apiPath, setConfig(apiPath, config))
			return response.data
		} catch (error) {
			return apiHandleError(error)
		}
	}

	const postData = async (apiPath: string, data: string, config?: AxiosRequestConfig) => {
		console.log('API CALL POST')
		try {
			const response = await axios.post(apiPath, data, setConfig(apiPath, config))
			return response.data
		} catch (error) {
			return apiHandleError(error)
		}
	}

	const putData = async (apiPath: string, data: string, config?: AxiosRequestConfig) => {
		console.log('API CALL PUT')
		try {
			const response = await axios.put(apiPath, data, setConfig(apiPath, config))
			return response.data
		} catch (error) {
			return apiHandleError(error)
		}
	}

	const deleteData = async (apiPath: string, config?: AxiosRequestConfig) => {
		console.log('API CALL DELETE')
		try {
			const response = await axios.delete(apiPath, setConfig(apiPath, config))
			return response.data
		} catch (error) {
			return apiHandleError(error)
		}
	}

	return { getData, postData, putData, deleteData }
}
