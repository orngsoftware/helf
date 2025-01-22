import axios from 'axios';

const API_MAIN_URI_BASE = 'http://localhost:5000';

export const getAllProducts = async (): Promise<any> => {
    const response = await axios.get(`${API_MAIN_URI_BASE}/all-products`);  
    return response.data;
}

export const getProductByID = async (productId: string | number): Promise<any> => { 
    const response = await axios.get(`${API_MAIN_URI_BASE}/product/${productId}`); 
    return response.data;
}