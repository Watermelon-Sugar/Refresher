//10 functions

//1. sum -> adds 2 numbers 
const sum = (a, b) => a + b;
console.log(sum(5, 7)); // 12

//2. max -> returns the larger of 2 numbers
const max = (a, b) => (a > b ? a : b);
console.log(max(10, 20)); // 20

//3. isEven -> checks if a number is even
const isEven = (n) => n % 2 === 0;
console.log(isEven(4)); // true
console.log(isEven(7)); // false

//4. clamp -> keeps a value/number within min/max bounds
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
console.log(clamp(5, 1, 10)); // 5
console.log(clamp(-3, 0, 100)); // 0
console.log(clamp(150, 0, 100)); // 100

//5. filter -> keeps only items that pass a test (callback function)
const filter = (arr, test) => arr.filter(test);
const isPositive = (n) => n > 0;
console.log(filter([-2, -1, 0, 1, 2], isPositive)); // [1, 2]

//6. average -> mean of an array of numbers
const average = (arr) => arr.reduce((a,b) => a + b, 0) / arr.length;
console.log(average([1, 2, 3, 4, 5])); // 3

//7. capitalize -> uppercase the first letter
const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
console.log(capitalize("hello")); // "Hello"

//8. reverseString -> reverse the characters in a string
const reverseString = (str) => str.split("").reverse().join("");
console.log(reverseString("hello")); // "olleh"

//9. countOccurrences -> count how many times a value appears in an array
const countOccurrences = (arr, item) => arr.filter(x => x === item).length;
console.log(countOccurrences([1, 2, 3, 2, 4, 2], 2)); // 3

//10. pipe -> chain functions left to right
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const add2 = (n) => n + 2;
const multiplyBy3 = (n) => n * 3;
console.log(pipe(add2, multiplyBy3)(5)); // 21

//example of using pipe to transform a string
const shout = pipe(capitalize, (s) => s + "!");
console.log(shout("hello")); // "Hello!"

//pipe is the most advanced one — it takes other functions as arguments. That's called a higher-order function. Skip it for now if it looks confusing; come back once the others feel natural.

