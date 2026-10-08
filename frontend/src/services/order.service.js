import api from "./api";

export const createPaymentOrder = async (shippingAddress) => {
  try {
    const response = await api.post("/orders/create-payment-order", { shippingAddress });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Error creating order" };
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post("/orders/verify-payment", paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Error verifying payment" };
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Error fetching orders" };
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Error fetching order" };
  }
};
