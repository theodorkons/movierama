export function formatRating(rating) {
  return rating.toFixed(1);
}

export function closeMovieModal() {
  const movieInfoModal = document.getElementById("movieInfoModal");
  movieInfoModal.remove();
}

export function clearMovies() {
  document.getElementById("moviesContainer").replaceChildren();
}

export function clearModal() {
  const movieModal = document.getElementById("movieInfoModal");
  movieModal.remove();
}

export function getTrailerUrl(videos) {
  if (!videos || videos.length === 0) return;
  let video = null;
  for (let i = videos.length - 1; i >= 0; i--) {
    if (videos[i].type === "Trailer") {
      video = videos[i].key;
      break;
    }
  }
  //   video = video ? video : videos[0].key;
  return `https://www.youtube.com/watch?v=${video}`;
}
