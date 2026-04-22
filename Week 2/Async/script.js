const logPanel = document.getElementById("log-panel");

function log(message, type) {
  //Remove the "Press a button" empty state on first log
  const emptyMsg = logPanel.querySelector(".log-empty");
  if (emptyMsg) {
    logPanel.removeChild(emptyMsg);
  }

  //Get current time as HH:MM:SS for the timestamp
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeStr = hours + ":" + minutes + ":" + seconds;

  //Build the log entry element
  const entry = document.createElement("div");
  entry.className = "log-entry " + (type || "info");

  //innerHTML sets the inner HTML of the div
  entry.innerHTML =
    '<span class="log-time">' +
    timeStr +
    "</span>" +
    '<span class="log-text">' +
    message +
    "</span>";

  //appendChild adds the new element to the bottom of the panel
  logPanel.appendChild(entry);

  //Auto-scroll to the latest entry
  logPanel.scrollTop = logPanel.scrollHeight;
}

//Callback version
function fetchUserWithCallback(id, onSuccess, onError) {
  log("Fetching user (callback)...", "pending");

  //setTimeout simulates a 1.5 second network delay
  setTimeout(function () {
    if (id > 0) {
      //Success — call the success callback with the fake data
      onSuccess({ id: id, name: "Ada Okonkwo", role: "developer" });
    } else {
      //Failure — call the error callback with a message
      onError("User not found: invalid ID");
    }
  }, 1500);
}

//fetchOrdersWithCallback — called after I have the user
function fetchOrdersWithCallback(userId, onSuccess, onError) {
  log("Fetching orders (callback)...", "pending");

  setTimeout(function () {
    if (userId > 0) {
      onSuccess([
        { orderId: 101, item: "Laptop stand", amount: 15000 },
        { orderId: 102, item: "USB hub", amount: 8500 },
      ]);
    } else {
      onError("Could not load orders");
    }
  }, 1000);
}

//Promise version
function fetchUserWithPromise(id) {
  log("Fetching user (Promise)...", "pending");

  //new Promise takes one function with two arguments:
  //resolve — call this when done successfully
  //reject  — call this when something went wrong
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (id > 0) {
        resolve({ id: id, name: "Ada Okonkwo", role: "developer" });
      } else {
        //Always reject with an Error object, not a plain string
        reject(new Error("User not found: invalid ID"));
      }
    }, 1500);
  });
}

//fetchOrdersWithPromise — returns a Promise
function fetchOrdersWithPromise(userId) {
  log("Fetching orders (Promise)...", "pending");

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (userId > 0) {
        resolve([
          { orderId: 101, item: "Laptop stand", amount: 15000 },
          { orderId: 102, item: "USB hub", amount: 8500 },
        ]);
      } else {
        reject(new Error("Could not load orders"));
      }
    }, 1000);
  });
}

//Event listeners
const btnCallback = document.getElementById("btn-callback");
const btnPromise = document.getElementById("btn-promise");
const btnFail = document.getElementById("btn-fail");
const btnClear = document.getElementById("btn-clear");

//Button: Run with callback
btnCallback.addEventListener("click", function () {
  log("--- Callback demo started ---", "info");

  fetchUserWithCallback(
    1, //the ID to look up
    function (user) {
      //onSuccess
      log("User loaded: " + user.name + " (" + user.role + ")", "success");

      //Now to fetch orders — nested inside the success callback
      fetchOrdersWithCallback(
        user.id,
        function (orders) {
          //onSuccess for orders
          log("Orders loaded: " + orders.length + " orders found", "success");
          orders.forEach(function (order) {
            log(
              "  Order #" +
                order.orderId +
                ": " +
                order.item +
                " — ₦" +
                order.amount,
              "info",
            );
          });
        },
        function (err) {
          //onError for orders
          log("Order error: " + err, "error");
        },
      );
    },
    function (err) {
      //onError for user
      log("User error: " + err, "error");
    },
  );
});

//Button: Run with Promise
btnPromise.addEventListener("click", function () {
  log("--- Promise demo started ---", "info");

  fetchUserWithPromise(1)
    .then(function (user) {
      log("User loaded: " + user.name + " (" + user.role + ")", "success");
      //Return the next Promise so the chain waits for it
      return fetchOrdersWithPromise(user.id);
    })
    .then(function (orders) {
      log("Orders loaded: " + orders.length + " orders found", "success");
      orders.forEach(function (order) {
        log(
          "  Order #" +
            order.orderId +
            ": " +
            order.item +
            " — ₦" +
            order.amount,
          "info",
        );
      });
    })
    .catch(function (error) {
      //.catch() handles rejection from ANY step in the chain
      log("Error: " + error.message, "error");
    })
    .finally(function () {
      //.finally() always runs — success or failure
      log("--- Promise demo finished ---", "info");
    });
});

//Button: Simulate failure
btnFail.addEventListener("click", function () {
  log("--- Failure demo started (Promise) ---", "info");

  fetchUserWithPromise(-1) //-1 triggers the reject() path
    .then(function (user) {
      //This .then() will NOT run because the Promise was rejected
      log("User: " + user.name, "success");
    })
    .catch(function (error) {
      //This runs instead
      log("Caught error: " + error.message, "error");
    })
    .finally(function () {
      log("--- Failure demo finished ---", "info");
    });
});

//Button: Clear log
btnClear.addEventListener("click", function () {
  // innerHTML = '' wipes everything inside the panel
  logPanel.innerHTML =
    '<p class="log-empty">Press a button to see async in action.</p>';
});
