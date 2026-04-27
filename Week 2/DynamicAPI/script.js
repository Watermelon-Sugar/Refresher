//DOM references
const searchInput = document.getElementById('search-input');
const userFilter = document.getElementById('user-filter');
const sortOptions = document.getElementById('sort-options');

const postGrid = document.getElementById('post-grid');
const countBar = document.getElementById('count-bar');

const stateLoading = document.getElementById('state-loading');
const stateError = document.getElementById('state-error');
const errorMsg = document.getElementById('error-msg');
const btnRetry = document.getElementById('btn-retry');

//Modal
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalId = document.getElementById('modal-id');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalUser = document.getElementById('modal-user');

//State
let allPosts = [];
let filteredPosts = [];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

//Fetch posts from API
async function fetchPosts() {
    showLoading();
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) {
            throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        allPosts = data;
        filteredPosts = data;
        populateUserFilter(data);
        renderPosts(data);
    } catch (error) {
        showError(error.message);
    }
}

//UI State
function showLoading() {
    stateLoading.classList.remove('hidden');
    stateError.classList.add('hidden');
    postGrid.classList.add('hidden');
}

function showError(message) {
    stateLoading.classList.add('hidden');
    stateError.classList.remove('hidden');
    postGrid.classList.add('hidden');
    errorMsg.textContent = message;
}

function showPosts() {
    stateLoading.classList.add('hidden');
    stateError.classList.add('hidden');
    postGrid.classList.remove('hidden');
}

//Render posts
function renderPosts(posts) {
    if (posts.length === 0) {
        postGrid.innerHTML = `<p class="empty-msg">No posts found.</p>`;
        countBar.textContent = `0 posts`;
        showPosts();
        return;
    }

    const html = posts.map(post => {
    return `
      <div class="post-card" data-id="${post.id}">
        <p class="post-title">${escapeHtml(post.title)}</p>
<p class="post-body">${escapeHtml(post.body)}</p>
        <div class="post-footer">
          <span class="post-user">User ${post.userId}</span>
          <span class="post-id">#${post.id}</span>
        </div>
      </div>
    `;
  }).join("");


    postGrid.innerHTML = html;
   countBar.innerHTML = `<span>${posts.length}</span> posts`;
    showPosts();
}

//Filter, search, sort
function applyFilters() {
    let results = [...allPosts];

//Search
    const search = searchInput.value.trim().toLowerCase();
    const user = userFilter.value;
    const sort = sortOptions.value;
    if (search) {
        results = results.filter(post => 
            post.title.toLowerCase().includes(search) || 
            post.body.toLowerCase().includes(search)
        );
    }

  function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

searchInput.addEventListener("input", debounce(applyFilters, 200)); 

//User filter
    if (user) {
        results = results.filter(post => post.userId == user);
    }

//Sorting
   if (sort === "title-asc") {
  results.sort((a, b) => a.title.localeCompare(b.title));
} else if (sort === "title-desc") {
  results.sort((a, b) => b.title.localeCompare(a.title));
}

  filteredPosts = results;
  renderPosts(results);
}

//Populate user filter options
function populateUserFilter(posts) {
  userFilter.innerHTML = '<option value="">All Users</option>'; // reset first
  const users = [...new Set(posts.map(p => p.userId))].sort((a,b) => a - b);
  users.forEach(userId => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userFilter.appendChild(option);
  });
}

//Modal
function openModal(post) {
  modalId.textContent = `Post #${post.id}`;
  modalTitle.textContent = post.title;
  modalBody.textContent = post.body;
  modalUser.textContent = `User ${post.userId}`;

  modalBackdrop.classList.remove("hidden");
}

function closeModal() {
    modalBackdrop.classList.add("hidden");
    
}

//Event listeners
searchInput.addEventListener("input", applyFilters);
userFilter.addEventListener("change", applyFilters);
sortOptions.addEventListener("change", applyFilters);
btnRetry.addEventListener("click", fetchPosts);

//Modal close
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", function escListener(e) {
        if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", escListener);
        }
    });
modalBackdrop.addEventListener("click", function (e) {
  if (!e.target.closest(".modal")) {
    closeModal();
  }
});

//Post click for modal
postGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".post-card");
    if (!card) return;
    const id = card.dataset.id;
    const post = allPosts.find(p => p.id === Number(id));
    openModal(post);
});

//Initial fetch
fetchPosts();