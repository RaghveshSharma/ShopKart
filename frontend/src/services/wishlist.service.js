import api from "./api";

export const getWishlist = async () => {
  try {
    const response = await api.get("/wishlist");
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || { success: false, message: "Error fetching wishlist" };
    errorData.status = error.response?.status;
    throw errorData;
  }
};

export const toggleWishlist = async (productId) => {
  try {
    const response = await api.patch(`/wishlist/${productId}/toggle`);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || { success: false, message: "Error toggling wishlist" };
    errorData.status = error.response?.status;
    throw errorData;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data || { success: false, message: "Error removing from wishlist" };
    errorData.status = error.response?.status;
    throw errorData;
  }
};
