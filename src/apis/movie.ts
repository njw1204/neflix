const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const API_KEY = "24201780ff4ecb878006e74fd886d90e";

export interface Movie {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  release_date: string;
  title: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  is_tv?: boolean;
}

interface Tv {
  backdrop_path?: string;
  first_air_date: string;
  genre_ids?: number[];
  id: number;
  name: string;
  origin_country?: string[];
  original_language: string;
  original_name: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieSearchResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface TvSearchResult {
  page: number;
  results: Tv[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetail {
  adult: boolean;
  backdrop_path?: string;
  budget?: number;
  genres?: {
    id: number;
    name: string;
  }[];
  homepage?: string;
  id: number;
  imdb_id?: string;
  original_language: string;
  original_title: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  release_date: string;
  revenue?: number;
  runtime?: number;
  status: string;
  tagline?: string;
  title: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  youtube_video_key?: string;
  is_tv?: boolean;
}

interface TvDetail {
  adult: boolean;
  backdrop_path?: string;
  episode_run_time?: number[];
  first_air_date: string;
  genres?: {
    id: number;
    name: string;
  }[];
  homepage?: string;
  id: number;
  in_production: boolean;
  languages?: string[];
  last_air_date: string;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country?: string[];
  original_language: string;
  original_name: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  status: string;
  tagline?: string;
  type: string;
  vote_average: number;
  vote_count: number;
  youtube_video_key?: string;
}

interface MovieVideoSearchResult {
  id: number;
  results?: {
    key: string;
    site: string;
    type: string;
  }[];
}

export async function getNowPlayingMovies() {
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

export async function searchMovies(keyword: string) {
  if (!keyword.trim()) {
    return null;
  }

  const movieSearchResult: MovieSearchResult = await fetch(
    `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      keyword
    )}&language=ko-KR&include_adult=false&page=1`
  ).then((response) => response.json());

  return movieSearchResult;
}

export async function getOnTheAirTvs() {
  const tvSearchResult: TvSearchResult = await fetch(
    `${API_BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());

  const movieSearchResult: MovieSearchResult = {
    page: tvSearchResult.page,
    total_pages: tvSearchResult.total_pages,
    total_results: tvSearchResult.total_results,
    results: tvSearchResult.results.map(convertTvToMovie),
  };

  return movieSearchResult;
}

export async function getAiringTodayTvs() {
  const tvSearchResult: TvSearchResult = await fetch(
    `${API_BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());

  const movieSearchResult: MovieSearchResult = {
    page: tvSearchResult.page,
    total_pages: tvSearchResult.total_pages,
    total_results: tvSearchResult.total_results,
    results: tvSearchResult.results.map(convertTvToMovie),
  };

  return movieSearchResult;
}

export async function getPopularTvs() {
  const tvSearchResult: TvSearchResult = await fetch(
    `${API_BASE_URL}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());

  const movieSearchResult: MovieSearchResult = {
    page: tvSearchResult.page,
    total_pages: tvSearchResult.total_pages,
    total_results: tvSearchResult.total_results,
    results: tvSearchResult.results.map(convertTvToMovie),
  };

  return movieSearchResult;
}

export async function getTopRatedTvs() {
  const tvSearchResult: TvSearchResult = await fetch(
    `${API_BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());

  const movieSearchResult: MovieSearchResult = {
    page: tvSearchResult.page,
    total_pages: tvSearchResult.total_pages,
    total_results: tvSearchResult.total_results,
    results: tvSearchResult.results.map(convertTvToMovie),
  };

  return movieSearchResult;
}

export async function searchTvs(keyword: string) {
  if (!keyword.trim()) {
    return null;
  }

  const tvSearchResult: TvSearchResult = await fetch(
    `${API_BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
      keyword
    )}&language=ko-KR&include_adult=false&page=1`
  ).then((response) => response.json());

  const movieSearchResult: MovieSearchResult = {
    page: tvSearchResult.page,
    total_pages: tvSearchResult.total_pages,
    total_results: tvSearchResult.total_results,
    results: tvSearchResult.results.map(convertTvToMovie),
  };

  return movieSearchResult;
}

export async function getMovieDetail(movieId: string) {
  if (!movieId) {
    return null;
  }

  const movieDetail: MovieDetail = await fetch(
    `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());

  const movieVideoSearchResult: MovieVideoSearchResult = await fetch(
    `${API_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
  ).then((response) => response.json());

  const youtubeVideoKey = movieVideoSearchResult.results?.find(
    (video) =>
      video.site.toLowerCase() === "youtube" &&
      video.type.toLowerCase() === "trailer"
  )?.key;

  if (youtubeVideoKey) {
    movieDetail.youtube_video_key = youtubeVideoKey;
  }

  return movieDetail;
}

export async function getTvDetail(tvId: string) {
  if (!tvId) {
    return null;
  }

  const tvDetail: TvDetail = await fetch(
    `${API_BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());

  const tvVideoSearchResult: MovieVideoSearchResult = await fetch(
    `${API_BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`
  ).then((response) => response.json());

  const youtubeVideoKey = tvVideoSearchResult.results?.find(
    (video) =>
      video.site.toLowerCase() === "youtube" &&
      video.type.toLowerCase() === "trailer"
  )?.key;

  if (youtubeVideoKey) {
    tvDetail.youtube_video_key = youtubeVideoKey;
  }

  return convertTvDetailToMovieDetail(tvDetail);
}

export function getImageFullUrl(image?: string, type?: string) {
  return image ? `${IMAGE_BASE_URL}/${type || "original"}/${image}` : "";
}

function convertTvToMovie(tv: Tv): Movie {
  return {
    adult: undefined,
    backdrop_path: tv.backdrop_path,
    genre_ids: tv.genre_ids,
    id: tv.id,
    original_language: tv.original_language,
    original_title: tv.original_name,
    overview: tv.overview,
    popularity: tv.popularity,
    poster_path: tv.poster_path,
    release_date: tv.first_air_date,
    title: tv.name,
    video: undefined,
    vote_average: tv.vote_average,
    vote_count: tv.vote_count,
    is_tv: true,
  };
}

function convertTvDetailToMovieDetail(tvDetail: TvDetail): MovieDetail {
  return {
    adult: tvDetail.adult,
    backdrop_path: tvDetail.backdrop_path,
    budget: undefined,
    genres: tvDetail.genres,
    homepage: tvDetail.homepage,
    id: tvDetail.id,
    imdb_id: undefined,
    original_language: tvDetail.original_language,
    original_title: tvDetail.original_name,
    overview: tvDetail.overview,
    popularity: tvDetail.popularity,
    poster_path: tvDetail.poster_path,
    release_date: tvDetail.first_air_date,
    revenue: undefined,
    runtime:
      tvDetail.episode_run_time && tvDetail.episode_run_time.length > 0
        ? tvDetail.episode_run_time[0]
        : undefined,
    status: tvDetail.status,
    tagline: tvDetail.tagline,
    title: tvDetail.name,
    video: undefined,
    vote_average: tvDetail.vote_average,
    vote_count: tvDetail.vote_count,
    youtube_video_key: tvDetail.youtube_video_key,
    is_tv: true,
  };
}
