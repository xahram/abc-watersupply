import axios from "../utils/axios";

class AuthService {
  login = async (credentials) => {
    try {
      const response = await axios.post("auth/login", credentials);

      console.log("[auth.service.js line 8] ", response);
      if (response.status === 200 || response.status === 201)
        return Promise.resolve(response.data);

      return Promise.reject(response.data);
    } catch (error) {
      // console.log(error.response.data);
      // console.log(error.response.status);
      console.log("aut.service")
      return Promise.reject(error.response.data.message);
    }
  };
}

const authService = new AuthService();

export default authService;
