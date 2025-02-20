import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  closeMovieModal,
  clearMovies,
  clearModal,
  resetErrorState,
  removeLoader,
  addLoader,
} from "../ui/helpers";
import {
  createErrorPopup,
  createSomethingWentWrong,
  createMovieModal,
  createMovieCard,
} from "../ui/create";

describe("Movie Modal Functions", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="movieInfoModal"></div>
      <div id="moviesContainer">
        <div class="movie">Movie 1</div>
        <div class="movie">Movie 2</div>
      </div>
    `;
  });

  it("should add 'closing' class and remove modal after timeout when closing modal", async () => {
    const modal = document.getElementById("movieInfoModal");
    expect(modal).not.toBeNull();

    vi.useFakeTimers();

    closeMovieModal();

    expect(modal.classList.contains("closing")).toBe(true);
    expect(document.body.style.overflow).toBe("");

    vi.runAllTimers();

    expect(document.getElementById("movieInfoModal")).toBeNull();
  });

  it("should clear all movies from moviesContainer", () => {
    const container = document.getElementById("moviesContainer");
    expect(container.children.length).toBeGreaterThan(0);

    clearMovies();

    expect(container.children.length).toBe(0);
  });

  it("should remove the modal when clearModal is called", () => {
    expect(document.getElementById("movieInfoModal")).not.toBeNull();

    clearModal();

    expect(document.getElementById("movieInfoModal")).toBeNull();
  });
});

describe("Loader & Error State Functions", () => {
  let mockObserver;

  beforeEach(() => {
    document.body.innerHTML = `
        <div id="loaderContainer"></div>
        <div id="noMoviesFound">No movies found</div>
      `;

    mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
    };
  });

  it("should add a loader and observe it", () => {
    addLoader(mockObserver);

    const loader = document.getElementById("movieLoader");
    expect(loader).not.toBeNull();
    expect(loader.classList.contains("loader")).toBe(true);
    expect(mockObserver.observe).toHaveBeenCalledWith(loader);
  });

  it("should not add a loader if one already exists", () => {
    const loader = document.createElement("div");
    loader.setAttribute("id", "movieLoader");
    document.getElementById("loaderContainer").appendChild(loader);

    addLoader(mockObserver);

    expect(document.querySelectorAll("#movieLoader").length).toBe(1);
  });

  it("should remove the loader and unobserve it", () => {
    const loader = document.createElement("div");
    loader.setAttribute("id", "movieLoader");
    document.body.appendChild(loader);

    removeLoader(mockObserver);

    expect(mockObserver.unobserve).toHaveBeenCalledWith(loader);
    expect(document.getElementById("movieLoader")).toBeNull();
  });

  it("should not fail if trying to remove a non-existing loader", () => {
    expect(() => removeLoader(mockObserver)).not.toThrow();
  });

  it("should remove the noMoviesFound element", () => {
    expect(document.getElementById("noMoviesFound")).not.toBeNull();

    resetErrorState();

    expect(document.getElementById("noMoviesFound")).toBeNull();
  });

  it("should do nothing if noMoviesFound does not exist", () => {
    document.getElementById("noMoviesFound").remove();

    expect(() => resetErrorState()).not.toThrow();
  });
});

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("createSomethingWentWrong", () => {
  it('should create a "Something went wrong" message if noMoviesFound does not exist', () => {
    const observer = {};
    createSomethingWentWrong(observer);

    const noMoviesFound = document.getElementById("noMoviesFound");
    expect(noMoviesFound).toBeTruthy();
    expect(noMoviesFound.textContent).toBe(
      "Something went wrong!Could not find any movies"
    );
  });

  it('should not create "Something went wrong" message if it already exists', () => {
    const observer = {};
    const div = document.createElement("div");
    div.setAttribute("id", "noMoviesFound");
    document.body.appendChild(div);

    createSomethingWentWrong(observer);
    const allDivs = document.querySelectorAll("#noMoviesFound");
    expect(allDivs.length).toBe(1);
  });
});

describe("createErrorPopup", () => {
  it("should create a popup and remove it after 5 seconds", async () => {
    const text = "This is an error!";
    vi.useFakeTimers();

    createErrorPopup(text);

    const popup = document.querySelector(".popup");
    expect(popup).toBeTruthy();
    expect(popup.textContent).toBe(text);
    vi.runAllTimers();

    const removedPopup = document.querySelector(".popup");
    expect(removedPopup).toBeNull();
  });
});

const baseImageUrl = import.meta.env.VITE_IMAGES_BASE_URL;
const youtubeBaseUrl = import.meta.env.VITE_YOUTUBE_BASE_URL;
const movie = {
  title: "Test Movie",
  release_date: "2022-12-01",
  poster_path: "/test-movie.jpg",
  vote_average: 7.8,
  genres: [{ name: "Action" }, { name: "Adventure" }],
  overview: "A test movie description.",
  id: "1",
};

const movieReviews = [
  {
    author_details: {
      username: "JohnDoe",
      rating: 8,
    },
    content: "Amazing movie!",
  },
];

const videos = [{ type: "Trailer", key: "abc123" }];
const similarMovies = [
  {
    title: "Similar Movie 1",
    poster_path: "/similar1.jpg",
    release_date: "2002-01-01",
    vote_average: 4.8,
    genres: [{ name: "Action" }, { name: "Adventure" }],
    overview: "A test movie description.",
  },
  {
    title: "Similar Movie 2",
    poster_path: "/similar2.jpg",
    release_date: "2012-11-20",
    vote_average: 7.3,
    genres: [{ name: "Action" }, { name: "Drama" }],
    overview: "A test movie description.",
  },
];

beforeEach(() => {
  document.body.innerHTML = `<div id="moviesContainer"></div>`;
});

describe("createMovieModal", () => {
  it("should create a movie modal and append it to the DOM", () => {
    createMovieModal(movie, movieReviews, videos, similarMovies);

    const movieModal = document.getElementById("movieInfoModal");
    expect(movieModal).toBeTruthy();

    const movieTitle = movieModal.querySelector(".movieTitle");
    expect(movieTitle.textContent).toBe(movie.title);

    const trailerButton = movieModal.querySelector(".trailerButton");
    expect(trailerButton).toBeTruthy();
    expect(trailerButton.href).toBe(`${youtubeBaseUrl}${videos[0].key}`);

    const movieCategories = movieModal.querySelectorAll(".movieCategories li");
    expect(movieCategories.length).toBe(movie.genres.length);
    expect(movieCategories[0].textContent).toBe(movie.genres[0].name);
    expect(movieCategories[1].textContent).toBe(movie.genres[1].name);

    const description = movieModal.querySelector(".movieDescription p");
    expect(description.textContent).toBe(movie.overview);

    const similarMoviesContainer = movieModal.querySelector(
      ".similarMoviesContainer"
    );
    expect(similarMoviesContainer).toBeTruthy();
    expect(similarMoviesContainer.children.length).toBe(similarMovies.length);

    const reviews = movieModal.querySelectorAll(".reviews .userDetails");
    expect(reviews.length).toBe(movieReviews.length);
    expect(reviews[0].textContent).toContain(
      movieReviews[0].author_details.username
    );
    expect(reviews[0].textContent).toContain(
      movieReviews[0].author_details.rating.toString()
    );
    expect(document.querySelector(".reviews blockquote").textContent).toBe(
      movieReviews[0].content
    );
  });
});

describe("createMovieCard", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="moviesContainer"></div>`;
  });
  it("should create a movie card", () => {
    const node = document.getElementById("moviesContainer");
    createMovieCard(movie, node);

    const movieCard = node.querySelector(".movieCard");
    expect(movieCard).not.toBeNull();
    expect(movieCard.id).toBe("1");

    const movieImage = movieCard.querySelector("img");
    expect(movieImage).not.toBeNull();
    expect(movieImage.src).toBe(`${baseImageUrl}/test-movie.jpg`);
    expect(movieImage.alt).toBe("Test Movie");

    const movieTitle = movieCard.querySelector(".movieTitle");
    expect(movieTitle).not.toBeNull();
    expect(movieTitle.textContent).toBe("Test Movie");

    const movieYear = movieCard.querySelector(".movieYear");
    expect(movieYear).not.toBeNull();
    expect(movieYear.textContent).toBe("2022");

    const ratingContainer = movieCard.querySelector(".ratingContainer");
    expect(ratingContainer).not.toBeNull();

    const ratingText = ratingContainer.querySelector("p");
    expect(ratingText).not.toBeNull();
    expect(ratingText.textContent).toBe("7.8/10");

    expect(node.contains(movieCard)).toBe(true);
  });

  it("should create a movie card with a placeholder image if poster_path is missing", () => {
    const movie = {
      id: 2,
      poster_path: null,
      title: "Another Movie",
      vote_average: 8.0,
      release_date: "2021-05-15",
    };

    const node = document.createElement("div");
    createMovieCard(movie, node);

    const movieCard = node.querySelector(".movieCard");
    const movieImage = movieCard.querySelector("img");
    expect(movieImage.src).toBe(`${window.location}movie-placeholder.png`);
  });

  it("should append the movie card to moviesContainer if no node is provided", () => {
    const movie = {
      id: 3,
      poster_path: "some-poster.jpg",
      title: "Third Movie",
      vote_average: 6.0,
      release_date: "2020-08-25",
    };

    createMovieCard(movie);
    const moviesContainer = document.getElementById("moviesContainer");
    expect(moviesContainer.children.length).toBeGreaterThan(0);
  });
});
