//Day 1 Features: Add task, delete task, mark complete

//Config & ID generator
function makeIdGenerator(prefix) {
  return function () {
    return prefix + "_" + Date.now();
  };
}

const generateTaskId = makeIdGenerator("task");

//State
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let filter = "all";
let search = "";

//Core logic
function createTask(text) {
  //validate, never store an empty task
  const trimmed = text.trim();
  if (trimmed === "") return null;

  const task = {
    id: generateTaskId(),
    text: trimmed,
    completed: false,
    priority: "medium",
    dueDate: null,
    createdAt: new Date().toISOString(),
  };

  tasks = [...tasks, task];
  saveToLocalStorage();
  return task;
}

//deleteTask(id) - removes a task by its ID
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveToLocalStorage();
}

//toggleTask(id) - flips a task's completed state
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

//Render helpers
function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

//buildTaskHTML - returns the HTML string for one task item
function buildTaskHTML(task) {
  const { id, text, completed, createdAt } = task;

  return `
    <li class="task-item ${completed ? "completed" : ""}" data-id="${id}">
      <div class="task-checkbox ${completed ? "checked" : ""}" data-action="toggle" data-id="${id}"></div>

      <span class="task-text" data-action="toggle" data-id="${id}">
        ${text}
      </span>

      <span class="task-meta">${formatDate(createdAt)}</span>

      <button class="task-delete" data-action="delete" data-id="${id}">
        <span>×</span>
      </button>
    </li>
  `;
}

//updateTaskCount() - updates the header subtitle

function updateTaskCount() {
  const countEl = document.getElementById("task-count");
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  if (total === 0) {
    countEl.textContent = "No tasks yet";
  } else if (completed === total) {
    countEl.textContent = "All " + total + " tasks complete 🎉";
  } else {
    countEl.textContent = completed + " of " + total + " complete";
  }
}

function getEmptyStateMessages() {
  const hasSearch = search.trim() !== "";

  if (tasks.length === 0) {
    return {
      title: "No tasks yet...",
      sub: "Add your first task above to get started",
    };
  }

  if (hasSearch) {
    return {
      title: `No results for "${search}"`,
      sub: "Try a different keyword or clear the search",
    };
  }

  const messages = {
    active: { title: "No active tasks", sub: "All your tasks are complete 🎉" },
    completed: {
      title: "No completed tasks",
      sub: "Complete a task to see it here",
    },
  };

  return messages[filter] || { title: "Nothing here", sub: "" };
}

function getVisibleTasks() {
  let result = [...tasks];

  if (filter === "active") {
    result = result.filter((task) => !task.completed);
  } else if (filter === "completed") {
    result = result.filter((task) => task.completed);
  }

  if (search.trim() !== "") {
    const term = search.toLowerCase();
    result = result.filter((task) =>
      task.text.toLowerCase().includes(term)
    );
  }

  return result;
}

function updateFilterGroup() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
}

//Main render()
function render() {
  const taskList = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const emptyTitle = document.getElementById("empty-title");
  const emptySub = document.getElementById("empty-sub");

  const visibleTasks = getVisibleTasks();

  if (visibleTasks.length === 0) {
    emptyState.style.display = "";
    taskList.innerHTML = "";

    const { title, sub } = getEmptyStateMessages();
    emptyTitle.textContent = title;
    emptySub.textContent = sub;

  } else {

    emptyState.style.display = "none";
    taskList.innerHTML = visibleTasks.map(buildTaskHTML).join("");
  }
  updateTaskCount();
  updateFilterGroup()
}

//Event listeners
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const inputError = document.getElementById("input-error");

function handleAdd() {
  const value = taskInput.value.trim();

  if (value === "") {
    inputError.textContent = "Please type a task first.";
    taskInput.focus();
    return;
  }

  inputError.textContent = "";
  createTask(value);
  taskInput.value = "";
  taskInput.focus();
  render();
}

addBtn.addEventListener("click", handleAdd);

taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") handleAdd();
});


document.getElementById("filter-group").addEventListener("click", function(e) {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  filter = btn.dataset.filter;
  render();
});

//Task list: toggle and delete via event delegation
document.getElementById("task-list").addEventListener("click", function (e) {
  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;

  const { action, id } = actionEl.dataset;

   if (action === "delete") {
    e.stopPropagation();
    deleteTask(id);
    render();
    return;
  }

  if (action === "toggle") {
    toggleTask(id);
    render();
  }
});

//Search: Debounce
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const searchInputEl = document.getElementById('search-input');
const searchClearBtn = document.getElementById('search-clear');

searchInputEl.addEventListener('input', debounce(function () { 
  search = searchInputEl.value;

 searchClearBtn.classList.toggle("hidden", search.trim() === "");

  render()
}, 250))

searchClearBtn.addEventListener('click', function () { 
  search = '';
  searchInputEl.value = '';
  searchClearBtn.classList.add('hidden');
  searchInputEl.focus();
  render();
})

//Init
render();
