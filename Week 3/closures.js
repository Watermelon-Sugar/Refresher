//CLOSURES
//SCOPE CHAINING
//Scope: where variables live. Every variable lives in a scope. JS looks for a variable in the current scope first, then walks up through parent scopes until it finds it or runs out. This walking is called the scope chain.

const global = "I'm global";

function outer() {
  const outerVar = "I'm in outer";

  function inner() {
    const innerVar = "I'm in inner";

    //inner can see ALL of these:
    console.log(innerVar); //own scope
    console.log(outerVar); //parent scope
    console.log(global); //grandparent scope
  }

  //outer CANNOT see innerVar:
  console.log(innerVar); //ReferenceError
}

//Scope travels upward only — child sees parent, parent cannot see child. Each function creates its own new scope. Variables declared inside are invisible outside. Think of scope like nested rooms. You can see everything in your room and every room you're standing inside. But you can't see into a room inside yours.

//What is a closure? A closure is when an inner function remembers the variables from its outer function — even after the outer function has finished running. The inner function "closes over" those variables and keeps them alive.

function makeCounter() {
  let count = 0; //this variable belongs to makeCounter

  return function () {
    count = count + 1; //still has access to count!
    return count;
  };
}

const counter = makeCounter(); //makeCounter runs and finishes
//but count is NOT gone

console.log(counter()); //1
console.log(counter()); //2
console.log(counter()); //3

//makeCounter() returns a function. That returned function still holds a reference to count. Every call to counter() modifies the same count — it persists between calls. count is private — nothing outside makeCounter can access or reset it directly. Each closure gets its own copy. Calling makeCounter() twice creates two completely independent counters with their own separate count variables.

const counterA = makeCounter(); //its own count, starts at 0
const counterB = makeCounter(); //separate count, starts at 0

counterA(); //1
counterA(); //2
counterA(); //3

counterB(); //1  - completely independent
//This is why closures are powerful — each call to the factory function creates a fresh, isolated environment. counterB knows nothing about counterA's count.

//Why closures matter in real code
//Closures solve three common problems: private variables, factory functions, and remembering context in callbacks.

//1. Private variables
//Without closures, any code can reach in and set count = -999. With closures, count is unreachable from outside.

function makeScore() {
  let score = 0; //private — nobody outside can touch this

  return {
    add: function () {
      score += 1;
    },
    reset: function () {
      score = 0;
    },
    get: function () {
      return score;
    },
  };
}

const game = makeScore();
game.add();
game.add();
console.log(game.get()); //2

game.score = 999; //does nothing — score is not on the object

//2. Factory functions
//Create many similar functions, each remembering their own configuration.

function makeMultiplier(factor) {
  return function (number) {
    return number * factor; //factor is closed over
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

double(5); //10
triple(5); //15

//this — what is it?
//this is a special keyword that refers to the object that is currently running the code. Unlike regular variables, this doesn't have a fixed value — it changes depending on how the function is called, not where it is defined.

const user = {
  name: "Ada",
  greet: function () {
    console.log("Hello, I am " + this.name);
  },
};

user.greet(); //"Hello, I am Ada"
//this = user, because user called greet

//this always refers to the object to the left of the dot at call time.
//The core problem: When you pass a method as a callback, it loses its this — the object context is gone.

const user = {
  name: "Ada",
  greet: function () {
    console.log("Hello, I am " + this.name);
  },
};

user.greet(); //"Hello, I am Ada"

const fn = user.greet;
fn(); //"Hello, I am undefined"
//this is now the global object, not user
//This is the most common this bug. Assigning a method to a variable strips its context. this is determined at call time, not definition time — for regular functions.

//Four rules for what this equals
//In order of priority — the first rule that applies wins.

//1 - Method call — obj.method() → this is obj
user.greet(); // this = user
//2 - Plain function call — fn() → this is undefined (strict) or global
greet(); //this = undefined in modules, window in browser
//3 - new keyword — new Fn() - this is the new object being created
const obj = new MyClass(); //this = obj inside constructor
//4 - Arrow function — no own this. Inherits this from where it was defined
const user = {
  name: "Ada",
  greet: function () {
    const inner = () => {
      console.log(this.name); //"Ada" — arrow inherits outer this
    };
    inner();
  },
};
user.greet();

//Arrow functions don't have their own this — they use the this of the enclosing regular function. This is why arrow functions are commonly used inside callbacks and event handlers.

//bind/call/apply
//Permanently fix this with .bind()
//.bind(obj) returns a new function where this is permanently set to obj — no matter how or where it's called.

const user = {
  name: "Ada",
  greet: function () {
    console.log("Hello, I am " + this.name);
  },
};

const boundGreet = user.greet.bind(user); //lock this = user
boundGreet(); //"Hello, I am Ada" — every time, guaranteed

//Common use: event listener that needs this
document.getElementById("btn").addEventListener("click", user.greet.bind(user));

//.call(obj, arg1, arg2)
//Calls the function immediately with a specific this and individual arguments.

greet.call(user, "Lagos");
//runs now, this = user

//.apply(obj, [args])
//Same as .call() but arguments are passed as an array.

greet.apply(user, ["Lagos"]);
//runs now, args as array

//bind vs call vs apply — one line summary
//bind - returns a new function (doesn't call yet)
//call - calls immediately, args passed individually
//apply - calls immediately, args passed as array
//In modern JS, arrow functions have largely replaced .bind() for everyday use. But you'll see .bind() constantly in older code and libraries — understanding it is essential.
