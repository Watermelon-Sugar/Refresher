let count = 0; //<- let, not const because it will change

const display = document.getElementById("display");

function updateDisplay() {
  display.textContent = count;
  display.className = count > 0 ? "positive" : count < 0 ? "negative" : "";
}

document.getElementById("increment").addEventListener("click", () => {
  count++; //or count += 1; //count = count + 1;
  updateDisplay();
});

document.getElementById("decrement").addEventListener("click", () => {
  count--; //or count -= 1; //count = count - 1;
  updateDisplay();
});

document.getElementById("reset").addEventListener("click", () => {
  count = 0;
  updateDisplay();
});

updateDisplay(); //Initialize display on page load

//The updateDisplay function is extracted so all three listeners call the same logic — no repeated code.
