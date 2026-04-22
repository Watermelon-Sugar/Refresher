
// What changed:
//Removed all callback versions (fetchUserWithCallback etc.)
//Removed all .then()/.catch() chains from event listeners
//Each button now calls a named async function
//Each async function uses try/catch/finally for errors

// What stayed exactly the same: The two API simulation functions (fetchUser, fetchOrders), still return Promises, async/await works ON Promises, it does not replace them. The log helper function. The HTML and CSS
//No changes needed here.

const logPanel = document.getElementById('log-panel');

function log(message, type) {
  const emptyMsg = logPanel.querySelector('.log-empty');
  if (emptyMsg) {
    logPanel.removeChild(emptyMsg);
  }

  const now     = new Date();
  const hours   = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeStr = hours + ':' + minutes + ':' + seconds;

  const entry = document.createElement('div');
  entry.className = 'log-entry ' + (type || 'info');
  entry.innerHTML =
    '<span class="log-time">' + timeStr + '</span>' +
    '<span class="log-text">' + message + '</span>';

  logPanel.appendChild(entry);
  logPanel.scrollTop = logPanel.scrollHeight;
}


//These are UNCHANGED
//This is the key point to understand:
//async/await does NOT replace Promises. It is syntax sugar that sits ON TOP of Promises. The functions you await must still return Promises.

function fetchUser(id) {
  log('Fetching user...', 'pending');

  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (id > 0) {
        resolve({ id: id, name: 'Ada Okonkwo', role: 'developer' });
      } else {
        reject(new Error('User not found: invalid ID'));
      }
    }, 1500);
  });
}

function fetchOrders(userId) {
  log('Fetching orders...', 'pending');

  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (userId > 0) {
        resolve([
          { orderId: 101, item: 'Laptop stand', amount: 15000 },
          { orderId: 102, item: 'USB hub',      amount: 8500  }
        ]);
      } else {
        reject(new Error('Could not load orders'));
      }
    }, 1000);
  });
}


//The logic lived inside the event listener callbacks.
//Now each button has its own named async function.

//runAsyncDemo
//Fetches a user, then fetches their orders. It reads like synchronous, top-to-bottom code even though there are two separate async operations happening.

async function runAsyncDemo() {
  log('--- async/await demo started ---', 'info');

  try {
    //await pauses here until fetchUser's Promise resolves.
    //user is the plain object NOT a Promise.
    const user = await fetchUser(1);
    log('User loaded: ' + user.name + ' (' + user.role + ')', 'success');

    //await pauses again until fetchOrders' Promise resolves.
    //We can use user.id directly because we already have it.
    const orders = await fetchOrders(user.id);
    log('Orders loaded: ' + orders.length + ' orders found', 'success');

    //orders is a plain array — loop through it normally
    orders.forEach(function(order) {
      log('  Order #' + order.orderId + ': ' + order.item + ' — ₦' + order.amount, 'info');
    });

  } catch (error) {
    //If either fetchUser OR fetchOrders rejects,
    //execution jumps here immediately.
    log('Error: ' + error.message, 'error');

  } finally {
    //finally always runs, whether try succeeded or catch ran
    log('--- async/await demo finished ---', 'info');
  }
}


//runFailureDemo 
//Same structure as runAsyncDemo, but passes id = -1.
//fetchUser will call reject() which triggers the catch block.
//The orders line never runs because execution jumps to catch.

async function runFailureDemo() {
  log('--- Failure demo started ---', 'info');

  try {
    //-1 triggers reject() inside fetchUser
    const user = await fetchUser(-1);

    //This line is NEVER reached — execution jumped to catch
    log('User: ' + user.name, 'success');

  } catch (error) {
    log('Caught error: ' + error.message, 'error');

  } finally {
    log('--- Failure demo finished ---', 'info');
  }
}


//Section 4: Event listeners
//Each listener now just calls the async function by name.
//All the async logic lives in the function, not in the listener.
//This is the cleanest pattern: keep listeners thin.

const btnAsyncAwait = document.getElementById('btn-promise');   //reusing Day 8 HTML id
const btnFail       = document.getElementById('btn-fail');
const btnClear      = document.getElementById('btn-clear');

//Remove the callback button, no longer need it
const btnCallback = document.getElementById('btn-callback');
if (btnCallback) {
  btnCallback.textContent = 'Run async/await';
  btnCallback.addEventListener('click', runAsyncDemo);
}

btnAsyncAwait.addEventListener('click', runAsyncDemo);

btnFail.addEventListener('click', runFailureDemo);

btnClear.addEventListener('click', function() {
  logPanel.innerHTML = '<p class="log-empty">Press a button to see async in action.</p>';
});