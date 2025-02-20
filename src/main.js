import "./style.css";
import { createMovieCard, createSomethingWentWrong } from "./ui/create";
import {
  addLoader,
  clearMovies,
  removeLoader,
  resetErrorState,
} from "./ui/helpers";
import { fetchNowPlayingMovies, fetchSearchResults } from "./fetching";

let nowPlayingCurrentPage = 1;
let searchingCurrentPage = 1;
let userSearching = false;
let searchQuery = "";
let nowPlayingController = new AbortController();
let searchController = new AbortController();

const loader = document.getElementById("movieLoader");

const observer = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting) {
      try {
        if (userSearching) {
          const movies = await fetchSearchResults(
            searchQuery,
            searchingCurrentPage,
            searchController,
            observer
          );
          if (movies) {
            movies.results.forEach((movie) => {
              createMovieCard(movie);
            });
            searchingCurrentPage++;
          }
        } else {
          await getNowPlayingMovies();
          nowPlayingCurrentPage++;
        }
      } catch {
        createSomethingWentWrong(observer);
      }
    }
  },
  { threshold: 0.1 }
);

observer.observe(loader);

async function getNowPlayingMovies() {
  searchController.abort();
  nowPlayingController = new AbortController();
  const movies = await fetchNowPlayingMovies(
    nowPlayingCurrentPage,
    nowPlayingController,
    observer
  );
  if (movies) {
    movies.results.forEach((movie) => {
      createMovieCard(movie);
    });
  }
}

export async function getSearchResults(query) {
  resetErrorState();
  removeLoader(observer);
  nowPlayingController.abort();
  if (!query || query.trim() === "") {
    // if user cleared search query clear search results and render now playing
    userSearching = false;
    searchQuery = "";
    nowPlayingCurrentPage = 1;
    clearMovies();
    addLoader(observer);
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
  const movies = await fetchSearchResults(
    query,
    searchingCurrentPage,
    searchController,
    observer
  );
  movies.results.forEach((movie) => {
    createMovieCard(movie);
  });
  searchingCurrentPage++;
  addLoader(observer);
}

function debounce(func, delay = 500) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const searchInput = document.querySelector(".searchInput");

const debouncedSearch = debounce(getSearchResults, 500);

searchInput.addEventListener("input", (event) => {
  debouncedSearch(event.target.value, 1000);
});

document.querySelector(".searchIcon").addEventListener("click", function () {
  const searchNavbar = document.querySelector("#searchNavbar");
  searchNavbar.classList.toggle("active");
});

document.querySelector(".closeSearch").addEventListener("click", function () {
  const searchNavbar = document.querySelector("#searchNavbar");
  searchNavbar.classList.remove("active");
});
