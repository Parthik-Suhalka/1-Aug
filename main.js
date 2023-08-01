const API_KEY = '637526fb495fa4159cc28bf14a864c87';



// Carousel Movies

function fetchcarouselmovies() {

  fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {

      const indicators = document.querySelector(".carousel-indicators");

      data = data.results.slice(0, 3)
      data.forEach((movie, index) => {
        const indicator = document.createElement("li");
        indicator.setAttribute("data-target", "#carouselExampleIndicators");
        indicator.setAttribute("data-slide-to", index);
        if (index === 0) {
          indicator.classList.add("active");
        }
        indicators.appendChild(indicator);

        const carouselInner = document.querySelector(".carousel-inner");
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) {
          carouselItem.classList.add("active");
        }
        const img = document.createElement("img");
        img.classList.add("d-block", "w-100");
        img.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        img.alt = movie.title;

        carouselItem.style.background = `linear-gradient(rgba(0,0,0,0.9),rgba(40,9,30,0.9)),url(https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

fetchcarouselmovies();



// Searched Movies

const searchResultsDiv = document.getElementById("searchResults");
document.getElementById('searchSection').style.display = "none";

async function searchMovies() {
  const searchQuery = document.getElementById("search-input").value;
  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    searchQuery
  )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      searchResultsDiv.innerHTML = "";
      document.getElementById('searchSection').style.display = "block";
      data.results.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        searchResultsDiv.appendChild(movieCard);
      });
    } else {
      searchResultsDiv.innerHTML = `<p>No results found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  searchMovies();
});



// Popular Movies

const popularMoviesSection = document.getElementById("popularMovies");

async function fetchPopularMovies() {
  console.log("Fetching popular movies...");
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
 try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      popularMovies = data.results;

      popularMoviesSection.innerHTML = "";

      data.results.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        popularMoviesSection.appendChild(movieCard);
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchPopularMovies();



// Movie Cards

function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add(
    "col-lg-2",
    "col-md-3",
    "col-sm-3",
    "mb-4",
    "movie-card"
  );

  movieCard.addEventListener("click", () => {
    window.open(`movie.html?id=${movie.id}`, "_blank");
  });

  const movieImage = document.createElement("img");
  movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  movieImage.alt = movie.title;
  movieImage.classList.add("img-fluid");
  movieImage.loading = "lazy";

  const movieTitle = document.createElement("h5");
  movieTitle.classList.add("mt-3");
  movieTitle.textContent = movie.title;
  const movieRate = document.createElement('div')
  movieRate.style.color = 'rgb(219, 165, 6)';
  movieRate.innerHTML = `<h6>IMDB Rating: ${movie.vote_average}`;

  movieCard.appendChild(movieImage);
  movieCard.appendChild(movieTitle);
  movieCard.append(movieRate);

  return movieCard;
}