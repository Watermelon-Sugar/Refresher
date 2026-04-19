//The three ways to declare a variable

var name = "Alex"; // old way — avoid this
let age = 25; // use this for values that change
const PI = 3.14; // use this for values that never change

//let
//Can be reassigned. Use when the value will update — like a score, a counter, or user input.

let score = 0;
score = 10; // ✓ fine

//const
//Cannot be reassigned. Use for things that stay fixed — config values, URLs, constants.

const url = "api.com";
url = "x"; // ✗ error!

//Default rule: use const for everything. Switch to let only when you need to reassign. Avoid var.

//Naming rules 
const firstName = "Sam"; // ✓ camelCase is standard
const _count = 5; // ✓ underscore is fine
//const 2fast = "no"; // ✗ can't start with a number
//const my-var = "no"; // ✗ hyphens not allowed

//Variables are just named containers. const and let are the modern way to create them — ignore var for now. Default to const, and only switch to let when you know the value needs to change.

//The 7 primitive types + objects
//string - Text. Wrap in quotes — single, double, or backtick.
"Hello"  'World'  `Hi ${name}`

//number - Integers and decimals — JS uses just one type for both.
42   3.14   -7

//boolean - Only two values — true or false.
true   false

//null - Intentional emptiness. You set it on purpose to mean "no value here".

//undefined - Unintentional emptiness. JS sets this when a variable is declared but not yet assigned.

//object - A collection of key-value pairs.
{ name: "Sam", age: 25 }

//array
//An ordered list (technically a special object).
[1, 2, "three", true]

//Check any type with typeof
typeof "hello" // "string"
typeof 42 // "number"
typeof true // "boolean"
typeof null // "object" ← famous JS bug!
typeof undefined // "undefined"


//Data types describe what's inside the container. The ones you'll use 90% of the time are strings, numbers, booleans, objects, and arrays. The tricky pair is null vs undefined — both mean "empty," but null is something you write intentionally, while undefined is what JS fills in automatically.

//These are the things that confused most beginners — including you, probably.

//1. == vs ===
//== compares values but ignores types. === compares both. Always use ===.

5 == "5" // true (coerces type — surprise!)
5 === "5" // false (strict — number ≠ string)

//2. null vs undefined
//Both mean "no value" but come from different sources.

let a; // undefined — JS did this
let b = null; // null — you did this intentionally

//3. const doesn't mean immutable
//You can't reassign a const variable, but you can still modify its contents if it's an object or array.

const user = { name: "Sam" };
user.name = "Alex"; // ✓ this works!
user = {}; // ✗ this throws an error

//4. + with strings does concatenation
//JS is "helpful" — if one side is a string, + glues instead of adds.

5 + 3 // 8
"5" + 3 // "53" ← string!
5 + "3" // "53" ← also string!

//Use template literals(backticks) to safely mix text and values:
const msg = `Score: ${score}`;


//Type Conversion

//Type conversion — the live input box lets you type anything and instantly see what Number(), Boolean(), and String() do with it. Great for building intuition about falsy values and NaN.

//String → Number
Number("42") // 42
Number("3.14") // 3.14
Number("abc") // NaN ← "Not a Number"
parseInt("42px") // 42 ← grabs the number part
parseFloat("3.5em") // 3.5

//Number → String
(42).toString() // "42"
String(3.14) // "3.14"
`Value: ${42}` // "Value: 42" ← template literal

//Anything → Boolean
Boolean(0) // false ← falsy values:
Boolean("") // false 0, "", null, undefined, NaN
Boolean(null) // false
Boolean(1) // true ← everything else is truthy
Boolean("hello") // true

//Always check for NaN after converting user input: use isNaN(value) or Number.isNaN(value).


//Arrays — type any comma-separated numbers and watch map, filter, find, and sort react in real time. The key insight: these methods don't mutate the original — they return new arrays.

//Creating & reading
const fruits = ["apple", "banana", "cherry"];
fruits[0] // "apple" ← index starts at 0
fruits[2] // "cherry"
fruits.length // 3

//Adding & removing
fruits.push("date") // adds to END → ["apple","banana","cherry","date"]
fruits.pop() // removes from END → "date"
fruits.unshift("avocado") // adds to START
fruits.shift() // removes from START

//Essential methods
const nums = [1,2,3,4,5];

nums.map(n => n * 2) // [2,4,6,8,10] transform each
nums.filter(n => n > 2) // [3,4,5] keep matching
nums.find(n => n > 3) // 4 first match
nums.includes(3) // true
nums.join(", ") // "1, 2, 3, 4, 5"

//map, filter, and find never change the original array — they always return a new one.

//Objects — use the key/value builder to construct an object live. Try adding a few entries to see how {} fills up, then read the code patterns (destructuring + spread) that you'll see constantly in real projects.

//Creating & reading
const user = {
  name: "Sam",
  age: 25,
  isAdmin: false
};

user.name // "Sam" ← dot notation
user["age"] // 25 ← bracket notation

//Adding, updating & deleting
user.email = "sam@example.com"; // add new key
user.age = 26; // update existing
delete user.isAdmin; // remove a key

//Useful patterns
Object.keys(user) // ["name","age","email"]
Object.values(user) // ["Sam", 26, "sam@..."]

const { name, age } = user; // destructuring — pull out keys
const copy = { ...user }; // spread — shallow clone
const merged = { ...user, role: "editor" }; // merge + add

//Destructuring and spread (...) are the two object tricks you'll see everywhere in real JS code.


//Counter app — a fully working increment/decrement counter with the actual code shown alongside it. Notice count is declared with let — that's the direct payoff from last session.