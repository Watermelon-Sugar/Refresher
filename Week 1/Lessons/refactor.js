//Refactoring means making code do the same thing, but clearer and cleaner. The logic doesn't change — only how it's written.

//Refactor 1 - Replace var with const / let
//Old habit. Every var should be const (if it never changes) or let (if it does).

//Before
var name = "Sam";
var score = 0;
var greeting = "Hello, " + name;

//After
const name = "Sam";        // never changes → const
let   score = 0;          // will change → let
const greeting = `Hello, ${name}`; // template literal

//Refactor 2 - Replace a for loop with forEach
//When you don't need an index and aren't breaking early, forEach is cleaner.

//Before
const names = ["Alice", "Bob", "Cara"];

for (let i = 0; i < names.length; i++) {
  console.log("Hello, " + names[i]);
}

//After
names.forEach(function(name) {
  console.log(`Hello, ${name}`);
});
//Same output. Less mental overhead — no i, no length check, no bracket indexing.

//Refactor 3 - Extract repeated logic into a function
//Any time you write the same thing more than once, that's a sign to create a function.

//Before
const price1 = 10 * 1.1;  // add 10% tax
const price2 = 25 * 1.1;
const price3 = 8  * 1.1;

//After
const addTax = (price) => price * 1.1;

const price1 = addTax(10);
const price2 = addTax(25);
const price3 = addTax(8);
// If the tax rate ever changes, you update it in one place — not three.

//Refactor 4 - Use .map() instead of a manual push loop
//Building a new array with a for loop and push is the classic pattern that .map() was made to replace.

//Before
const prices = [10, 20, 30];
const doubled = [];

for (let i = 0; i < prices.length; i++) {
  doubled.push(prices[i] * 2);
}

//After
const prices = [10, 20, 30];
const doubled = prices.map(price => price * 2);
// 4 lines → 2 lines. Same result. .map() makes the intent obvious: "transform every item."