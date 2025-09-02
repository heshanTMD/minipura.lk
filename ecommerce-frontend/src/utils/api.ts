import axios from "axios";

const API_BASE_URL = "https://your-api-url.com/api"; // Replace with your actual API base URL

// Product APIs
export const fetchProducts = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/products`);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/products/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// User APIs
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching user profile for id ${userId}:`, error);
    throw error;
  }
};

// Cart APIs
export const addToCart = async (cartItem: Record<string, any>) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/cart`, cartItem);
    return data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

export const fetchCartItems = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/cart`);
    return data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};