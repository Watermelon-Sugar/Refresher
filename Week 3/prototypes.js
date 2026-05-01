//What is the prototype chain?
//Every object in JS has a hidden link to another object called its prototype. When you access a property that doesn't exist on an object, JS automatically walks up through the chain of prototypes looking for it. This is how all objects share methods without each one having its own copy.

//Your object
const dog = { name: "Rex", breed: "Lab" }; //looks here first, then walks up to...
Dog.prototype;
//bark() { ... }   sleep() { ... }
//not found? walks up to...
Object.prototype;
//toString()   hasOwnProperty()   valueOf()
//not found? walks up to...
//End of chain
//null — search stops here, returns undefined

//This is why you can call [1,2,3].map() — arrays don't each have their own map. They all share it through Array.prototype.
//Seeing it in action
function Dog(name, breed) {
  this.name = name; //own property — lives on each dog
  this.breed = breed; //own property — lives on each dog
}

//Shared method — lives ONCE on the prototype
Dog.prototype.bark = function () {
  return this.name + " says: Woof!";
};

const rex = new Dog("Rex", "Lab");
const luna = new Dog("Luna", "Poodle");

rex.bark(); //"Rex says: Woof!"
luna.bark(); //"Luna says: Woof!"

//Both dogs share ONE bark function — it's not duplicated
rex.bark === luna.bark; //true

//rex.name is an own property — it lives directly on rex.
//rex.bark is not on rex — JS finds it by walking up to Dog.prototype.
//You rarely write to .prototype directly anymore — ES6 classes do it for you. But understanding the prototype chain explains why classes work the way they do.

//ES6 classes — cleaner prototype syntax. Classes are syntactic sugar over prototypes — they write the same prototype chain setup, just in a much cleaner way. Under the hood, it's identical to the function + prototype approach.

class Animal {
  //constructor runs when you call new Animal()
  constructor(name, sound) {
    this.name = name; //own property
    this.sound = sound; //own property
  }

  //This goes on Animal.prototype automatically
  speak() {
    return this.name + " says " + this.sound;
  }
}

const cat = new Animal("Luna", "Meow");
cat.speak(); //"Luna says Meow"

//Inheritance with extends. extends creates a child class that inherits everything from the parent. super() calls the parent constructor to set up the shared properties.

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Woof"); //calls Animal's constructor
    this.breed = breed; //Dog's own extra property
  }

  //Adds to the chain — Dog.prototype → Animal.prototype
  fetch() {
    return this.name + " fetches the ball!";
  }
}

const rex = new Dog("Rex", "Lab");
rex.speak(); //inherited from Animal — "Rex says Woof"
rex.fetch(); //own method — "Rex fetches the ball!"

//The chain is: rex - Dog.prototype - Animal.prototype - Object.prototype - null. You must call super() before accessing this in a child constructor — JS enforces this. Forgetting super() causes a ReferenceError.

//Destructuring - Object destructuring — pull values out by name. Instead of writing obj.name, obj.age, obj.city three times, destructuring lets you pull all three out in one line.

const user = { name: "Ada", age: 28, city: "Lagos" };

//Old way
const name = user.name;
const age = user.age;

//Destructuring — same result, one line
const { name, age, city } = user;

console.log(name); //"Ada"
console.log(age); //28

//Variable names must match the object's keys exactly — JS matches by name, not position. Rename and default values
const user = { name: "Ada", age: 28 };

//Rename: pull name as userName
const { name: userName, age: userAge } = user;
console.log(userName); //"Ada"

//Default value: used when the key is missing
const { name, role = "guest" } = user;
console.log(role); //"guest" — user has no role property

//Array destructuring — pull values out by position. Arrays are destructured by position, not name. You can skip elements with commas.

const colours = ["red", "green", "blue", "yellow"];

//Pull by position
const [first, second] = colours;
console.log(first); //"red"
console.log(second); //"green"

//Skip elements with commas
const [, , third] = colours;
console.log(third); //"blue" — skipped first two

//Swap two variables — no temp variable needed
let a = 1,
  b = 2;
[a, b] = [b, a];
console.log(a, b); //2 1

//Destructuring in function parameters. The most common place you'll see destructuring in real code — pulling just what you need from an object argument.

//Without destructuring
function greet(user) {
  return "Hello, " + user.name + " from " + user.city;
}

//With destructuring — cleaner, self-documenting
function greet({ name, city }) {
  return `Hello, ${name} from ${city}`;
}

greet({ name: "Ada", city: "Lagos", age: 28 });
//"Hello, Ada from Lagos" — only name and city extracted

//This pattern is everywhere in React — every component receives a props object and immediately destructures it in the parameter list.

//Spread operator — expand an array or object. The three dots ... spread the contents of an array or object into another. Think of it as unpacking a box and pouring its contents into a new box.

//Spread with arrays
const a = [1, 2, 3];
const b = [4, 5, 6];

//Merge arrays
const merged = [...a, ...b]; //[1,2,3,4,5,6]

//Copy an array
const copy = [...a]; //[1,2,3] — new array

//Add items while spreading
const extended = [0, ...a, 4]; //[0,1,2,3,4]

//Spread with objects
const defaults = { theme: "dark", lang: "en", fontSize: 14 };
const overrides = { fontSize: 18, showGrid: true };

//Merge — right side wins on conflicts
const config = { ...defaults, ...overrides };
//{ theme: "dark", lang: "en", fontSize: 18, showGrid: true }

//Shallow copy of an object
const copy = { ...defaults };

//Update one field immutably
const updated = { ...defaults, fontSize: 20 };
//{ theme: "dark", lang: "en", fontSize: 20 }
//defaults is unchanged

//When two spreads have the same key, the later one wins. {...a, ...b} — b's keys override a's.

//Spread creates a shallow copy. Nested objects are still shared references, not fully independent copies.

//Spread into function arguments
const nums = [5, 2, 9, 1, 7];

//Math.max doesn't accept an array — it wants individual args
Math.max(nums); //NaN
Math.max(...nums); //9 — spreads array into individual args

//Same as:
Math.max(5, 2, 9, 1, 7); //9

//Rest — collect the remaining items. Rest looks identical to spread — both use .... The difference is context: spread expands, rest collects. Rest always appears in a parameter list or destructuring pattern, and always comes last.

//Rest in function parameters
function sum(...numbers) {
  //collects ALL args into an array
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3); //6  — numbers = [1,2,3]
sum(10, 20, 30, 40); //100
sum(...[5, 5, 5]); //15 — spread feeding into rest

//Rest collects however many arguments you pass — zero or one hundred. The function always gets an array. Rest with named parameters. Named parameters come first, rest collects everything after.

function log(level, ...messages) {
  messages.forEach((msg) => {
    console.log(`[${level}]`, msg);
  });
}

log("INFO", "Server started", "Port: 3000");
//[INFO] Server started
//[INFO] Port: 3000

//Rest in destructuring. Pull out the first items you need, collect the rest into a new array or object.

//Array rest
const [first, second, ...remaining] = [1, 2, 3, 4, 5];
console.log(first); //1
console.log(remaining); //[3, 4, 5]

//Object rest — pull some keys, collect the rest
const { name, ...otherProps } = {
  name: "Ada",
  age: 28,
  city: "Lagos",
};
console.log(name); //"Ada"
console.log(otherProps); //{ age: 28, city: "Lagos" }

//Rest must always be the last item in a destructure or parameter list.const[...rest, last] is a SyntaxError.

//All three features working together. A realistic function that uses destructuring in parameters, rest to collect extra data, and spread to build the result.

//updateUser: takes current user + any override fields
function updateUser({ id, ...currentData }, updates) {
  //Destructuring: pull id out, rest collects remaining fields
  //Spread: merge current data with updates (updates win)
  return {
    id, //shorthand for id: id
    ...currentData, //spread existing fields
    ...updates, //spread updates — override any matching keys
    updatedAt: new Date().toISOString(),
  };
}

const user = { id: 1, name: "Ada", city: "Lagos", role: "dev" };
const result = updateUser(user, { city: "Abuja", role: "lead" });

//result:
//{ id: 1, name: "Ada", city: "Abuja", role: "lead", updatedAt: "..." }
//user is untouched — spread creates a new object

//This is the immutable update pattern used in Redux, React state, and most modern state management.You never mutate the original — you always spread into a new object with overrides.

//Quick reference
// Prototype
MyClass.prototype.method = function () {}; //add to all instances
class Child extends Parent {} //inherit via chain

//Destructuring
const { a, b } = obj; //object — by name
const [x, y] = arr; //array  — by position
const { a: renamed } = obj; //rename while destructuring
const { a = "default" } = obj; //default if missing

//Spread — expands
[...arr1, ...arr2]; //merge arrays
//{ ...obj1, ...obj2 }            //merge objects
fn(...arr); //spread as function args

//Rest — collects
function fn(...args) {} //all args into array
function fn(a, b, ...rest) {} //named + rest
const { a, ...rest } = obj; //destructure + collect rest

