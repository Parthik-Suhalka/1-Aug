const apiKey = '637526fb495fa4159cc28bf14a864c87';
const apiUrl = 'https://api.themoviedb.org/3';


async function fetchMovieDetails(movieId) {
    const url = `${apiUrl}/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}


async function fetchMovieTrailer(movieId) {
    const url = `${apiUrl}/movie/${movieId}/videos?api_key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const trailers = data.results.filter((video) =>
                ['Trailer', 'Teaser'].includes(video.type)
            );
            if (trailers.length > 0) {
                return `https://www.youtube.com/embed/${trailers[0].key}`;
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching movie trailer:', error);
        return null;
    }
}


async function displayMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId) {
        const movieDetails = await fetchMovieDetails(movieId);
        if (movieDetails) {
            const movieTitle = document.getElementById('movieTitle');
            const moviePoster = document.getElementById('moviePoster');
            const movieOverview = document.getElementById('movieOverview');
            const movieCast = document.getElementById('movieCast');
            const movieTrailer = document.getElementById('movieTrailer');
            const rating = document.getElementById('rating');

            movieTitle.textContent = movieDetails.title;
            rating.textContent = movieDetails.vote_average;
            movieOverview.textContent = movieDetails.overview;

            const creditsUrl = `${apiUrl}/movie/${movieId}/credits?api_key=${apiKey}`;
            const creditsResponse = await fetch(creditsUrl);
            const creditsData = await creditsResponse.json();
            // const cast = creditsData.cast.slice(0, 5); // Display first 5 cast members
            const cast = creditsData.cast

            movieCast.innerHTML = '';
            cast.forEach((castMember) => {
                const castCard = createCastCard(castMember);
                movieCast.appendChild(castCard);
            });

            const trailerLink = await fetchMovieTrailer(movieId);
            if (trailerLink) {
                const iframe = document.createElement('iframe');
                iframe.src = trailerLink;
                iframe.width = '560';
                iframe.height = '315';
                iframe.allowFullscreen = true;
                movieTrailer.appendChild(iframe);
            }
        }
    } else {
        console.error('Movie ID not found in URL parameters.');
    }
}


function createCastCard(castMember) {
    const castCard = document.createElement('div');
    castCard.classList.add('col-md-2', 'mb-4', 'cast-card');

    const castImage = document.createElement('img');
    castImage.src = `https://image.tmdb.org/t/p/w500${castMember.profile_path}`;
    castImage.alt = castMember.name;
    castImage.classList.add('img-fluid');

    const castName = document.createElement('h4');
    castName.classList.add('mt-3');
    castName.textContent = castMember.name;

    castCard.appendChild(castImage);
    castCard.appendChild(castName);

    return castCard;
}

displayMovieDetails();
