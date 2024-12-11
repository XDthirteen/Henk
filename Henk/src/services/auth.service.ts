// const login = async (email: string, password: string) => {
//     try {
//         const response = await axios.post<{token: string}>("https://syntra-20242025-henk-api.onrender.com/api/auth/login", {
//             email: email,
//             password: password
//         });
//         const token = response.data.token;
//         localStorage.setItem("token", token);
//         isAuthenticated.value = true;
//     } catch (error) {
//         throw new Error(`Login wrong. Error: ${error}`);
//     }
// }