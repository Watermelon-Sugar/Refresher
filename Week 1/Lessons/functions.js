//Functions: the core idea. A function is a reusable block of code with a name. You give it inputs (parameters), it does something, and gives you back an output (return value). The two syntaxes you'll see everywhere are function declarations and arrow functions — they work almost identically for everyday use.

//Function declaration classic
//Starts with the function keyword. Can be called before it's defined (hoisted).

function greet(name) {
  return `Hello, ${name}!`;
}

greet("Sam"); // "Hello, Sam!"

//Arrow function modern
//Shorter syntax. Stored in a variable. Cannot be called before it's defined.

const greet = (name) => {
  return `Hello, ${name}!`;
};

greet("Sam"); // "Hello, Sam!"

//Arrow function shorthand — implicit return
//If the function body is a single expression, drop the curly braces and return.

const double = (n) => n * 2;
const square = (n) => n * n;
const greet = (name) => `Hi ${name}`;

double(5); // 10
square(4); // 16

//Use arrow functions for short, one-job operations. Use function declarations for larger, named functions you call many times. In modern JS, arrows are more common for callbacks and utilities.


//Parameters are the inputs
//You name them inside the parentheses. They work like local variables inside the function.

function add(a, b) { // a and b are parameters
  return a + b;
}

add(3, 4); // 3 and 4 are arguments → returns 7

//Default parameter values
//Provide a fallback if the caller doesn't pass a value.

function greet(name = "stranger") {
  return `Hello, ${name}!`;
}

greet("Sam"); // "Hello, Sam!"
greet(); // "Hello, stranger!"

//Return values
//return sends a value back to whoever called the function. Without it, the function returns undefined.

const multiply = (a, b) => a * b;

const result = multiply(6, 7);
console.log(result); // 42

// You can use the return value directly:
console.log(multiply(3, 3) + 1); // 10

//Think of a function like a vending machine: you put something in (arguments), it processes, and hands something back(return value). If there's no return, you get an empty hand — undefined.


