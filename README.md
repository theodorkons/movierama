# Movierama

A movie discovery web application that allows users to explore currently playing movies in theaters and search for their favorite movies using The Movie Database (TMDB) API. Built with Vite for a fast and optimized development experience.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Testing](#testing)
- [Future Improvements](#future-improvements)

## Features

- **Discover Now Playing Movies**: Browse movies that are currently playing in theaters, fetched from the TMDB API.
- **Search Functionality**: Search for any movie by title to get details instantly.
- **Dynamic Movie Cards**: Movies are displayed as interactive cards that show essential details.
- **Movie Details Modal**: Clicking on a movie card opens a modal with more information about the selected movie.

## Technologies

- **Vite**
- **Vanilla JavaScript**
- **TMDB API**
- **CSS**
- **HTML**
- **npm**
- **Vitest & jsdom**

### Prerequisites

- **Node.js**
- **Postman(optional for testing)**

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/theodorkons/movierama.git
   cd movierama
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

## Environment Configuration

Create a `.env` file in the root directory and add your TMDB API key:

```plaintext
VITE_API_KEY=your_api_key_here
VITE_TMDB_API_URL = 'https://api.themoviedb.org/3'
VITE_MAX_RATING = 10
VITE_IMAGES_BASE_URL = 'https://image.tmdb.org/t/p/w185'
VITE_YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v='
```

## Running the Application

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Access the application**: Open your browser and navigate to `http://localhost:5173/`.

## Usage

- On the homepage, view a list of movies currently playing in theaters.
- Use the search bar to find movies by title.
- Click on any movie card to open a modal with more details.

## Testing

Unit tests are implemented using Vitest for functionality testing and jsdom for UI testing.

To run tests, execute:

```bash
npm run test
```

## Roadmap

- [ ] User Authentication: Implement login/signup functionality.
- [ ] Favorites & Watchlist: Allow users to save favorite movies and create a watchlist.
- [ ] Reviews Pagination: Improve reviews with paginated results.
- [ ] Theming Options: Add light and dark mode support.
- [ ] Improved Search: Enhance search capabilities with filters for genres, release year, and ratings.

---
