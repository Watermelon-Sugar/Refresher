//The problem: JavaScript runs one line at a time
//JS is single-threaded — it can only does one thing at a time. But some operations take time: fetching data from a server, reading a file, waiting for a timer. If JS stopped and waited, the whole page would freeze.

// Imagine this took 3 seconds:
const data = getDataFromServer(); //page freezes for 3 seconds
console.log(data);
console.log("This can't run until above finishes");
//The solution is asynchronous code — JS kicks off the slow task, moves on to other work, and comes back to handle the result when it's ready.

//The real-world analogy
//Think of ordering food at a restaurant. You don't stand frozen at the counter waiting for your food — you sit down, do other things, and the waiter brings it to you when it's ready. That's async.

//Synchronous
//Stand at counter. Wait. Food arrives. Walk to table. Eat.

//Asynchronous
//Order food. Sit down. Chat. Phone rings. Waiter arrives with food. Eat.
//Two tools JS gives you to handle async
//1 - Callbacks — the original way. Pass a function as an argument. It gets called when the task is done.
//2 - Promises — the modern way. A Promise is an object that represents a task that hasn't finished yet. You attach .then() and .catch() to handle success or failure.
//You'll use Promises far more often in real projects. But understanding callbacks first makes Promises click much faster.

//What is a callback?
//A callback is just a function you pass to another function as an argument. The receiving function calls it later — when it's done with its work. You already use callbacks: addEventListener and forEach both take callbacks.

// forEach takes a callback — you already know this!
[1, 2, 3].forEach(function(n) { //this function IS the callback
  console.log(n);
});

//The callback is the function you pass in. forEach decides when to call it (once per item).
//Callbacks for async work — setTimeout
//setTimeout is the simplest async function in JS. It takes a callback and a delay in milliseconds. JS moves on immediately and calls the callback after the delay.

//Step 1: JS reads this line and registers the callback
setTimeout(function() {
  //Step 3: This runs after 2 seconds
  console.log("Done waiting!");
}, 2000); // 2000ms = 2 seconds

// Step 2: This runs immediately — doesn't wait!
console.log("I run first");

//Output: "I run first" ... then 2 seconds later ... "Done waiting!" — JS didn't stop.
//A callback pattern with success and error
//The Node.js convention is to pass two callbacks: one for success, one for failure. Or pass a single callback with an error as its first argument.

function fetchUser(id, onSuccess, onError) {
  setTimeout(function() {
    if (id > 0) {
      onSuccess({ id: id, name: "Sam" }); //call success callback
    } else {
      onError("Invalid ID"); //call error callback
    }
  }, 1000);
}

// Using it:
fetchUser(
  1,
  function(user)  { console.log("Got:", user); },  //onSuccess
  function(err)   { console.log("Error:", err); }  //onError
);

//Callback Hell
//The problem with callbacks: nesting
//When one async task depends on another, you have to nest callbacks inside callbacks. This gets deeply indented and hard to read very fast. This pattern is called "callback hell" or the "pyramid of doom".

// Get user - then get their orders - then get order details
fetchUser(1, function(user) {
  fetchOrders(user.id, function(orders) {
    fetchOrderDetail(orders[0].id, function(detail) {
      fetchProduct(detail.productId, function(product) {
        // 4 levels deep — and we haven't handled errors yet!
        console.log(product);
      });
    });
  });
});

//Each level adds indentation. Error handling at every level doubles the nesting.This is exactly the problem Promises were invented to solve.

//What is a Promise?
//A Promise is an object that represents a task that will complete in the future. It has three possible states:

//1 - Pending — the task is still running
//2 - Fulfilled — the task succeeded, a value is available
//3 - Rejected — the task failed, an error is available
//A Promise can only ever move from Pending → Fulfilled or Pending → Rejected. It can never go backwards or change state twice.

//Creating a Promise
//You create a Promise by calling new Promise() and passing it a function. That function receives two arguments: resolve (call this on success) and reject (call this on failure).

function fetchUser(id) {
  //Return a Promise — the caller can chain .then() on it
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (id > 0) {
        resolve({ id: id, name: "Sam" }); //success — send data
      } else {
        reject(new Error("Invalid ID"));   //failure — send error
      }
    }, 1000);
  });
}

//resolve(value) — call this when the task succeeds. The value gets passed to .then().
//reject(error) — call this when the task fails. The error gets passed to .catch().
//Always pass an Error object to reject(), not a plain string. It gives you a stack trace.
//Consuming a Promise with .then() and .catch()
//Once you have a function that returns a Promise, you use .then() to handle success and .catch() to handle failure.

fetchUser(1)
  .then(function(user) {
    //Runs when resolve() was called
    console.log("Got user:", user.name);
  })
  .catch(function(error) {
    //Runs when reject() was called
    console.log("Failed:", error.message);
  });
//One .catch() at the bottom handles errors from every .then() above it. With callbacks, you had to write error handling at every single level.

//Promise chaining — solving callback hell
//Each .then() returns a new Promise. This means you can chain them flat instead of nesting. The same three-step async flow from the callback hell example, rewritten with Promises:

fetchUser(1)
  .then(function(user) {
    return fetchOrders(user.id); //return next Promise
  })
  .then(function(orders) {
    return fetchOrderDetail(orders[0].id);
  })
  .then(function(detail) {
    console.log("Detail:", detail);
  })
  .catch(function(error) {
    //ONE catch handles errors from ALL steps above
    console.log("Something failed:", error.message);
  });

//Flat, readable, one error handler — same logic as the callback hell version but completely different to read.
//The key: inside .then(), if you return a Promise, the next .then() waits for it.
//.finally() — runs no matter what
//Add .finally() after .catch() for cleanup code that must run whether the Promise succeeded or failed — like hiding a loading spinner.

fetchUser(1)
  .then(function(user)  { console.log(user); })
  .catch(function(err)   { console.log(err); })
  .finally(function()  {
    // Always runs — success or failure
    console.log("Loading finished");
  });

//The exact same async task — written both ways. Read them side by side.

//Callback version
function getUser(id, onOk, onFail) {
  setTimeout(function() {
    if (id > 0) {
      onOk({ id: id });
    } else {
      onFail("Bad ID");
    }
  }, 1000);
}

getUser(
  1,
  function(u) { console.log(u); },
  function(e) { console.log(e); }
);

//Promise version
function getUser(id) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (id > 0) {
        resolve({ id: id });
      } else {
        reject(new Error("Bad ID"));
      }
    }, 1000);
  });
}

getUser(1)
  .then(function(u) { console.log(u); })
  .catch(function(e) { console.log(e); });
//The Promise version is slightly more code for a single task, but scales dramatically better when tasks depend on each other. It also separates the "what to do" from the "how to handle results".
