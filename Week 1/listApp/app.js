//State
//items is the array of objects. Each object is one list item.

let items = []; // e.g. [{ text: "Buy milk", done: false }, ...]

//DOM references

const input = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const errorEl = document.getElementById("error");
const summaryEl = document.getElementById("summary");
const emptyMsg = document.getElementById("empty-msg");

//Add an item
//Reads the input, validates it, adds to the array, re-renders.

function addItem() {
  const text = input.value.trim(); // trim() removes accidental spaces

  //if/else: validate the input
  if (text === "") {
    errorEl.textContent = "Please type something first.";
    return; // stop here — don't add an empty item
  }

  //Clear the error if there was one
  errorEl.textContent = "";

  //Create a new item object and push it into the array
  const newItem = {
    text: text,
    done: false,
  };

  items.push(newItem);

  //Clear the input field ready for the next item
  input.value = "";

  //Re-render the list to show the new item
  render();
}

//Toggle done
//Flips an item's done property between true and false.

function toggleDone(index) {
  if (items[index].done === false) {
    items[index].done = true;
  } else {
    items[index].done = false;
  }

  render();
}

//Delete an item
//Uses .filter() to return a new array without the deleted item.

function deleteItem(index) {
  items = items.filter(function (item, i) {
    return i !== index; // keep everything EXCEPT the one at this index
  });

  render();
}

//Clear all items

function clearAll() {
  items = [];
  render();
}

//Render
//Rebuilds the entire list from the items array.
//Uses forEach to loop, and if/else to show/hide the empty message.

function render() {
  //Clear the existing list
  itemList.innerHTML = "";

  //Show or hide the empty message
  if (items.length === 0) {
    emptyMsg.classList.remove("hidden");
    summaryEl.innerHTML = "";
    return; //nothing left to render
  }

  emptyMsg.classList.add("hidden");

  //Count how many are done using a for loop
  let doneCount = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].done === true) {
      doneCount = doneCount + 1;
    }
  }

  //Build the summary bar
  summaryEl.innerHTML =
    "<span>" +
    items.length +
    "</span> item" +
    (items.length !== 1 ? "s" : "") +
    " &nbsp;·&nbsp; " +
    "<span>" +
    doneCount +
    "</span> done" +
    "<button class='btn-clear-all' onclick='clearAll()'>Clear all</button>";

  //Build each list item using forEach
  items.forEach(function (item, index) {
    //Create the <li> element
    const li = document.createElement("li");
    li.className = "item" + (item.done ? " done" : "");

    //Create the text span — click it to toggle done
    const textSpan = document.createElement("span");
    textSpan.className = "item-text";
    textSpan.textContent = item.text;
    textSpan.addEventListener("click", function () {
      toggleDone(index);
    });

    //Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", function () {
      deleteItem(index);
    });

    //Put the pieces together and add to the list
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    itemList.appendChild(li);
  });
}

//Keyboard shortcut
//Press Enter in the input field to add an item (instead of clicking Add)

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addItem();
  }
});

//Run once on load
render();
