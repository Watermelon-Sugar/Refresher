//Day 1 Features: Add task, delete task, mark complete

//Config & ID generator
function makeIdGenerator(prefix) {
  return function () {
    return prefix + "_" + Date.now();
  };
}

const generateTaskId = makeIdGenerator("task");

//State
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
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
    saveToLocaleStorage();
  return task;
}

//deleteTask(id) - removes a task by its ID
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
    saveToLocaleStorage();
}

//toggleTask(id) - flips a task's completed state
function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id !== id) return task;
    return { ...task, completed: !task.completed };
  });
    saveToLocaleStorage();
}

function saveToLocaleStorage() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

//Render helpers
function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

//buildTaskHTML - returns the HTML string for one task item

function buildTaskHTML(task) {
  const { id, text, completed, createdAt } = task;

  const checkedClass = completed ? "checked" : "";

  const completedClass = completed ? "completed" : "";

  return `
    <li class="task-item ${completedClass}" data-id="${id}">

      <div class="task-checkbox ${checkedClass}" data-action="toggle" data-id="${id}"></div>

      <span class="task-text" data-action="toggle" data-id="${id}">${text}</span>

      <span class="task-meta">${formatDate(createdAt)}</span>

      <button class="task-delete" data-action="delete" data-id="${id}" aria-label="Delete task">
        ×
      </button>

    </li>
    `;
}

//updateTaskCount() - updates the header subtitle

function updateTaskcount() {
  const countEl = document.getElementById("task-count");
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  if (total === 0) {
    countEl.textContent = "No tasks yet";
  } else if (completed === total) {
    countEl.textContent = "All" + total + "tasks complete 🎉";
  } else {
    countEl.textContent = completed + " of " + total + " complete";
  }
}

//Main render()
function render() {
  const taskList = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");

  const visibleTasks = tasks;

  if (visibleTasks.length === 0) {
    emptyState.style.display = "";
    taskList.innerHTML = "";
  } else {
    emptyState.style.display = "none";
    taskList.innerHTML = visibleTasks.map(buildTaskHTML).join("");
  }
  updateTaskcount();
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

taskInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") handleAdd();
});

taskInput.addEventListener("input", function () {
  if (taskInput.value.trim() !== "") {
    inputError.textContent = "";
  }
});

//Task list: toggle anf delte via event delegation
document.getElementById("task-list").addEventListener("click", function (e) {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (action === "toggle") {
    toggleTask(id);
    render();
  }

  if (action === "delete") {
    deleteTask(id);
    render();
  }
});

//Init
render();
