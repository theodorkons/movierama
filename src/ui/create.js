import {
  clearModal,
  closeMovieModal,
  getTrailerUrl,
  formatRating,
  removeLoader,
} from "./helpers";
import {
  fetchMovieDetails,
  fetchMovieReviews,
  fetchMovieVideos,
  fetchSimilarMovies,
} from "../api/index";
const baseImageUrl = import.meta.env.VITE_IMAGES_BASE_URL;
const maxRating = import.meta.env.VITE_MAX_RATING;
let movieDetailsController = new AbortController();
let reviewsController = new AbortController();
let videosController = new AbortController();
let similarMoviesController = new AbortController();

export function createMovieCard(movie, node) {
  const moviesContainer = document.getElementById("moviesContainer");
  const movieCard = document.createElement("div");
  movieCard.classList.add("movieCard");
  movieCard.setAttribute("id", movie.id);

  movieCard.addEventListener("click", async () => {
    movieDetailsController.abort();
    reviewsController.abort();
    videosController.abort();
    similarMoviesController.abort();
    movieDetailsController = new AbortController();
    reviewsController = new AbortController();
    videosController = new AbortController();
    similarMoviesController = new AbortController();
    const result = await fetchMovieDetails(movie.id, movieDetailsController);
    const videos = await fetchMovieVideos(movie.id, videosController);
    const reviews = await fetchMovieReviews(movie.id, reviewsController);
    const similarMovies = await fetchSimilarMovies(
      movie.id,
      similarMoviesController
    );
    if (result)
      createMovieModal(
        result,
        reviews?.results ?? [],
        videos?.results ?? [],
        similarMovies?.results ?? []
      );
  });

  const movieImage = document.createElement("img");
  movieImage.src = movie.poster_path
    ? `${baseImageUrl}${movie.poster_path}`
    : "/movie-placeholder.png";
  movieImage.alt = movie.title;

  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movieInfo");

  const ratingContainer = document.createElement("div");
  ratingContainer.classList.add("ratingContainer");

  const ratingStarIcon = document.createElement("img");
  ratingStarIcon.classList.add("ratingStarIcon");
  ratingStarIcon.src = "/icons/star-icon.svg";
  ratingStarIcon.alt = "rating star icon";

  const ratingText = document.createElement("p");
  ratingText.textContent = `${formatRating(movie.vote_average)}/${maxRating}`;

  ratingContainer.appendChild(ratingStarIcon);
  ratingContainer.appendChild(ratingText);

  const movieTitle = document.createElement("p");
  movieTitle.classList.add("movieTitle");
  movieTitle.textContent = movie.title;

  const movieYear = document.createElement("p");
  movieYear.classList.add("movieYear");
  movieYear.textContent = movie.release_date.split("-")[0];

  movieInfo.appendChild(ratingContainer);
  movieInfo.appendChild(movieTitle);
  movieInfo.appendChild(movieYear);

  movieCard.appendChild(movieImage);
  movieCard.appendChild(movieInfo);
  if (node) {
    node.appendChild(movieCard);
  } else {
    moviesContainer.appendChild(movieCard);
  }
}

export function createMovieModal(movie, movieReviews, videos, similarMovies) {
  const moviesContainer = document.getElementById("moviesContainer");
  const movieModal = document.getElementById("movieInfoModal");
  if (movieModal) clearModal();
  const movieInfoModal = document.createElement("div");
  movieInfoModal.setAttribute("id", "movieInfoModal");
  document.body.style.overflow = "hidden";

  const movieInfoModalContent = document.createElement("div");
  movieInfoModalContent.classList.add("movieInfoModalContent", "modalBox");
  movieInfoModal.appendChild(movieInfoModalContent);

  document.body.appendChild(movieInfoModal);

  setTimeout(() => {
    movieInfoModal.classList.add("active");
  }, 10);

  const movieThumbnail = document.createElement("div");
  movieThumbnail.classList.add("movieThumbnail");
  movieInfoModalContent.appendChild(movieThumbnail);

  const backArrow = document.createElement("img");
  backArrow.classList.add("backArrowButton");
  backArrow.src = "/icons/back-arrow.svg";
  backArrow.alt = "back button arrow";
  movieInfoModalContent.appendChild(backArrow);
  backArrow.addEventListener("click", () => {
    closeMovieModal();
  });
  const movieImage = document.createElement("img");
  movieImage.classList.add("thumbnailImage");
  movieImage.src = `${baseImageUrl}/${movie.poster_path}`;
  movieImage.alt = movie.title;
  movieThumbnail.appendChild(movieImage);

  const movieDetails = document.createElement("div");
  movieDetails.classList.add("movieDetails");
  movieThumbnail.appendChild(movieDetails);

  const movieDetailsDiv1 = document.createElement("div");
  movieDetails.appendChild(movieDetailsDiv1);

  const movieTitle = document.createElement("p");
  movieTitle.classList.add("movieTitle");
  movieTitle.textContent = movie.title;

  const movieYear = document.createElement("p");
  movieYear.classList.add("movieYear");
  movieYear.textContent = `(${new Date(movie.release_date).getFullYear()})`;

  movieDetailsDiv1.appendChild(movieTitle);
  movieDetailsDiv1.appendChild(movieYear);

  const trailerRatingContainer = document.createElement("div");
  movieDetails.appendChild(trailerRatingContainer);

  const ratingContainer = document.createElement("div");
  ratingContainer.classList.add("ratingContainer");
  trailerRatingContainer.appendChild(ratingContainer);

  const youtubeUrl = getTrailerUrl(videos);
  if (youtubeUrl) {
    const movieTrailerButton = document.createElement("a");
    movieTrailerButton.classList.add("trailerButton");
    movieTrailerButton.textContent = "Watch Trailer";
    movieTrailerButton.href = youtubeUrl;
    movieTrailerButton.target = "_blank";
    trailerRatingContainer.appendChild(movieTrailerButton);

    const playIcon = document.createElement("img");
    playIcon.classList.add("playIcon");
    playIcon.src = "/icons/play-icon.svg";
    playIcon.alt = "Play icon button";
    movieTrailerButton.appendChild(playIcon);
  }

  const ratingText = document.createElement("p");
  const ratingBold = document.createElement("b");
  ratingBold.textContent = movie.vote_average.toFixed(1);
  ratingText.appendChild(ratingBold);
  ratingText.appendChild(document.createTextNode(`/${maxRating}`));

  const starIcon = document.createElement("img");
  starIcon.src = "/icons/star-icon.svg";
  starIcon.alt = "Star icon";
  ratingContainer.appendChild(starIcon);
  ratingContainer.appendChild(ratingText);

  const movieAdditionalDetails = document.createElement("div");
  movieAdditionalDetails.classList.add("movieAdditionalDetails");
  movieInfoModalContent.appendChild(movieAdditionalDetails);

  const movieCategoriesSection = document.createElement("section");
  movieAdditionalDetails.appendChild(movieCategoriesSection);

  const movieCategoriesHeading = document.createElement("h2");
  movieCategoriesHeading.textContent = "Categories";
  movieCategoriesSection.appendChild(movieCategoriesHeading);

  const movieCategories = document.createElement("ul");
  movieCategories.classList.add("movieCategories");
  movieCategoriesSection.appendChild(movieCategories);

  movie.genres.forEach((genre) => {
    const li = document.createElement("li");
    li.textContent = genre.name;
    movieCategories.appendChild(li);
  });

  const sectionDivider = document.createElement("div");
  sectionDivider.classList.add("sectionDivider");
  movieAdditionalDetails.appendChild(sectionDivider);

  const movieDescription = document.createElement("section");
  movieDescription.classList.add("movieDescription");
  movieAdditionalDetails.appendChild(movieDescription);

  const synopsis = document.createElement("h2");
  synopsis.textContent = "Synopsis";
  movieDescription.appendChild(synopsis);

  const description = document.createElement("p");
  description.textContent = movie.overview;
  movieDescription.appendChild(description);

  if (similarMovies?.length > 0) {
    movieAdditionalDetails.appendChild(sectionDivider);

    const similarSection = document.createElement("section");
    similarSection.classList.add("similarSection");
    movieAdditionalDetails.appendChild(similarSection);

    const similar = document.createElement("h2");
    similar.textContent = "Similar Movies";
    similarSection.append(similar);

    const similarMoviesContainer = document.createElement("div");
    similarMoviesContainer.classList.add("similarMoviesContainer");
    similarSection.appendChild(similarMoviesContainer);

    similarMovies.forEach((movie) => {
      createMovieCard(movie, similarMoviesContainer);
    });
  }

  if (movieReviews?.length > 0) {
    const sectionDivider2 = document.createElement("div");
    sectionDivider2.classList.add("sectionDivider");
    movieAdditionalDetails.appendChild(sectionDivider2);
    const reviews = document.createElement("section");
    reviews.classList.add("reviews");
    movieAdditionalDetails.appendChild(reviews);

    const reviewsHeading = document.createElement("h2");
    reviewsHeading.textContent = "Reviews:";
    reviews.appendChild(reviewsHeading);
    const reviewsNumber = document.createElement("span");
    reviewsNumber.textContent = `${movieReviews.length}`;
    reviewsHeading.appendChild(reviewsNumber);
    movieReviews.slice(0, 2).forEach((review) => {
      const userDetails = document.createElement("div");
      userDetails.classList.add("userDetails");
      const user = document.createElement("div");
      user.textContent = `${review.author_details.username}:`;
      const ratingIcon = document.createElement("img");
      ratingIcon.src = "/icons/star-icon.svg";
      ratingIcon.alt = "Rating star icon";
      const userRating = document.createElement("div");
      userRating.textContent = `${
        review.author_details.rating ?? 0
      }/${maxRating}`;
      const blockquote = document.createElement("blockquote");
      blockquote.textContent = review.content;
      reviews.appendChild(userDetails);
      userDetails.appendChild(user);
      userDetails.appendChild(userRating);
      userDetails.appendChild(ratingIcon);
      reviews.appendChild(blockquote);
    });
  }

  moviesContainer.appendChild(movieInfoModal);
}

export function createSomethingWentWrong(observer) {
  let noMoviesFound = document.getElementById("noMoviesFound");
  if (!noMoviesFound) {
    noMoviesFound = document.createElement("div");
    noMoviesFound.setAttribute("id", "noMoviesFound");
  }
  removeLoader(observer);
  noMoviesFound.textContent = "Something went wrong!";
  const p = document.createElement("p");
  p.textContent = "Could not find any movies";
  noMoviesFound.appendChild(p);
  document.body.appendChild(noMoviesFound);
}

export function createErrorPopup(text) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.textContent = text;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 5000);
}

export function createNoMoviesFound(observer) {
  removeLoader(observer);
  let noMoviesFound = document.getElementById("noMoviesFound");
  if (noMoviesFound) return;
  noMoviesFound = document.createElement("div");
  noMoviesFound.setAttribute("id", "noMoviesFound");
  const p = document.createElement("p");
  p.setAttribute("id", "noMoviesFound");
  p.textContent = "No movies found!";
  noMoviesFound.appendChild(p);
  document.body.appendChild(noMoviesFound);
}
