import axios from "axios";

axios.defaults.withCredentials = true;

// API base URL from your backend
const BASE_URL =
  "https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net";

// =====================
// Interfaces
// =====================

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
  Action: number;
  Adventure: number;
  Anime_Series_International_TV_Shows: number;
  British_TV_Shows_Docuseries_International_TV_Shows: number;
  Children: number;
  Comedies: number;
  Comedies_Dramas_International_Movies: number;
  Comedies_International_Movies: number;
  Comedies_Romantic_Movies: number;
  Crime_TV_Shows_Docuseries: number;
  Documentaries: number;
  Documentaries_International_Movies: number;
  Docuseries: number;
  Dramas: number;
  Dramas_International_Movies: number;
  Dramas_Romantic_Movies: number;
  Family_Movies: number;
  Fantasy: number;
  Horror_Movies: number;
  International_Movies_Thrillers: number;
  International_TV_Shows_Romantic_TV_Shows_TV_Dramas: number;
  Kids__TV: number;
  Language_TV_Shows: number;
  Musicals: number;
  Nature_TV: number;
  Reality_TV: number;
  Spirituality: number;
  TV_Action: number;
  TV_Comedies: number;
  TV_Dramas: number;
  Talk_Shows_TV_Comedies: number;
  Thrillers: number;
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
  Netflix: number;
  Amazon_Prime: number;
  Disney_: number;
  Paramount_: number;
  Max: number;
  Hulu: number;
  Apple_TV_: number;
  Peacock: number;
  city: string;
  state: string;
  zip: number;
}

export interface GenreRecommendation {
  user_id: number;
  genre: string;
  recommendations: string[]; // This will be parsed from JSON string
}

// =====================
// Movie CRUD
// =====================

export const fetchAllMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const fetchMovieById = async (showId: string): Promise<Movie | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/movies/${showId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie with ID ${showId}:`, error);
    return null;
  }
};

export const deleteMovie = async (showId: string): Promise<boolean> => {
  try {
    await axios.delete(`${BASE_URL}/movies/${showId}`, {
      withCredentials: true
    });
    return true;
  } catch (error) {
    console.error(`Error deleting movie with ID ${showId}:`, error);
    return false;
  }
};

export const updateMovie = async (movie: Movie): Promise<boolean> => {
  try {
    await axios.put(`${BASE_URL}/movies/${movie.show_id}`, movie, {
      withCredentials: true
    });
    return true;
  } catch (error) {
    console.error(`Error updating movie with ID ${movie.show_id}:`, error);
    return false;
  }
};

export const addMovie = async (movie: Movie): Promise<Movie | null> => {
  try {
    const response = await axios.post(`${BASE_URL}/movies`, movie);
    return response.data;
  } catch (error) {
    console.error("Error adding new movie:", error);
    return null;
  }
};

// =====================
// Recommendations
// =====================

export const fetchRecommendations = async (
  title: string
): Promise<string[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Recommendations/Show?title=${encodeURIComponent(title)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

export const fetchUserRecommendations = async (
  userId: number
): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/Recommendations/User/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user recommendations for ID ${userId}:`, error);
    return [];
  }
};

export const fetchGenreRecommendations = async (
  userId: number
): Promise<GenreRecommendation[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/Recommendations/Genre/${userId}`);
    const parsed = response.data.map((rec: any) => ({
      ...rec,
      recommendations: JSON.parse(rec.recommendations)
    }));
    return parsed;
  } catch (error) {
    console.error(`Error fetching genre recommendations for user ${userId}:`, error);
    return [];
  }
};