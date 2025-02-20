export function formatRating(rating) {
  return rating ? rating.toFixed(1) : 0;
}

export function closeMovieModal() {
  const movieInfoModal = document.getElementById("movieInfoModal");
  if (!movieInfoModal) return;
  movieInfoModal.classList.add("closing");
  document.body.style.overflow = "";
  setTimeout(() => {
    movieInfoModal.remove();
  }, 300);
}

export function clearMovies() {
  document.getElementById("moviesContainer").replaceChildren();
}

export function clearModal() {
  const movieModal = document.getElementById("movieInfoModal");
  movieModal.remove();
}

export function getTrailerUrl(videos) {
  console.log(videos);
  const youtubeBaseUrl = import.meta.env.VITE_YOUTUBE_BASE_URL;
  if (!videos || videos.length === 0) return;
  let video = null;
  for (let i = videos.length - 1; i >= 0; i--) {
    if (videos[i].type === "Trailer") {
      video = videos[i].key;
      break;
    }
  }
  video = video ? video : videos[0].key;
  return `${youtubeBaseUrl}${video}`;
}

export function removeLoader(observer) {
  const loader = document.getElementById("movieLoader");
  if (loader) {
    observer.unobserve(loader);
    loader.remove();
  }
}

export function addLoader(observer) {
  const loaderContainer = document.getElementById("loaderContainer");
  let loader = document.getElementById("movieLoader");
  if (loader) return;
  loader = document.createElement("div");
  loader.classList.add("loader");
  loader.setAttribute("id", "movieLoader");
  loaderContainer.appendChild(loader);
  observer.observe(loader);
}

export function resetErrorState() {
  const noMoviesFound = document.getElementById("noMoviesFound");
  if (!noMoviesFound) return;
  noMoviesFound.remove();
}
