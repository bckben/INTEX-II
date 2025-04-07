import axios from 'axios';

// API base URL from your backend
const APP_URL = 'https://cineniche-backend-ben-d6cqgbceadgcc4dg.eastus-01.azurewebsites.net/movies';

// Types based on your C# models
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

// API functions
export const fetchAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(APP_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieById = async (showId: string): Promise<Movie | null> => {
  try {
    const response = await axios.get(`${APP_URL}/${showId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie with ID ${showId}:`, error);
    return null;
  }
};

// Additional API functions can be added as needed
// For example:
// export const searchMovies = async (searchTerm: string): Promise<Movie[]> => {
//   try {
//     const response = await axios.get(`${APP_URL}/search?term=${searchTerm}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error searching movies:', error);
//     return [];
//   }
// };