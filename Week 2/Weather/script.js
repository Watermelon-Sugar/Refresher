//DOM references
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const btnRetry = document.getElementById("btn-retry");

const cityName = document.getElementById("city-name");
const cityCoords = document.getElementById("city-coords");
const tempBadge = document.getElementById("temp-badge");
const weatherGrid = document.getElementById("weather-grid");

const errorTitle = document.getElementById("error-title");
const errorMessage = document.getElementById("error-message");
//State
const stateEmpty = document.getElementById("state-empty");
const stateLoading = document.getElementById("state-loading");
const stateError = document.getElementById("state-error");
const stateResults = document.getElementById("state-results");

class NotFoundError extends Error {
  constructor(cityName) {
    super(
      'Could not find a city called "' + cityName + '". Check your spelling',
    );
    this.name = "NotFoundError";
    this.title = "City not found";
  }
}

class NetworkError extends Error {
  constructor() {
    super("No internet connection. Please check your network and try again");
    this.name = "NetworkError";
    this.title = "Connection failed";
  }
}

class ServerError extends Error {
  constructor(status) {
    super(
      "The weather services returned an error (status " +
        status +
        "). Try again shortly.",
    );
    this.name = "ServerError";
    this.title = "Service Error";
  }
}

//setState(name)
function setState(name) {
  const allStates = [stateEmpty, stateLoading, stateError, stateResults];
  allStates.forEach(function (el) {
    el.classList.add("hidden");
  });

//show the requested state
  if (name === "empty") stateEmpty.classList.remove("hidden");
  if (name === "loading") stateLoading.classList.remove("hidden");
  if (name === "error") stateError.classList.remove("hidden");
  if (name === "results") stateResults.classList.remove("hidden");
}

//showError()
function showError(error) {
  errorTitle.textContent = error.title || "Something went wrong";
  errorMessage.textContent = error.message || "An unexpected error occurred";
  setState("error");
}

//fetchGeoC]code(city)
async function fetchGeocode(city) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(city) +
    "&count=1&language=en&format=json";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ServerError(response.status);
    }
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new NotFoundError(city);
    }
    const location = data.results[0];
    return {
      name: location.name + (location.country ? ", " + location.country : ""),
      lat: location.latitude,
      lon: location.longitude,
    };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NetworkError();
    }
    throw error;
  }
}

//fetchWeather(lat, lon)
async function fetchWeather(lat, lon) {
  const url =
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ServerError(response.status);
    }

    const data = await response.json();

    return data.current;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NetworkError();
    }
    throw error;
  }
}

//getWeatherDescription(code)
function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Icy fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
    99: "Thunderstorm with hail",
  };
  return descriptions[code] || "Unknown";
}

//renderResults(locationName, coords, weather)
function renderResults(locationName, coords, weather) {
  cityName.textContent = locationName;
  const latDir = coords.lat >= 0 ? "N" : "S";
const lonDir = coords.lon >= 0 ? "E" : "W";

cityCoords.textContent =
  Math.abs(coords.lat).toFixed(2) + "°" + latDir + ", " +
  Math.abs(coords.lon).toFixed(2) + "°" + lonDir;
  tempBadge.textContent = Math.round(weather.temperature_2m) + "°C";

  const cards = [
    {
      label: "Condition",
      value: getWeatherDescription(weather.weather_code),
      unit: "",
    },
    { label: "Humidity", value: weather.relative_humidity_2m, unit: "%" },
    {
      label: "Wind speed",
      value: weather.wind_speed_10m.toFixed(1),
      unit: "m/s",
    },
    { label: "Rainfall", value: weather.precipitation, unit: "mm" },
  ];

  weatherGrid.innerHTML = cards
    .map(function (card) {
      return `
      <div class="weather-card">
        <p class="weather-card-label">${card.label}</p>
        <p class="weather-card-value">
          ${card.value}<span class="weather-card-unit">${card.unit}</span>
        </p>
      </div>
    `;
    })
    .join("");

  setState("results");
}

//handleSearch
async function handleSearch() {
  const query = cityInput.value.trim();

  if (query === "") {
    setState("empty");
    return;
  }
  setState("loading");

  try {
    const location = await fetchGeocode(query);

    const weather = await fetchWeather(location.lat, location.lon);

    renderResults(
      location.name,
      { lat: location.lat, lon: location.lon },
      weather,
    );
  } catch (error) {
    showError(error);
  }
}

//Event listeners
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  } else {
    setState("empty");
  }
});
