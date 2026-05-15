/**
 * Oefening 1A: Async/Await - Cats API
 */

{
   const btnCat = document.querySelector('#ex1a-html button');
   const imgCat = document.querySelector('#ex1a-html .cat');

   async function fetchCatImage() {
      const response = await fetch('https://cataas.com/cat?json=true');
      const data = await response.json();
      return data.url;
   }

   async function handleBtnCatClick() {
      imgCat.src = await fetchCatImage();
   }

   btnCat.addEventListener('click', handleBtnCatClick);
}

/**
 * Oefening 1B: Chuck Norris - fetch quote
 */
{
   const spnQuote = document.querySelector('#ex1b-html blockquote span');
   const btnNext = document.querySelector('#ex1b-html button.next');

   async function fetchRandomQuote() {
      // build request
      const url = 'https://api.chucknorris.io/jokes/random';

      // fetch
      const resp = await fetch(url);
      const data = await resp.json();

      // return data
      return data.value;
   }

   async function showRandomQuote() {
      const quote = await fetchRandomQuote();
      spnQuote.textContent = quote;
   }

   btnNext.addEventListener('click', showRandomQuote);
   showRandomQuote();
}

/**
 * Oefening 1C: Chuck Norris - categories
 */
{
   const selCategories = document.querySelector('#ex1c-html select');
   const parMessage = document.querySelector('#ex1c-html .message');

   async function fetchQuoteCategories() {
      // build request
      const url = 'https://api.chucknorris.io/jokes/categories';

      // fetch
      const resp = await fetch(url);
      const data = await resp.json();

      // return data
      return data;
   }

   async function buildCategoriesList() {
      const cats = await fetchQuoteCategories();
      selCategories.innerHTML = '';
      cats.forEach(cat => {
         selCategories.innerHTML += `<option>${cat}</option>`;
      });
      // of: selCategories.innerHTML = cats.map(cat => `<option>${cat}</option>`);
      parMessage.textContent = 'done building list!';
   }

   buildCategoriesList();
}


/**
 * Oefening 2: Query parameters & API key - OpenWeatherMap
 */
{
   const inpCity = document.querySelector('#ex2 [type=search]');
   const parOutput = document.querySelector('#ex2 .output');

   async function getWeatherInfo(city) {
      const apiKey = '209d4e3bb1847aee08e4bb0bbc2af50e';
      const filters = new URLSearchParams({
         q: city,
         units: 'metric',
         lang: 'nl',
         appid: apiKey
      });
      const url = `https://api.openweathermap.org/data/2.5/weather?${filters}`;
      const response = await fetch(url);
      const data = await response.json();
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;
      return `In ${data.name} is het momenteel ${temp}°C en ${desc}.`;
   }

   async function handleInpCityChange() {
      const city = inpCity.value.trim();
      if (!city) return;
      parOutput.textContent = await getWeatherInfo(city);
   }

   inpCity.addEventListener('change', handleInpCityChange)
}


/**
 * Oefening 3: Bearer token - The Movie Database (TMDB)
 */
{
   const inpMovie = document.querySelector('#ex3-html [type=search]');
   const btnSearch = document.querySelector('#ex3-html button');
   const ulMovies = document.querySelector('#ex3-html .movies');

   async function searchMovies(term) {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNWQxOTA5ZmE4YWFiYTRjYTU3NDM4NzU2MGVjZjYxYiIsIm5iZiI6MTc0MzYyNDUzMC40ODUsInN1YiI6IjY3ZWQ5OTUyODM2YzhlZGE3Y2FiMDlmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Cjnw_h33uu-pqfJz3KGgELFSw5Nph02HczCaGwjmzNM';
      const params = new URLSearchParams({ query: term });
      const url = `https://api.themoviedb.org/3/search/movie?${params}`;
      const response = await fetch(url, {
         headers: {
            'Authorization': `Bearer ${token}`
         }
      });
      const data = await response.json();
      return data.results;
   }

   async function showMovies() {
      const term = inpMovie.value.trim();
      if (!term) return;
      const movies = await searchMovies(term);
      ulMovies.innerHTML = movies.map(movie => `
         <li>
            <img src="https://image.tmdb.org/t/p/w92${movie.poster_path}" alt="${movie.title}">
            <div>
               <strong>${movie.title}</strong> (${movie.release_date?.slice(0, 4) ?? '?'})
               <p>${movie.overview}</p>
            </div>
         </li>
      `).join('');
   }

   btnSearch.addEventListener('click', showMovies);
   inpMovie.addEventListener('keydown', e => { if (e.key === 'Enter') showMovies(); });
}

