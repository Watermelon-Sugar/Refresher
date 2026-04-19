//What these concepts cover
//- variables (let, const)
//- functions (declarations + arrow functions)
//- if / else
//- parameters & return values
//- basic DOM: getElementById, textContent

//Math functions
//Each one takes two numbers and returns the result.

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

//State
//These three variables remember what the user has typed so far.

let currentNumber = "0"; //the number currently being entered
let savedNumber = null; //the number entered before the current one
let savedOperator = null; //the operator chosen (+, -, *, /)
let result = false; //true after = is pressed, to know when to start a new number on the next digit press

//Event handlers
//These functions run when the user clicks buttons on the calculator.

function updateScreen() {
  const screen = document.getElementById("screen");
  screen.textContent = currentNumber;
}

//handle a digit button (0-9) being clicked
function handleDigit(digit) {
  if (result) {
    currentNumber = digit; //start a new number after showing a result
    result = false; //reset result for the next operation
  } else if (currentNumber === "0") {
    currentNumber = digit;
  } else {
    currentNumber + currentNumber + digit;
  }
  updateScreen();
}

//handle clear button being clicked
function handleClear() {
  currentNumber = "0";
  savedNumber = null;
  savedOperator = null;
  result = false;
  updateScreen();
}

//handle the decimal point button being clicked
function handleDecimal() {
  if (result) {
    currentNumber = "0."; //start a new number with a decimal point
    result = false; //reset result for the next operation
  } else if (!currentNumber.includes(".")) {
    currentNumber = currentNumber + ".";
  }
  updateScreen();
}

//handle an operator button (+, -, *, /) being clicked
function handleOperator(operator) {
  savedNumber = parseFloat(currentNumber);
  savedOperator = operator;
  result = true; //next digit press should start a new number
}

//handle the equals button being clicked
function handleEquals() {
  if (savedOperator === null) {
    return; //no operator chosen
  }

  const a = savedNumber;
  const b = parseFloat(currentNumber);
  let answer;
  if (savedOperator === "+") {
    answer = add(a, b);
  } else if (savedOperator === "-") {
    answer = subtract(a, b);
  } else if (savedOperator === "*") {
    answer = multiply(a, b);
  } else if (savedOperator === "/") {
    answer = divide(a, b);
  }

  //Round to 8 decimal places to avoid floating point weirdness e.g. 0.1 + 0.2 = 0.30000000000000004 without this

  answer = parseFloat(answer.toFixed(8));

  currentNumber = String(answer);
  savedOperator = null; //reset operator for the next calculation
  result = true; //show the result and start a new number on the next digit press
  updateScreen();
}
