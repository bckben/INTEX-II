import axios from 'axios';

// API base URL from your backend
const BASE_URL = 'https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net';

// Types from your C# models
export interface Movie {
  show_id: string;
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  action: number;
}

export interface MovieRating {
  user_id: number;
  show_id: string;
  rating: number;
}

export interface MovieUser {
  user_id: number;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  netflix: number;
  amazon_prime: number;
  disney_: number;
  paramount_: number;
  max: number;
}

// Fetch all movies
export const fetchAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

// Fetch a single movie by ID
export const fetchMovieById = async (showId: string): Promise<Movie | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/movies/${showId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie with ID ${showId}:`, error);
    return null;
  }
};

// Fetch recommendations for a movie by title
export const fetchRecommendations = async (title: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/Recommendations/Show?title=${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};