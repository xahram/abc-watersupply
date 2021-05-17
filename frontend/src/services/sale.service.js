import axios from "../utils/axios";

class SaleService {
  getAllSalesRecord = async () => {
    try {
      const response = await axios.get("sales/getSales");

      if (response.status === 200 || response.status === 201)
        return Promise.resolve(response.data);

      return Promise.reject(response.data);
    } catch (error) {
      return Promise.reject(error.response.data.message);
    }
  };
}

const saleService = new SaleService();

export default saleService;
