//DOM references
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const errorMsg = document.getElementById("error-msg");
const loadingMsg = document.getElementById("loading-msg");
const resultsGrid = document.getElementById("results-grid");

//show/hide status messages
function showError(message) {
  errorMsg.textContent = message;
  loadingMsg.textContent = "";
}

function showLoading(message) {
  loadingMsg.textContent = message;
  errorMsg.textContent = "";
}

function clearMessages() {
  errorMsg.textContent = "";
  loadingMsg.textContent = "";
}

//fetchCountries(query)
async function fetchCountries(query) {
  //The API endpoint for searching by name is: https://restcountries.com/v3.1/name/{name}
  //?fields= to ask for only the data we need. Asking for less data = faster response.
  const url =
    "https://restcountries.com/v3.1/name/" +
    encodeURIComponent(query) +
    "?fields=name,capital,currencies,population,region,flags";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No countries found matching "' + query + '"');
      }

      throw new Error("Request failed with status " + response.status);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

//renderResults(countries)
//   Each country object from the API looks like this:
//   {
//     name: { common: "Nigeria", official: "Federal Republic of Nigeria" },
//     capital: ["Abuja"],
//     currencies: { NAD: { name: "Namibian dollar", symbol: "N$" } },
//     population: 218541212,
//     region: "Africa",
//     flags: { png: "https://...", svg: "https://..." }
//   }

function renderResults(countries) {
  resultsGrid.innerHTML = "";

  const cardsHTML = countries
    .map(function (country) {
      const name = country.name.common;
      const capital = country.capital ? country.capital[0] : "N/A";
      const currency = country.currencies
        ? `${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol || ""})`
        : "N/A";
      const population = country.population.toLocaleString(); // adds commas: 218,541,212
      const region = country.region;
      const flagUrl = country.flags.png;

      return `
      <div class="country-card">
        <img
          class="country-flag"
          src="${flagUrl}"
          alt="Flag of ${name}"
        />
        <div class="country-body">
          <p class="country-name">${name}</p>
          <p class="country-detail">Capital: <span>${capital}</span></p>
          <p class="country-detail">Currency: <span>${currency}</span></p>
          <p class="country-detail">Population: <span>${population}</span></p>
          <p class="country-detail">Region: <span>${region}</span></p>
        </div>
      </div>
    `;
    })
    .join("");

  resultsGrid.innerHTML = cardsHTML;
}

//searchCountries()
async function searchCountries() {
  const query = searchInput.value.trim();

  if (query === "") {
    showError("Please type a country name first.");
    return;
  }

  showLoading("Searching...");
  resultsGrid.innerHTML = ""; //clear previous results while loading

  try {
    const countries = await fetchCountries(query);

    clearMessages();

    renderResults(countries);
  } catch (error) {
    showError(error.message);
    resultsGrid.innerHTML = "";
  }
}

//Event listeners
searchBtn.addEventListener("click", searchCountries);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCountries();
  }
});
