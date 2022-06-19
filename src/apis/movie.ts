const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const API_KEY = "24201780ff4ecb878006e74fd886d90e";

export interface Movie {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieSearchResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function getMovies() {
  const movieSearchResult: MovieSearchResult = await fetch(
    `${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());

  return movieSearchResult;
}

export async function getPopularMovies() {
  const movieSearchResult: MovieSearchResult = await fetch(
    `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());

  return movieSearchResult;
}

export async function getTopRatedMovies() {
  const movieSearchResult: MovieSearchResult = await fetch(
    `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());

  return movieSearchResult;
}

export async function getUpcomingMovies() {
  const movieSearchResult: MovieSearchResult = await fetch(
    `${API_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());

  return movieSearchResult;
}

export function getImageFullUrl(image: string, type?: string) {
  return image ? `${IMAGE_BASE_URL}/${type || "original"}/${image}` : "";
}
