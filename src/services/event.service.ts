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
/           - Added reading and posting service for "events"
/       24/05/2025 - Jorn Vierbergen
/           - Added deleting "events"
/
/      Opmerkingen:
/      ------------
/      ...
/
#####################################*/
import axios from 'axios';

const apiBasePath = '/api';

let apiToken = localStorage.getItem('token');
console.log(apiToken);

const handleError = (error: unknown) =>{
  console.log(error);
  if (axios.isAxiosError(error)) {
    console.log(error.response?.status);
  }

	console.log("Hi, fancy seeing you here. FIX IT!");
};

export const eventService = () => {
	const config = {
		headers: {
			Authorization: `Bearer ${apiToken}`,
			accept: 'application/json',
		},
	};

	const getData = async (apiPath: string) => {
		console.log("API CALL GET");
		try {
			const response = await axios.get(`${apiBasePath}/${apiPath}`, config)
			return response.data
		}
    catch (error) {
			handleError(error);
		};
	};

	const postData = async (apiPath: string, data: string) => {
		console.log('API CALL POST');
		try {
			const response = await axios.post(`${apiBasePath}/${apiPath}`, data, config);
			return response.data;
		} 
    catch (error) {
			handleError(error);
		};
	};

  const deleteData = async (apiPath: string) => {
		console.log('API CALL DELETE');
		try {
			const response = await axios.delete(`${apiBasePath}/${apiPath}`, config);
      console.log(response);
			return response.data;
		} 
    catch (error) {
			handleError(error);
		};
	};

	return { getData, postData, deleteData };
};
