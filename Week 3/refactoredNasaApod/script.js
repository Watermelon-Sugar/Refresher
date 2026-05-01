//WHAT CHANGED FROM
//1.CLOSURE
//Before: fetchAPOD() always hit the network
//After: makeCache() stores results privately in a closure
//Same date = instant result, zero network requests
//2.CUSTOM ERROR CLASSES
//Before: throw new Error("message") — all look the same
//After: DateRangeError, RateLimitError, NetworkError, ServerError
//Each carries .title so the UI shows specific headings
//3.DESTRUCTURING
//Before: data.title, data.date, data.explanation (repeated dots)
//After: const { title, date, explanation } = data at top of fn
//buildMediaHTML also destructures its argument
//4.LOOKUP OBJECT IN setState
//Before: three separate if statements
//After: one object maps state names to elements — cleaner + scalable

//Config
const API_KEY = "bfb9CLHfdAQZmetkDvgvYibmMjcnNryDavYRgyym";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

class DateRangeError extends Error {
  constructor() {
    super("Select a date between June 16, 1995 and today.");
    this.name = "DateRangeError";
    this.title = "Date out of Range";
  }
}

class RateLimitError extends Error {
  constructor(message) {
    super(message || "NASA API rate limit reached.");
    this.name = "RateLimitError";
    this.title = "Limit Reached";
  }
}

class NetworkError extends Error {
  constructor() {
    super("You're offline. Reconnect to the internet.");
    this.name = "NetworkError";
    this.title = "Connection failed";
  }
}

class ServerError extends Error {
  constructor(status) {
    super(`NASA API returned an error (status ${status}).`);
    this.name = "ServerError";
    this.title = "Service error";
  }
}

//Closure Cache
function makeCache() {
  const store = {};
  return {
    get: (date) => store[date],
    set: (date, data) => {
      store[date] = data;
    },
    has: (date) => date in store,
  };
}
const apodCache = makeCache();

//DOM References
const elements = {
  datePicker: document.getElementById("date-picker"),
  btnToday: document.getElementById("btn-today"),
  progressBar: document.getElementById("progress-bar"),
  stateLoading: document.getElementById("state-loading"),
  stateError: document.getElementById("state-error"),
  stateResults: document.getElementById("state-results"),
  loadingText: document.getElementById("loading-text"),
  loadingSubtext: document.getElementById("loading-subtext"),
  errorTitle: document.getElementById("error-title"),
  errorMsg: document.getElementById("error-msg"),
  btnRetry: document.getElementById("btn-retry"),
  mediaArea: document.getElementById("media-area"),
  apodTitle: document.getElementById("apod-title"),
  apodDate: document.getElementById("apod-date"),
  apodCredit: document.getElementById("apod-credit"),
  apodExplanation: document.getElementById("apod-desc"),
  btnShare: document.getElementById("btn-share"),
  galleryStrip: document.getElementById("gallery-strip"),
  toastEl: document.getElementById("toast"),
};

Object.entries(elements).forEach(([name, el]) => {
  if (!el) console.warn(`Warning: Element "${name}" not found in HTML.`);
});

//UI Helpers
function setState(name) {
  const { stateLoading, stateError, stateResults } = elements;
  [stateLoading, stateError, stateResults].forEach((el) =>
    el?.classList.add("hidden"),
  );

  const stateMap = {
    loading: stateLoading,
    error: stateError,
    results: stateResults,
  };

  stateMap[name]?.classList.remove("hidden");
}

function setProgress(percent) {
  if (elements.progressBar) elements.progressBar.style.width = percent + "%";
}

function resetProgress() {
  if (!elements.progressBar) return;
  elements.progressBar.style.transition = "none";
  elements.progressBar.style.width = "0%";
  requestAnimationFrame(() => {
    elements.progressBar.style.transition = "width 0.4s ease";
  });
}

function setControlsDisabled(disabled) {
  const { datePicker, btnToday } = elements;
  if (datePicker) {
    datePicker.disabled = disabled;
    datePicker.style.opacity = disabled ? "0.5" : "1";
  }
  if (btnToday) {
    btnToday.disabled = disabled;
    btnToday.style.opacity = disabled ? "0.5" : "1";
  }
}

//Data & Fetching
function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchAPOD(date = getTodayString()) {
  if (apodCache.has(date)) return apodCache.get(date);

  const url = `${BASE_URL}?api_key=${API_KEY}&date=${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 400) throw new DateRangeError();
      if (response.status === 429) throw new RateLimitError();
      throw new ServerError(response.status);
    }
    const data = await response.json();
    apodCache.set(date, data);
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new NetworkError();
    throw error;
  }
}

//Rendering
function buildMediaHTML(data) {
  const { media_type, hdurl, url, title } = data;
  if (media_type === "image") {
    return `<img src="${hdurl || url}" alt="${title}" class="apod-img" />`;
  }
  return `<iframe src="${url}" class="apod-video" allowfullscreen title="${title}"></iframe>`;
}

function renderAPOD(data) {
  const { title, date, explanation, copyright } = data;
  const { mediaArea, apodTitle, apodDate, apodExplanation, apodCredit } =
    elements;

  if (mediaArea) mediaArea.innerHTML = buildMediaHTML(data);
  if (apodTitle) apodTitle.textContent = title;
  if (apodDate)
    apodDate.textContent = new Date(date + "T00:00:00").toLocaleDateString();
  if (apodExplanation) apodExplanation.textContent = explanation;

  if (apodCredit) {
    apodCredit.textContent =
      copyright && copyright.trim()
        ? `Photo: ${copyright.trim()}`
        : "Credit: NASA";
  }
}

//Core Logic
async function loadDay(date) {
  const { datePicker, loadingText, loadingSubtext, errorTitle, errorMsg } =
    elements;

  let lastAttemptedDate = date;
  if (datePicker) datePicker.value = date;

  resetProgress();
  setProgress(10);
  setState("loading");
  setControlsDisabled(true);

  try {
    const data = await fetchAPOD(date);
    setProgress(50);

    if (loadingText) loadingText.textContent = "Rendering...";

    renderAPOD(data);
    setState("results");
      setProgress(100);
      loadGallery(date);
  } catch (error) {
    if (errorTitle) errorTitle.textContent = error.title || "Error";
    if (errorMsg)
      errorMsg.textContent = error.message || "An unexpected error occurred.";
    setState("error");
    resetProgress();
  } finally {
    setControlsDisabled(false);
  }
}

// Helper to get an array of dates
function getDatesBefore(startDate, count) {
  const dates = [];
  const d = new Date(startDate + "T00:00:00");
  for (let i = 0; i < count; i++) {
    dates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() - 1);
  }
  return dates;
}

async function loadGallery(currentDate) {
  const { galleryStrip } = elements;
  if (!galleryStrip) return;

  galleryStrip.innerHTML = `<p style="color:gray; font-size:12px;">Loading gallery...</p>`;

  const dates = getDatesBefore(currentDate, 7);

  try {
    const promises = dates.map(date => fetchAPOD(date));
    const results = await Promise.all(promises);

    galleryStrip.innerHTML = results.map(data => {
      const { media_type, url, title, date } = data;
      const isVideo = media_type !== "image";
      const activeClass = date === currentDate ? "active" : "";

      return `
        <div class="gallery-thumb ${activeClass}" onclick="loadDay('${date}')" title="${title}">
          ${isVideo ? '<div class="video-placeholder">▶</div>' : `<img src="${url}" />`}
          <span class="thumb-date">${date.slice(5)}</span>
        </div>
      `;
    }).join("");
  } catch (err) {
    galleryStrip.innerHTML = "";
    console.error("Gallery failed to load", err);
  }
}

//Initialize
const today = getTodayString();
if (elements.datePicker) {
  elements.datePicker.max = today;
  elements.datePicker.min = "1995-06-16";
  elements.datePicker.addEventListener("change", (e) =>
    loadDay(e.target.value),
  );
}
if (elements.btnShare) {
  elements.btnShare.addEventListener('click', function() {
    const date = elements.datePicker.value;
    if (!date) return;

    const urlDate = date.replace(/-/g, '').slice(2);
    const shareUrl = `https://apod.nasa.gov/apod/ap${urlDate}.html`;
  
    if (!navigator.clipboard) {
      alert("Copy this link: " + shareUrl);
      return;
    }

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        if (typeof showToast === "function") {
          showToast('Link copied to clipboard!');
        } else {
          alert('Link copied!');
        }
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy. Link: ' + shareUrl);
      });
  });
}
if (elements.btnToday) {
  elements.btnToday.addEventListener("click", () => loadDay(today));
}

if (elements.btnRetry) {
  elements.btnRetry.addEventListener("click", () =>
    loadDay(elements.datePicker.value || today),
  );
}

loadDay(today);
