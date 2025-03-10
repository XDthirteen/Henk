import type { UserData, UserParamData } from "@/components/models";
import axios from "axios";
import { ref } from "vue";

const userToken = `Bearer ${localStorage.getItem("token")}`;


const userSettings = () => {
  const userInfo = ref<UserData | null>(null);

  const getUserInfo = async () => {
    try {
      const response = await axios.get<UserData>("/api/users/me", {
        headers: {
          Authorization: userToken
        }
      });

      const backendUserInfo = response.data;

      userInfo.value = {
        username: backendUserInfo.username,
        firstName: backendUserInfo.firstName,
        lastName: backendUserInfo.lastName,
        defaultLanguage: backendUserInfo.defaultLanguage,
        email: backendUserInfo.email
      };

      console.log(userInfo.value);
      return userInfo.value;
    } catch (error) {
      console.error('Error fetching userinfo: ', error);
      return null;
    }
  }

  const updateUserInfo = async (tempValues: {
    firstname: string;
    lastname: string;
    email: string;
    language: string;
  }) => {
    try {
      const response = await axios.put("/api/users/me", {
        firstName: tempValues.firstname,
        lastName: tempValues.lastname,
        email: tempValues.email,
        defaultLanguage: tempValues.language,
      }, {
        headers: {
          Authorization: userToken,
        }
      });
      console.log("User updated successfully:", response.data);
      return response.data;

    } catch (error) {
      console.error('Could not update user : ', error);
      return null;
    }
  }

  const userParam = ref<UserParamData | null>(null);

  const getUserParam = async () => {
    try {
      const response = await axios.get<UserParamData>("/api/users/preferences", {
        headers: {
          Authorization: userToken
        }
      });

      const backendUserInfo = response.data;

      userParam.value = {
        city: backendUserInfo.city,
        app: backendUserInfo.app,
        theme: backendUserInfo.theme
      };

      return userParam.value;
    } catch (error) {
      console.error('Error fetching user parameters: ', error);
      return null;
    }
  }

  const updateUserParam = async (tempValues: {
    city: string;
    app: string;
    theme: string
  }) => {
    try {
      const response = await axios.put("/api/users/preferences", {
        city: tempValues.city,
        app: tempValues.app,
        theme: tempValues.theme
      }, {
        headers: {
          Authorization: userToken,
        }
      });
      console.log("User parameters updated successfully:", response.data);
      return response.data;

    } catch (error) {
      console.error('Could not update user parameters : ', error);
      return null;
    }
  }

  return {
    getUserInfo,
    userInfo,
    updateUserInfo,
    getUserParam,
    userParam,
    updateUserParam
  }
};

export { userSettings }
