//Bug 1 Wrong comparison operator
//This function should return true if a number is greater than 10, but it never does — even for 99.

function isBig(n) {
  if (n = 10) {
    return true;
  }
  return false;
}

//The bug
//n = 10 is an assignment — it sets n to 10 instead of checking it. You need > to compare.

function isBig(n) {
  if (n > 10) {
    return true;
  }
  return false;
}

//Bug 2 Off-by-one in a for loop
//This should print all 5 items in the array, but the last one never appears.

const fruits = ["apple", "banana", "cherry", "date", "elderberry"];

for (let i = 0; i < fruits.length - 1; i++) {
  console.log(fruits[i]);
}

//The bug
//fruits.length - 1 stops one short. The array has 5 items (indices 0–4), so the condition must allow i to reach 4. Use i < fruits.length.

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

//Bug 3 Missing return in a function
//The result is always undefined, even though the calculation looks right.

function multiply(a, b) {
  a * b;
}

const result = multiply(6, 7);
console.log(result); // undefined

//The bug
//The function computes a * b but never sends the result back. Without return, a function gives back undefined.

function multiply(a, b) {
  return a * b;
}

const result = multiply(6, 7);
console.log(result); // 42

//Bug 4 Wrong method — filter vs map
//This should return only the numbers above 5, but instead returns an array of true/false values.

const numbers = [2, 6, 3, 9, 1, 7];

const bigOnes = numbers.map(function(n) {
  return n > 5;
});

//The bug
//.map() transforms every item — so returning n > 5 gives back true/false for each number. You want .filter(), which keeps items where the test is true.

const bigOnes = numbers.filter(function(n) {
  return n > 5;
});
// [6, 9, 7]

//Bug 5 const reassignment
//This crashes with a TypeError the moment the button is clicked.

const score = 0;

function addPoint() {
  score = score + 1;
  console.log(score);
}

//The bug
//const cannot be reassigned. Because score needs to change, it must be declared with let.

let score = 0;

function addPoint() {
  score = score + 1;
  console.log(score);
}