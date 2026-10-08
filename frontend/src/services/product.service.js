import api from "./api";

export const getProducts = async (search = "", category = "", sort = "") => {
  try {
    let queryParams = [];
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
    if (sort) queryParams.push(`sort=${encodeURIComponent(sort)}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    
    const response = await api.get(`/products${queryString}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Error fetching products" };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Error fetching product details" };
  }
};
