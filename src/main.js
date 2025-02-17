import "./style.css";
import { createMovieCard } from "./ui/create";
import { clearMovies } from "./ui/helpers";

const apiUrl = "https://api.themoviedb.org/3";
const apiKey = "bc50218d91157b1ba4f142ef7baaa6a0";
let nowPlayingCurrentPage = 1;
let searchingCurrentPage = 1;
let loading = false;
let userSearching = false;
let searchQuery = "";

const loader = document.getElementById("loaderContainer");
const searchBar = document.getElementById("searchBar");

function fetchNowPlayingMovies() {
  fetch(
    `${apiUrl}/movie/now_playing?language=en-US&page=${nowPlayingCurrentPage}&api_key=${apiKey}`
  )
    .then((response) => response.json())
    .then((movies) => {
      movies.results.forEach((movie) => {
        createMovieCard(movie);
      });
    })
    .catch((error) => console.error(error));
}

export async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}?language=en-US&api_key=${apiKey}`
    );
    if (!response.ok) throw new Error("Failed to fetch movie details");

    const movie = await response.json();
    return movie;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export async function fetchMovieVideos(movieId) {
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}/videos?language=en-US&api_key=${apiKey}&append_to_response=videos`
    );
    if (!response.ok) throw new Error("Failed to fetch movie videos");

    const videos = await response.json();
    return videos;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export async function fetchMovieReviews(movieId) {
  try {
    const response = await fetch(
      `${apiUrl}/movie/${movieId}/reviews?language=en-US&api_key=${apiKey}`
    );
    if (!response.ok) throw new Error("Failed to fetch movie reviews");

    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export async function fetchSearchResults(query) {
  if (!query || query.trim() === "") {
    userSearching = false;
    searchQuery = "";
    nowPlayingCurrentPage = 1;
    clearMovies();
    fetchNowPlayingMovies();
    return;
  }
  if (searchingCurrentPage === 1) clearMovies();
  userSearching = true;
  searchQuery = query;
  try {
    const response = await fetch(
      `${apiUrl}/search/movie?query=${encodeURIComponent(
        query
      )}&page=${searchingCurrentPage}?language=en-US&api_key=${apiKey}`
    );
    if (!response.ok) throw new Error("Failed to fetch movie reviews");
    const movies = await response.json();
    movies.results.forEach((movie) => {
      createMovieCard(movie);
    });
    return movies;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

const observer = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting && !loading) {
      loading = true;
      try {
        if (userSearching) {
          searchingCurrentPage++;
          fetchSearchResults(searchQuery);
        } else {
          nowPlayingCurrentPage++;
          await fetchNowPlayingMovies();
        }
      } catch {}
    }
    loading = false;
  },
  { threshold: 0.5 }
);

observer.observe(loader);

document.addEventListener("DOMContentLoaded", fetchNowPlayingMovies);

searchBar.addEventListener("click", () => {
  searchBar.classList.add("expand");
});

// document.getElementById("searchIcon").addEventListener("click", function () {
//   document.getElementById("searchInput").focus();
// });

window.fetchSearchResults = fetchSearchResults;
