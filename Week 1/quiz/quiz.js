//Questions dataset
//An array of objects. Each object is one question.

const questions = [
  {
    question: "Which keyword declares a variable that cannot be reassigned?",
    options: ["var", "let", "const", "set"],
    correctIndex: 2,
  },
  {
    question: 'What does typeof "hello" return?',
    options: ["text", "string", "word", "char"],
    correctIndex: 1,
  },
  {
    question: "Which method creates a new array by transforming every item?",
    options: [".filter()", ".forEach()", ".reduce()", ".map()"],
    correctIndex: 3,
  },
  {
    question: 'What is the result of 5 + "3" in JavaScript?',
    options: ["8", "53", '"53"', "Error"],
    correctIndex: 2,
  },
  {
    question: "Which loop is easiest for going through every item in an array?",
    options: ["while loop", "for loop", "forEach", "switch"],
    correctIndex: 2,
  },
  {
    question: "Which method is used to convert a string to uppercase?",
    options: [".toUpperCase()", ".uppercase()", ".toCaps()", ".toString()"],
    correctIndex: 0,
  },
  {
    question: "What does NaN stand for?",
    options: [
      "No assigned number",
      "Not a number",
      "Null and none",
      "Negative and null",
    ],
    correctIndex: 1,
  },
  {
    question: "Which operator is used for strict equality comparison?",
    options: ["==", "=", "===", "!="],
    correctIndex: 2,
  },
  {
    question: "What keyword is used to stop a loop immediately?",
    options: ["stop", "exit", "break", "return"],
    correctIndex: 2,
  },
  {
    question: "Which method removes the last element from an array?",
    options: [".shift()", ".pop()", ".slice()", ".splice()"],
    correctIndex: 1,
  },
  {
    question: "What is the output of 2 ** 3 in JavaScript?",
    options: ["6", "8", "9", "5"],
    correctIndex: 1,
  },
  {
    question: "Which function converts a JSON string into a JavaScript object?",
    options: [
      "JSON.parse()",
      "JSON.stringify()",
      "JSON.convert()",
      "JSON.toObject()",
    ],
    correctIndex: 0,
  },
  {
    question: "What will typeof null return?",
    options: ["null", "object", "undefined", "boolean"],
    correctIndex: 1,
  },
  {
    question: "Which array method adds one or more elements to the end?",
    options: [".pop()", ".shift()", ".concat()", ".push()"],
    correctIndex: 3,
  },
  {
    question: "What does the 'this' keyword refer to in a regular function?",
    options: [
      "The function itself",
      "The global object or calling object",
      "The parent function",
      "Undefined always",
    ],
    correctIndex: 1,
  },
  {
    question: "Which symbol is used for single-line comments in JavaScript?",
    options: ["//", "<!-- -->", "/* */", "#"],
    correctIndex: 0,
  },
  {
    question: "What is the default value of an uninitialized variable?",
    options: ["null", "0", "undefined", "false"],
    correctIndex: 2,
  },
  {
    question: "Which method joins all elements of an array into a string?",
    options: [".join()", ".concat()", ".slice()", ".reduce()"],
    correctIndex: 0,
  },
  {
    question: "What will '5' - 2 evaluate to?",
    options: ["52", "NaN", "Error", "3"],
    correctIndex: 3,
  },
  {
    question: "Which keyword is used to define a class in JavaScript?",
    options: ["function", "object", "class", "prototype"],
    correctIndex: 2,
  },
];

//State
//These variables track where we are in the quiz.

let currentIndex = 0; // which question we're on
let score = 0; // how many correct answers so far
let answered = false; // has the user picked an answer yet?

//DOM references

const questionText = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const btnNext = document.getElementById("btn-next");
const counterEl = document.getElementById("counter");
const progressFill = document.getElementById("progress-fill");
const resultsDiv = document.getElementById("results");
const resultsTitle = document.getElementById("results-title");
const resultsBody = document.getElementById("results-body");

//Show a question
//Takes the current question object and renders it to the page.

function showQuestion(question) {
  answered = false;

  //Update counter and progress bar
  counterEl.textContent =
    "Question " + (currentIndex + 1) + " of " + questions.length;
  const percent = (currentIndex / questions.length) * 100;
  progressFill.style.width = percent + "%";

  //Set the question text
  questionText.textContent = question.question;

  // Clear previous options and feedback
  optionsDiv.innerHTML = "";
  feedbackEl.textContent = "";
  btnNext.classList.remove("visible");

  //Build one button for each option using a forEach loop
  question.options.forEach(function (optionText, index) {
    const button = document.createElement("button");
    button.textContent = optionText;
    button.className = "option";

    //When clicked, check the answer
    button.addEventListener("click", function () {
      checkAnswer(index);
    });

    optionsDiv.appendChild(button);
  });
}

//Check the answer
//Compares the clicked index to the correct index using if/else.

function checkAnswer(selectedIndex) {
  //Ignore clicks if already answered
  if (answered) {
    return;
  }

  answered = true;

  const question = questions[currentIndex];
  const allButtons = optionsDiv.querySelectorAll(".option");

  //Disable all buttons so they can't click again
  allButtons.forEach(function (btn) {
    btn.disabled = true;
  });

  //Check if the answer is correct
  if (selectedIndex === question.correctIndex) {
    score = score + 1;
    allButtons[selectedIndex].classList.add("correct");
    feedbackEl.textContent = "Correct!";
  } else {
    allButtons[selectedIndex].classList.add("wrong");
    allButtons[question.correctIndex].classList.add("correct");
    feedbackEl.textContent = "Not quite — the correct answer is highlighted.";
  }

  //Show the Next button
  btnNext.classList.add("visible");
}

//Move to the next question

function nextQuestion() {
  currentIndex = currentIndex + 1;

  //if/else: have we reached the end?
  if (currentIndex >= questions.length) {
    showResults();
  } else {
    showQuestion(questions[currentIndex]);
  }
}

//Show the results screen
//Uses a switch to pick a message based on the score.

function showResults() {
  // Hide the quiz elements
  questionText.style.display = "none";
  optionsDiv.style.display = "none";
  feedbackEl.style.display = "none";
  btnNext.style.display = "none";
  counterEl.style.display = "none";
  progressFill.style.width = "100%";

  //Show results
  resultsDiv.classList.add("visible");
  document.getElementById("btnRestart").classList.add("visible");
  resultsTitle.textContent = score + " / " + questions.length;

  //switch to pick the right message
  let message;

  switch (true) {
    case score === questions.length:
      message = "Perfect score! You've nailed the fundamentals.";
      break;

    case score >= 15:
      message = "Great work — you really understand this.";
      break;

    case score >= 10:
      message = "Solid effort! You're getting there.";
      break;

    case score >= 5:
      message = "Decent attempt — keep practicing.";
      break;

    default:
      message = "No worries — try again from the start!";
  }

  resultsBody.textContent = message;
}

//Restart the quiz

function restartQuiz() {
  //Reset state
  currentIndex = 0;
  score = 0;
  answered = false;

  //Show quiz elements again
  questionText.style.display = "";
  optionsDiv.style.display = "";
  feedbackEl.style.display = "";
  counterEl.style.display = "";
  resultsDiv.classList.remove("visible");
  document.getElementById("btnRestart").classList.remove("visible");

  //Load first question
  showQuestion(questions[0]);
}

//Start the quiz on page load
showQuestion(questions[0]);
