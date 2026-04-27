//Config
const API_KEY = "bfb9CLHfdAQZmetkDvgvYibmMjcnNryDavYRgyym";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

//DOM
const datePicker = document.getElementById("date-picker");
const btnToday = document.getElementById("btn-today");
const btnTodayErr = document.getElementById("btn-today-err");
const progressBar = document.getElementById("progress-bar");
const stateLoading = document.getElementById("state-loading");
const stateError = document.getElementById("state-error");
const stateResults = document.getElementById("state-results");
const loadingText = document.getElementById("loading-text");
const loadingSubtext = document.getElementById("loading-subtext");
const errorTitle = document.getElementById("error-title");
const errorMsg = document.getElementById("error-msg");
const btnRetry = document.getElementById("btn-retry");
const mediaArea = document.getElementById("media-area");
const apodTitle = document.getElementById("apod-title");
const apodDate = document.getElementById("apod-date");
const apodCredit = document.getElementById("apod-credit");
const apodDescription = document.getElementById("apod-desc");
const btnShare = document.getElementById("btn-share");
const galleryStrip = document.getElementById("gallery-strip");
const toastEl = document.getElementById("toast");

const apodCache = {};
const apodPromiseCache = {};

let lastDate = "";
let isLoading = false;

function setProgress(percent) {
  progressBar.style.width = percent + "%";
}

function resetProgress() {
  progressBar.style.transition = "none";   
    progressBar.style.width = "0%";
    requestAnimationFrame(function () {
        progressBar.style.transition = "width 0.4s ease";
    });
}

//Controls
function setControlsDisabled(disabled) {
  datePicker.disabled = disabled;
  btnToday.disabled = disabled;
  datePicker.style.opacity = disabled ? "0.5" : "1";
  btnToday.style.opacity = disabled ? "0.5" : "1";
}

//Toast
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toastEl.classList.remove("show");
  }, 3000);
}

//setState
function setState(name) {
  [stateLoading, stateError, stateResults].forEach(function (el) {
    el.classList.add("hidden");
  });

  switch (name) {
    case "loading":
      stateLoading.classList.remove("hidden");
      break;
    case "error":
      stateError.classList.remove("hidden");
      break;
    case "results":
      stateResults.classList.remove("hidden");
      break;
  }
}

//Date utils
function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDateBefore(startDate, count) {
  const dates = [];
  const d = new Date(startDate + "T00:00:00");
  for (let i = 0; i < count; i++) {
  dates.push(d.toISOString().slice(0, 10));  
  d.setDate(d.getDate() - 1);
  }
  return dates;
}

//Fetch Function
async function fetchAPOD(date) {
  // 1. Return cached result
  if (apodCache[date]) {
    return apodCache[date];
  }

  // 2. Return in-flight request if already running
  if (apodPromiseCache[date]) {
    return apodPromiseCache[date];
  }

  const url = `${BASE_URL}?api_key=${API_KEY}&date=${date}`;

  apodPromiseCache[date] = fetch(url)
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit reached. Try again later.");
        }
        throw new Error(`NASA API error (${response.status})`);
      }

      const data = await response.json();

      apodCache[date] = data; // cache success result
      delete apodPromiseCache[date]; // cleanup

      return data;
    })
    .catch((err) => {
      delete apodPromiseCache[date]; // cleanup failed requests
      if (err instanceof TypeError) {
        throw new Error("Network error. Check connection.");
      }
      throw err;
    });

  return apodPromiseCache[date];
}

//Render Functions
function renderMedia(data) {
  if (data.media_type === "image") {
    const src = data.hdurl || data.url;
    return (
      '<img src="' + src + '" alt="' + data.title + '" class="apod-img" />'
    );
  } else {
    return (
      '<iframe src="' +
      data.url +
      '" class="apod-video" ' +
      'allowfullscreen title="' +
      data.title +
      '"></iframe>'
    );
  }
}

function renderAPOD(data) {
  mediaArea.innerHTML = renderMedia(data);
  apodTitle.textContent = data.title;
  apodDate.textContent = formatDisplayDate(data.date);
  apodCredit.textContent = data.copyright ? "© " + data.copyright : "";
  apodDescription.textContent = data.explanation;
  btnShare.setAttribute("data-title", data.title);
}

//Gallery
function renderGallery() {
  galleryStrip.innerHTML = Array.from({ length: 7 }, function () {
    return (
      '<div class="gallery-skel">' +
      '<div class="skel-block skel-img-block"></div>' +
      '<div class="skel-date-block"></div>' +
      "</div>"
    );
  }).join("");
}

async function loadGallery(currentDate) {
  renderGallery();

  const dates = getDateBefore(currentDate, 7);

  const results = [];

  //Sequential requests (prevents burst rate limit)
  for (const date of dates) {
    try {
      const data = await fetchAPOD(date);
      results.push(data);
    } catch (err) {
      
        //optional fallback placeholder instead of breaking gallery
      results.push(null);
    }
  }

  galleryStrip.innerHTML = results
    .map(data => {
      if (!data) {
        return `
          <div class="gallery-thumb">
            <div class="video-placeholder">⚠</div>
            <p class="gallery-thumb-date">--</p>
          </div>
        `;
      }

      const thumbnail =
        data.media_type === "image"
          ? `<img src="${data.url}" alt="${data.title}" loading="lazy" />`
          : `<div class="video-placeholder">▶</div>`;

      const isActive = data.date === lastDate ? " active" : "";

      return `
        <div class="gallery-thumb${isActive}" data-date="${data.date}" title="${data.title}">
          ${thumbnail}
          <p class="gallery-thumb-date">${data.date.slice(5)}</p>
        </div>
      `;
    })
    .join("");
}

//Main Load Function

async function loadDay(date) {
    if (isLoading) return;
    isLoading = true;

  lastDate = date;

  //Update date picker
  datePicker.value = date;

  //Reset and begin progress
  resetProgress();
  setProgress(10);

  //Update loading text
  loadingText.textContent = "Contacting NASA servers...";
  loadingSubtext.textContent = date;

  //Show loading state and disable controls
  setState("loading");
  setControlsDisabled(true);
  try {
    //Fetch APOD data
    const data = await fetchAPOD(date);
    setProgress(50);

    //Update loading text
    loadingText.textContent = "Rendering image...";
    loadingSubtext.textContent = data.title;

    await new Promise(function (resolve) {
      setTimeout(resolve, 300);
    });

    //Render APOD data
    renderAPOD(data);

      //Show results
    setState("results");
    setProgress(100);

    //Load gallery in background
    loadGallery(date);
  } catch (error) {
    //Show error state
    errorTitle.textContent = "Error loading image";
    errorMsg.textContent = error.message;
    setState("error");
    resetProgress();
  } finally {
    //Re-enable controls
      setControlsDisabled(false);
      isLoading = false;
  }
}

//Share Button
btnShare.addEventListener("click", function () {
  const date = datePicker.value;
  const shareUrl =
    "https://apod.nasa.gov/apod/ap" + date.replace(/-/g, "").slice(2) + ".html";

  navigator.clipboard
    .writeText(shareUrl)
    .then(function () {
      showToast("Share URL copied to clipboard!");
    })
    .catch(function () {
      showToast("Failed to copy URL. Please try manually: " + shareUrl);
    });
});

//Event Listeners
datePicker.addEventListener("change", function () {
  //Use the stored date — NOT the current date picker value

  if (datePicker.value) {
    loadDay(datePicker.value);
  }
});

btnRetry.addEventListener("click", function () {
  loadDay(lastDate || getTodayString());
});

btnToday.addEventListener("click", function () {
  loadDay(getTodayString());
});

btnTodayErr.addEventListener("click", function () {
  loadDay(getTodayString());
});
galleryStrip.addEventListener("click", function (e) {
  const thumb = e.target.closest(".gallery-thumb");
  if (!thumb) return;

  //Remove active from all
  document.querySelectorAll(".gallery-thumb").forEach(el => {
    el.classList.remove("active");
  });

  //Add to clicked
  thumb.classList.add("active");

  loadDay(thumb.dataset.date);
});

//Initial Load
const today = getTodayString();

datePicker.max = today;
datePicker.min = "1995-06-16";
datePicker.value = today;

loadDay(today);
