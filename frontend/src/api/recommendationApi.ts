import axios from 'axios';

const BASE_URL = 'https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net';

export const getUserRecommendations = async (userId: number) => {
  const token = localStorage.getItem("token");

  const response = await axios.get<string[]>(`${BASE_URL}/Recommendations/User/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const getHybridRecommendations = async (title: string) => {
  const response = await axios.get<string[]>(`${BASE_URL}/Recommendations/Show?title=${encodeURIComponent(title)}`);
  return response.data;
};

export const getGenreBasedRecommendations = async (userId: number) => {
  const response = await axios.get(`${BASE_URL}/Recommendations/Genre/${userId}`);
  return response.data; 
};