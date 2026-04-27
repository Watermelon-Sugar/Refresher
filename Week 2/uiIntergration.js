//UI Integration
//It tskes raw API data & builds a living interactive interface around it. Filter it, sort it, search it, paginate it. The data drives the  UI.

//The three jobs of UI integration:

//1. Transform  — shape raw API data into what the UI needs
const posts = rawData.map(p => ({ title: p.title, author: p.user.name }));

//2. Filter — let the user narrow the data down
const results = posts.filter(p => p.author === selectedAuthor);

//3. Render — turn the data array into DOM elements
container.innerHTML = results.map(p => `<div>${p.title}</div>`).join('');
//Already know all three tools — .map(), .filter(), and innerHTML.UI integration is just combining them with real API data.

//The data flow — always the same direction
//1 - Fetch — get raw data from the API. Store it in a variable.
//2 - Store — keep the full dataset in a let allItems = [] variable. Never throw it away.
//3 - Filter/sort — create a derived array from allItems using the current filters.
//4 - Render — turn the filtered array into HTML and inject it. Call this every time filters change.
//Keep the full dataset. Filtering creates a new array from it — it never deletes from the original. This means clearing a filter instantly restores all results without another API call.

//Dynamic rendering — the core technique
//Take an array of data objects. Use .map() to turn each one into an HTML string. Use .join('') to glue them together. Set innerHTML to inject all of them at once.

function renderPosts(posts) {
  //Edge case: nothing to show
  if (posts.length === 0) {
    container.innerHTML = '<p class="empty">No posts found.</p>';
    return;
  }

  //.map() turns each object into an HTML string
  //.join('') glues the array of strings into one big string
  container.innerHTML = posts.map(function(post) {
    return `
      <div class="card">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <span class="tag">User ${post.userId}</span>
      </div>
    `;
  }).join('');
}

//This wipes and rebuilds the entire list on every call. Simple and reliable. Only optimise if performance becomes a real issue.
//Always handle the empty state. When no results match the current filter, show a helpful message — not a blank screen. Always the first check inside your render function.

if (filtered.length === 0) {
  container.innerHTML = `
    <p class="empty-msg">
      No results for "${searchTerm}". Try a different search.
    </p>
  `;
    return; //stop here — nothing else to render
}

//Filtering and sorting state - Each filter control (search input, dropdown, toggle) updates one state variable. A single applyAndRender() function reads all state variables together and builds the filtered result.

//State — one variable per filter control
let allPosts    = [];       //full dataset — never modified
let searchTerm  = '';       //from the search input
let selectedTag = 'all';   //from the dropdown
let sortOrder   = 'newest'; //from the sort buttons

function applyAndRender() {
  let result = [...allPosts]; //spread copies the array

  //Apply search filter
  if (searchTerm) {
    result = result.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  //Apply tag filter
  if (selectedTag !== 'all') {
    result = result.filter(p => p.tag === selectedTag);
  }

  //Apply sort
  if (sortOrder === 'az') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderPosts(result);
  updateCount(result.length, allPosts.length);
}

//[...allPosts] creates a shallow copy so sorting doesn't mutate the original array.
//Every event listener just updates one variable and calls applyAndRender(). One function, all filters.

//Skeleton screens — better than spinners
//A skeleton screen shows placeholder shapes in the same layout as your real content. It loads instantly, makes the page feel faster, and reduces layout shift when data arrives. Built entirely with CSS.

//1. Show skeletons while loading
function showSkeletons(count) {
  container.innerHTML = Array.from({ length: count }, () => `
    <div class="post-card skeleton">
      <div class="skel-title"></div>
      <div class="skel-line"></div>
      <div class="skel-line short"></div>
    </div>
  `).join('');
}

//2. The CSS pulse animation
/* Skeleton CSS */
//.skel-title, .skel-line {
  //background: var(--color-border-tertiary);
  //border-radius: 4px;
  //animation: pulse 1.4s ease-in-out infinite;
//}
//.skel-title { height: 18px; width: 60%; margin-bottom: 10px; }
//.skel-line  { height: 13px; margin-bottom: 6px; }
//.skel-line.short { width: 40%; }

//@keyframes pulse {
  //0%, 100% { opacity: 1; }
  //50%       { opacity: 0.4; }
//}
//Show 6 skeleton cards while loading — that's the same number as your real grid. The layout doesn't jump when real data replaces them.

//The complete UI integration script structure
//Every file you write follows this order. Memorise the sections, not the specifics.

//1. State variables
let allItems   = [];
let searchTerm = '';
let sortOrder  = 'default';

//2. DOM references
const grid      = document.getElementById('grid');
const searchEl  = document.getElementById('search');

//3. Fetch function
async function fetchItems() {
  // Placeholder fetch implementation.
  // Replace with an actual API call when ready.
}

//4. Render function
function renderItems(items) {
  //Edge case: nothing to show
  if (items.length === 0) {
    grid.innerHTML = '<p class="empty">No items found.</p>';
    return;
  }

  //.map() turns each object into an HTML string
  //.join('') glues the array of strings into one big string
  grid.innerHTML = items.map(function(item) {
    return `
      <div class="card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
        <span class="tag">User ${item.userId}</span>
      </div>
    `;
  }).join('');
}

//5. Filter + sort + render
function applyAndRender() {
  let result = [...allItems];

  if (searchTerm) {
    result = result.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortOrder === 'az') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderItems(result);
}

//6. Event listeners
searchEl.addEventListener('input', function() {
  searchTerm = searchEl.value.trim();
  applyAndRender();
});

//7. Init
fetchItems(); // kick everything off
//Seven sections. Always in this order. When you're stuck, check which section you're in — the structure tells you what should go where.