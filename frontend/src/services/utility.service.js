import axios from "../utils/axios";

class UtilityService {
  getAllUtilities = async () => {
    try {
      const response = await axios.get("admin/utility");

      console.log("[utility.service.js line 8] ", response);
      if (response.status === 200 || response.status === 201)
        return Promise.resolve(response.data);

      return Promise.reject(response.data);
    } catch (error) {
      return Promise.reject(error.response.data.message);
    }
  };
}

const utilityService = new UtilityService();

export default utilityService;
