//Arrays and Objects

//These three methods all loop through an array but with different goals. .map() transforms every item and gives you a new array of the same length. .filter() keeps only the items that pass a test and gives you a shorter array. .reduce() crunches the whole array down into a single value — a total, an object, anything you want.

//.map() — transform every item
//Loops through every item, applies your function, and returns a brand new array of the same length. The original is never changed.

//1 2 3 4 → ×2 each → 2 4 6 8

const numbers = [1, 2, 3, 4];
const doubled = numbers.map(function(n) {
  return n * 2;
});
// doubled → [2, 4, 6, 8]
// numbers → [1, 2, 3, 4] (unchanged!)

//What the callback receives
//Your function gets called once per item. It receives the current item, and you return what you want in its place.

const names = ["alice", "bob", "cara"];
const upper = names.map(function(name) {
  return name.toUpperCase();
});
// upper → ["ALICE", "BOB", "CARA"]

// Arrow function shorthand:
const upper2 = names.map(name => name.toUpperCase());

//Rule of thumb: use .map() any time you want to change every item in an array into something else.

//.filter() — keep only matching items
//Runs a test on every item. Items where the test returns true are kept. Items where it returns false are dropped. Always returns a new array.

//1 2 3 4 5 → keep evens → 1 2 3 4 5

const numbers2 = [1, 2, 3, 4, 5];
const evens = numbers2.filter(function(n) {
  return n % 2 === 0; // true = keep, false = drop
});

// evens → [2, 4]

//Filtering objects
//Filter works on arrays of objects too — very common in real apps.

const products = [
  { name: "apple", price: 1.5 },
  { name: "steak", price: 12 },
  { name: "bread", price: 2.5 },
];

const cheap = products.filter(function(item) {
  return item.price < 5;
});
// cheap → [{apple,1.5}, {bread,2.5}]

//The test function must return true or false.Any expression that evaluates to a boolean works: ===, >, <, .includes(), etc.


//.reduce() — crunch the array into one value
//Starts with an initial value (the accumulator), then visits each item and updates the accumulator. Returns the final accumulated value.

//10 20 30 → add up → 60

const numbers3 = [10, 20, 30];
const total = numbers3.reduce(function(accumulator, current) {
  return accumulator + current;
}, 0); // ← 0 is the starting value

// Step 1: 0 + 10 = 10
// Step 2: 10 + 20 = 30
// Step 3: 30 + 30 = 60
// total → 60

//Find the max
[3,7,1,9,4].reduce(function(max, n) {
  return n > max ? n : max;
}, 0);
// → 9

//Count occurrences
["a","b","a","c","a"].reduce(function(count, x) {
  return x === "a" ? count + 1 : count;
}, 0);
// → 3

//The two parameters are always: accumulator(the running result) and current(the item being visited right now).The second argument after the comma is the starting value of the accumulator.


//Chaining: use all three together
//Because each method returns a new array (or value), you can chain them on one line. Each step feeds directly into the next.

const orders = [
  { item: "coffee", price: 3, paid: true },
  { item: "cake", price: 5, paid: false },
  { item: "juice", price: 4, paid: true },
  { item: "sandwich",price: 8, paid: false },
];

const totalPaid = orders
  .filter(order => order.paid) // keep paid orders → coffee, juice
  .map(order => order.price) // grab prices → [3, 4]
  .reduce((sum, price) => sum + price, 0); // add up → 7
// totalPaid → 7

//Reading a chain left to right
//Think of each step as a sentence: "first filter, then map, then reduce."
//.filter()
//Remove items you don't want
//↓
//.map()
//Transform what's left
//↓
//.reduce()
//Combine into a final value

//You don't always need all three. Use only the ones that fit. .filter().map() is extremely common. .reduce() alone is enough for totals.

//Open list_index.html in your browser and try the dropdowns — you'll see all three methods working live.
//Here's exactly where each method lives in script.js so you can find them instantly:
//.filter() is in getFilteredProducts() — it goes through every product and keeps only the ones whose category matches what you selected. Change the dropdown and it re-runs.
//.map() is in buildListHTML() — it takes the filtered array of product objects and transforms each one into an HTML string. Those strings get joined and injected into the page with innerHTML. This is the core pattern behind every dynamic list you'll ever build.
//.reduce() is in buildSummary() — it walks through the filtered list and builds up a { count, total } object, adding 1 to the count and the price to the total on each step. One pass, one result.
//The .sort() in getSortedProducts() is a bonus method — it works like .map() in that it takes a function, but instead of transforming items it compares pairs of items to decide their order.