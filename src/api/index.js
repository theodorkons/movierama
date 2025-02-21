import { createErrorPopup, createSomethingWentWrong } from "../ui/create";

const apiUrl = import.meta.env.VITE_TMDB_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export async function fetchNowPlayingMovies(
  nowPlayingCurrentPage,
  controller,
  observer
) {
  try {
    const response = await fetch(
      `${apiUrl}/movie/now_playing?language=en-US&page=${nowPlayingCurrentPage}&api_key=${apiKey}`,
      { signal: controller.signal }
    );
    if (!response.ok) throw new Error("Failed to fetch movies");
    const movies = await response.json();
    return movies;
  } catch (error) {
    if (error.name !== "AbortError") createSomethingWentWrong(observer);
  }
}

export async function fetchMovieDetails(movieId, controller) {
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}?language=en-US&api_key=${apiKey}`,
      { signal: controller.signal }
    );
    if (!response.ok) throw new Error("Could not find movie details");

    const movie = await response.json();
    return movie;
  } catch (error) {
    if (error.name !== "AbortError") createErrorPopup(error);
  }
}

export async function fetchMovieVideos(movieId, controller) {
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}/videos?language=en-US&api_key=${apiKey}`,
      { signal: controller.signal }
    );
    if (!response.ok) throw new Error("Could not find movie trailer");

    const videos = await response.json();
    return videos;
  } catch (error) {
    if (error.name !== "AbortError") createErrorPopup(error);
  }
}

export async function fetchMovieReviews(movieId, controller) {
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}/reviews?language=en-US&api_key=${apiKey}`,
      { signal: controller.signal }
    );
    if (!response.ok) throw new Error("Could not find reviews");

    const reviews = await response.json();
    return reviews;
  } catch (error) {
    if (error.name !== "AbortError") createErrorPopup(error);
  }
}

export async function fetchSimilarMovies(movieId, controller) {
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}/similar?language=en-US&api_key=${apiKey}`,
      { signal: controller.signal }
    );
    if (!response.ok) throw new Error("Could not find similar movies");

    const similarMovies = await response.json();
    return similarMovies;
  } catch (error) {
    if (error.name !== "AbortError") createErrorPopup(error);
  }
}

export async function fetchSearchResults(
  query,
  searchingCurrentPage,
  controller,
  observer
) {
  try {
    const response = await fetch(
      `
      ${apiUrl}/search/movie?query=${encodeURIComponent(
        query
      )}&page=${searchingCurrentPage}&language=en-US&api_key=${apiKey}`,
      { signal: controller.signal }
    );
    if (!response.ok) throw new Error("Failed to fetch movie reviews");
    const movies = await response.json();
    return movies;
  } catch (error) {
    if (error.name !== "AbortError") createSomethingWentWrong(observer);
  }
}
