//async/await is just Promises with nicer syntax
//Under the hood, async/await is 100% Promises. It doesn't add new functionality — it just makes async code look and read like normal synchronous code. No more chaining .then() calls.

//Promise version — chained .then()
fetchUser(1)
  .then(function(user) {
    return fetchOrders(user.id);
  })
  .then(function(orders) {
    console.log(orders);
  });

//sync/await version — reads like normal code
async function loadData() {
  const user   = await fetchUser(1);
  const orders = await fetchOrders(user.id);
  console.log(orders);
}

//Same result, same timing. async/await just reads top-to-bottom like regular code.
//Two new keywords — that's all
//1 - async — put this before function. It tells JS: "this function will do async work and always returns a Promise."
//2 - await — put this before a Promise. It tells JS: "pause here and wait for this Promise to resolve, then give me the value." await can only be used inside an async function. That's the one hard rule. If you try to use await outside async, you'll get a SyntaxError.

//How to write an async function
//Step 1 — add async before the function keyword. Step 2 — use await before any call that returns a Promise. That's it.

// Step 1: add async before function
async function loadUserData() {

  // Step 2: add await before anything that returns a Promise
  const user = await fetchUser(1);

  // user is now the resolved value — not a Promise!
  console.log(user.name); // "Ada Okonkwo"

  const orders = await fetchOrders(user.id);
  console.log(orders.length); // 2
}

//await unwraps the Promise — you get the plain value, not a Promise object.
//Each await line pauses only that function, not the entire browser. Other things can still run.
//async functions always return a Promise
//Even if you return a plain value, the async function wraps it in a resolved Promise automatically.

async function getNumber() {
  return 42; // automatically becomes Promise.resolve(42)
}

getNumber().then(function(n) {
  console.log(n); // 42
});

//This means you can still use .then() on an async function if you want to. Both styles work together.

//Error handling with try/catch
//With Promises you used .catch(). With async/await you use a regular try/catch block — the same pattern used for synchronous errors.

async function loadUserData() {
  try {
    //Any await that rejects jumps to the catch block
    const user   = await fetchUser(1);
    const orders = await fetchOrders(user.id);
    console.log("Done:", orders);

  } catch (error) {
    //Catches errors from ANY await above
    console.log("Error:", error.message);

  } finally {
    //Runs no matter what — success or failure
    console.log("Loading finished");
  }
}

//try — put your await calls here. If any of them reject, execution jumps to catch immediately.
//catch (error) — error is the value passed to reject(). Access its message with error.message.
//finally — optional. Same as Promise's .finally() — runs whether it succeeded or failed.
//Never leave an async function without error handling
//If a Promise rejects and you have no try/catch, the error is silently swallowed — nothing happens and nothing tells you why. Always wrap awaits in try/catch.

//Bad — if fetchUser rejects, error disappears silently
async function bad() {
  const user = await fetchUser(-1);
}

//Good — error is caught and handled
async function good() {
  try {
    const user = await fetchUser(-1);
  } catch (error) {
    console.log("Caught:", error.message);
  }
}

//Rule 1 — await only works inside async
//wrong - SyntaxError — await outside async function
function bad() {
  const user = await fetchUser(1); // crashes
}

//Correct
async function good() {
  const user = await fetchUser(1); // fine
}

//Rule 2 — await only makes sense on a Promise
//Awaiting a non-Promise value doesn't crash but does nothing useful — it just immediately gives you the value back.

async function example() {
  const a = await 42;   // works but pointless — a is 42
  const b = await fetchUser(1); // useful — b is the user object
}

//Rule 3 — event listeners need a wrapper
//You can't make an event listener callback async directly in a clean way. The standard pattern is to write an async function and call it from inside the listener.

//Messy — async on the listener itself
//btn.addEventListener('click', async function() { ... });

//Clean — separate named async function
async function handleClick() {
  try {
    const user = await fetchUser(1);
    console.log(user);
  } catch (error) {
    console.log(error.message);
  }
}

btn.addEventListener('click', handleClick);
//Named async functions are easier to read, easier to debug (the function name appears in error traces), and easier to reuse.


//All three patterns — exact same task. Read them left to right to see the evolution.

//Callback
fetchUser(1,
  function(user) {
    fetchOrders(user.id,
      function(orders) {
        console.log(orders);
      },
      function(err) {
        console.log(err);
      }
    );
  },
  function(err) {
    console.log(err);
  }
);

//Nested.Two separate error handlers.

//Promise (.then/.catch)
fetchUser(1)
  .then(function(user) {
    return fetchOrders(user.id);
  })
  .then(function(orders) {
    console.log(orders);
  })
  .catch(function(error) {
    console.log(error.message);
  });

//Flat.One shared error handler.
//async/await
async function loadData() {
  try {
    const user   = await fetchUser(1);
    const orders = await fetchOrders(user.id);
    console.log(orders);
  } catch (error) {
    console.log(error.message);
  }
}

//Reads like sync code. One shared error handler.