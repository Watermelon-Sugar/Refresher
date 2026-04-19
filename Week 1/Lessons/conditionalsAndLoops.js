
//Conditionals let your code make decisions. if/else checks a condition and runs different code depending on whether it's true or false. switch is cleaner when you're comparing one value against many possible options.
//Loops let you repeat code. A for loop runs a set number of times. forEach is a cleaner way to loop over an array — it's essentially a for loop built into every array.

//if / else — make a decision
//Runs a block of code only when a condition is true. The else block runs when it's false. You can chain as many else if branches as you need.

const score = 72;

if (score >= 90) {
  console.log("A");
} else if (score >= 70) {
  console.log("B"); // ← this runs
} else if (score >= 50) {
  console.log("C");
} else {
  console.log("Fail");
}

//JS checks each condition from top to bottom and stops at the first one that is true. The else block is the safety net — it only runs if nothing else matched.

//switch — match one value against many options
//Like a series of if/else checks, but cleaner when you're comparing one variable against several exact values. Each case needs a break to stop it falling through to the next one.

const day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of the week"); // ← runs
    break;
  case "Friday":
    console.log("End of the week");
    break;
  default:
    console.log("Midweek");
}
//default is like the else — it runs if no case matched. Always include it as a safety net. Always include break or JS will run the next case too.


//for loop — repeat something a set number of times
//Three parts inside the parentheses: start, condition (keep going while true), and step (what to do after each loop).

// for (start; keep going while...; step each time)
for (let i = 0; i < 5; i++) {
  console.log("Count: " + i);
}
// Count: 0
// Count: 1
// Count: 2
// Count: 3
// Count: 4

//Looping through an array with for
const fruits = ["apple", "banana", "cherry"];

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
// apple, banana, cherry
//i++ is shorthand for i = i + 1. i starts at 0 because arrays are zero-indexed — the first item is at index 0, not 1.


//forEach — loop through every item in an array
//A cleaner way to loop through an array when you don't need an index counter. You pass a function and it gets called once per item.

//const fruits = ["apple", "banana", "cherry"];

fruits.forEach(function(fruit) {
  console.log(fruit);
});
// apple
// banana
// cherry
//You can also get the index
fruits.forEach(function(fruit, index) {
  console.log(index + ": " + fruit);
});
// 0: apple
// 1: banana
// 2: cherry
//forEach is the most readable way to loop an array. One rule: you can't break out of a forEach early. If you need to stop mid-loop, use a regular for loop.

//for loop
//Use when you need the index, need to count, or need to break early.

for (let i = 0; i < arr.length; i++) {
  if (arr[i] === "stop") break;
  console.log(arr[i]);
}

//forEach
//Use when you just want to do something with every item. Cleaner to read.

arr.forEach(function(item) {
  console.log(item);
});

//Same result, different style
//Both of these do the exact same thing — loop through every item and log it.

const nums = [10, 20, 30];

// with for:
for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}

// with forEach — same output, less to write:
nums.forEach(function(n) {
  console.log(n);
});

//As a beginner, default to forEach for arrays.Switch to for when you need break, or when you need to count or track position.