import axios from "../utils/axios";

class CustomersService {
  getAllCustomers = async () => {
    try {
      const response = await axios.get("auth/allUsers");

      console.log("[customers.service.js line 8] ", response);
      if (response.status === 200 || response.status === 201)
        return Promise.resolve(response.data);

      return Promise.reject(response.data);
    } catch (error) {
      return Promise.reject(error.response.data.message);
    }
  };

  updateCustomer = async (customer) => {
    try {
      const response = await axios.patch("auth/updateUser",customer);

      console.log("[customers.service.js line 22] ", response);
      if (response.status === 200 || response.status === 201)
        return Promise.resolve(response.data);

      return Promise.reject(response.data);
    } catch (error) {
      return Promise.reject(error.response.data.message);
    }
  };
}

const customersService = new CustomersService();

export default customersService;
