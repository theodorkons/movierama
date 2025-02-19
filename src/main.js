import "./style.css";
import {
  createErrorPopup,
  createMovieCard,
  createSomethingWentWrong,
} from "./ui/create";
import { clearMovies } from "./ui/helpers";

const apiUrl = "https://api.themoviedb.org/3";
const apiKey = "bc50218d91157b1ba4f142ef7baaa6a0";
let nowPlayingCurrentPage = 1;
let searchingCurrentPage = 1;
let userSearching = false;
let searchQuery = "";
let nowPlayingController = new AbortController();
let searchController = new AbortController();
let modalController = new AbortController();
let reviewsController = new AbortController();
let videosController = new AbortController();

const loader = document.getElementById("movieLoader");
const searchBar = document.getElementById("searchBar");

async function fetchNowPlayingMovies() {
  searchController.abort();
  nowPlayingController = new AbortController();
  try {
    const response = await fetch(
      `${apiUrl}/movie/now_playing?language=en-US&page=${nowPlayingCurrentPage}&api_key=${apiKey}`,
      { signal: nowPlayingController.signal }
    );
    if (!response.ok) throw new Error("Failed to fetch movies");
    const movies = await response.json();
    movies.results.forEach((movie) => {
      createMovieCard(movie);
    });
  } catch (e) {
    createSomethingWentWrong();
  }
}

export async function fetchMovieDetails(movieId) {
  modalController.abort();
  modalController = new AbortController();
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}?language=en-US&api_key=${apiKey}`,
      { signal: modalController.signal }
    );
    if (!response.ok) throw new Error("Could not find movie details");

    const movie = await response.json();
    return movie;
  } catch (error) {
    createErrorPopup(error);
    return null;
  }
}

export async function fetchMovieVideos(movieId) {
  videosController.abort();
  videosController = new AbortController();
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}/videos?language=en-US&api_key=${apiKey}`,
      { signal: videosController.signal }
    );
    if (!response.ok) throw new Error("Could not find movie trailer");

    const videos = await response.json();
    return videos;
  } catch (error) {
    createErrorPopup(error);
    return null;
  }
}

export async function fetchMovieReviews(movieId) {
  reviewsController.abort();
  reviewsController = new AbortController();
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}/reviews?language=en-US&api_key=${apiKey}`,
      { signal: reviewsController.signal }
    );
    if (!response.ok) throw new Error("Could not find reviews");

    const reviews = await response.json();
    return reviews;
  } catch (error) {
    createErrorPopup(error);
    return null;
  }
}

export async function fetchSearchResults(query) {
  nowPlayingController.abort();
  if (!query || query.trim() === "") {
    // if user cleared search query clear search results and render now playing
    userSearching = false;
    searchQuery = "";
    nowPlayingCurrentPage = 1;
    clearMovies();
    return;
  }
  searchController.abort();
  searchController = new AbortController();
  if (query !== searchQuery) {
    // if user changed input, clear previous results and render new ones
    searchingCurrentPage = 1;
    clearMovies();
  }
  userSearching = true;
  searchQuery = query;

  try {
    const response = await fetch(
      `
      ${apiUrl}/search/movie?query=${encodeURIComponent(
        query
      )}&page=${searchingCurrentPage}&language=en-US&api_key=${apiKey}`,
      { signal: searchController.signal }
    );
    if (!response.ok) throw new Error("Failed to fetch movie reviews");
    const movies = await response.json();
    movies.results.forEach((movie) => {
      createMovieCard(movie);
    });
    searchingCurrentPage++;
    return movies;
  } catch (error) {
    if (error.name !== "AbortError") createSomethingWentWrong();
    return null;
  }
}

const observer = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting) {
      try {
        if (userSearching) {
          fetchSearchResults(searchQuery);
        } else {
          await fetchNowPlayingMovies();
          nowPlayingCurrentPage++;
        }
      } catch {
        createSomethingWentWrong();
      }
    }
  },
  { threshold: 0.1 }
);

observer.observe(loader);

searchBar.addEventListener("click", () => {
  searchBar.classList.add("expand");
});

// document.getElementById("searchIcon").addEventListener("click", function () {
//   document.getElementById("searchInput").focus();
// });

window.fetchSearchResults = fetchSearchResults;
