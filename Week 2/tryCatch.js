//try/catch — the core idea
//Code inside try runs normally. If anything inside throws an error, execution immediately jumps to catch. Nothing after the error line in try runs.

try {
  console.log("Step 1 — runs");
  throw new Error("Something broke"); //jumps to catch
  console.log("Step 2 — NEVER runs");
} catch (error) {
  console.log(error.message); //"Something broke"
} finally {
  console.log("Always runs — success or failure");
}

//error inside catch is the Error object. Its two most useful properties are error.message and error.name.

//finally is optional. Use it for cleanup that must always happen — like hiding a spinner.
//throw — manually trigger an error
//You can throw your own errors at any point. This is how you turn a "bad but silent" situation into a real catchable error.

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.log(error.message); //"Cannot divide by zero"
}
//Always pass an Error object to throw — not a plain string. Error objects give you a stack trace (which file and line caused the problem) that plain strings don't have.

//Custom Errors
//Why custom error classes? A plain Error only tells you something went wrong. A custom error class lets you attach extra information — like a user-friendly title or an error category — so your UI can show the right message for each failure type.

//How to write a custom error class:
//Step 1 — extend Error (inherits .message, .name, .stack)
//Step 2 — call super(message) to set the .message property
//Step 3 — add your own properties

class NotFoundError extends Error {
  constructor(city) {
    super('Could not find "' + city + '"'); //sets .message
    this.name  = 'NotFoundError';
    this.title = 'City not found'; //our own property
  }
}

class NetworkError extends Error {
  constructor() {
    super('No internet connection detected');
    this.name  = 'NetworkError';
    this.title = 'Connection failed';
  }
}
//instanceof — check which error type you have
//In your catch block you can check what kind of error was thrown, and handle each type differently.

try {
  await fetchCity("xyz");
} catch (error) {
  if (error instanceof NotFoundError) {
    showMessage(error.title, error.message); //friendly UI
  } else if (error instanceof NetworkError) {
    showMessage(error.title, error.message); //different UI
  } else {
    showMessage("Unexpected error", error.message);
  }
}
//Custom error classes + instanceof = precise, user-friendly error handling. Every professional JS app uses this pattern.

//UI States
//The four UI states every async app needs
//Before writing any fetch code, decide what the user sees in each situation. Only one state is visible at a time.

//1-Empty — before the user has done anything. Show a prompt or placeholder.
//2-Loading — fetch is in progress. Show a spinner. Disable the search button.
//3-Error — something went wrong. Show a clear message + a retry button.
//4-Results — data arrived. Show it.

//setState() — one function controls all four
//Hide all states, then show only the one requested. This prevents two states from accidentally being visible at once.

function setState(name) {
  //Step 1:hide everything
  [stateEmpty, stateLoading, stateError, stateResults]
    .forEach(function(el) { el.classList.add('hidden'); });

  //Step 2:show only what was requested
  if (name === 'empty')   stateEmpty.classList.remove('hidden');
  if (name === 'loading') stateLoading.classList.remove('hidden');
  if (name === 'error')   stateError.classList.remove('hidden');
  if (name === 'results') stateResults.classList.remove('hidden');
}

//In HTML, each state panel has class="state hidden". The CSS .hidden { display: none; } removes it from the layout entirely.

//Fetch Errors
//Two types of fetch errors — handle both

//Network error
//No internet, server unreachable. fetch() rejects with a TypeError. Caught automatically by catch.

//HTTP error
//Server replied with 404 or 500. fetch() does NOT reject. You must check response.ok and throw manually.

try {
  const response = await fetch(url);

  //Handle HTTP errors manually
  if (!response.ok) {
    if (response.status === 404) throw new NotFoundError(city);
    throw new Error('Status: ' + response.status);
  }

  const data = await response.json();

} catch (error) {
  //Catch network errors (TypeError) and re-throw as NetworkError
  if (error instanceof TypeError) throw new NetworkError();
  throw error; //re-throw everything else unchanged
}
//Never forget response.ok. A 404 that slips through silently is one of the most common and confusing bugs in fetch code.

//Full Pattern
//The complete async handler pattern: This is the skeleton every button that triggers a fetch should follow. Memorise the order: validate → loading → try fetch → render → catch → show error.

async function handleSearch() {

  //1.Validate input first — exit early if bad
  const query = input.value.trim();
  if (!query) { setState('empty'); return; }

  //2.Show loading immediately
  setState('loading');

  try {
    //3.Fetch the data
    const location = await fetchGeocode(query);
    const weather  = await fetchWeather(location.lat, location.lon);

    //4.Render results
    renderResults(location, weather);
    setState('results');

  } catch (error) {
    //5.Show the error state with the right message
    showError(error);
    setState('error');
  }
}
//This five-step skeleton never changes. Only the fetch functions and render function change per project. Learn the skeleton, fill it in.