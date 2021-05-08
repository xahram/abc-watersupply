import axios from "../utils/axios";

class PaymentService {
  getAllPaymentsForUser = async (id) => {
    try {
      const response = await axios.post("payments/getPayments", { userId: id });

      console.log("[payment.service.js line 8] ", response);
      if (response.status === 200 || response.status === 201)
        return Promise.resolve(response.data);

      return Promise.reject(response.data);
    } catch (error) {
      return Promise.reject(error.response.data.message);
    }
  };
}

const paymentService = new PaymentService();

export default paymentService;
