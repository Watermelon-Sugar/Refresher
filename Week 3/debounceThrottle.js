//The problem — some events fire hundreds of times per second. Keyboard input, mouse movement, window resize, and scroll all fire extremely rapidly. If you run expensive code (an API call, a DOM update, a calculation) on every single event, you'll hammer the browser and the server.

//Without any control — this fires on EVERY keystroke
searchInput.addEventListener('input', function() {
  fetch('/api/search?q=' + searchInput.value); // fires 40+ times
});

//User types "javascript" = 10 letters = 10 API calls
//Most of them are wasted — only the last result matters
//This is a real performance problem. A fast typist can fire 10+ keystrokes per second. Multiply that by every user on your site and you'll overload your API very quickly.

//Two solutions — different strategies
//Debounce: Wait until the user stops doing the thing. Reset the timer on every event. Only fire once the silence lasts long enough. Like an elevator door — keeps waiting as long as people keep pressing the button.

//Throttle: Allow the function to fire, but no more than once per interval. Extra calls during the interval are silently skipped. Like a turnstile — lets one person through, then locks for a moment before allowing the next.

//Debounce — wait for silence. Every time the event fires, start a timer. If the event fires again before the timer runs out, restart the timer. Only run the function when the timer finally completes without interruption.

//User typing "hi" — each keystroke resets the 300ms timer:

//keystroke "h" — timer starts (300ms)
//keystroke "i" — timer RESETS (300ms again)
//...silence for 300ms...
//function finally runs — with "hi"
//No matter how fast you type, the function only runs once — after you stop.

//How it works step by step
//1. debounce wraps your function and returns a new one
//2. The new function holds a timer variable in its closure
//3. Every call: cancel the previous timer with clearTimeout
//4. Set a new timer. If it runs out without being cancelled — fire the original function
function debounce(fn, delay) {
  let timer;  //lives in closure — shared across all calls

  return function(...args) {
    clearTimeout(timer);   //cancel any previous timer

    timer = setTimeout(function() {
      fn(...args);           //finally run after delay ms of silence
    }, delay);
  };
}

//Usage
const debouncedSearch = debounce(function(query) {
  console.log('Searching for: ' + query);
}, 300);

searchInput.addEventListener('input', function() {
  debouncedSearch(searchInput.value);
});

//timer lives in the closure — that's why it persists between calls and can be cancelled by the next call.

//...args passes any arguments through to the original function unchanged. This is a direct application of closures. timer is a private variable shared across all invocations of the returned function.

//Throttle — allow at most once per interval. The first call fires immediately. Any calls during the cooldown period are dropped. After the interval passes, the next call goes through again.

//Scroll events with 200ms throttle:

//scroll event — runs (cooldown starts)
//scroll event — skipped (still in cooldown)
//scroll event — skipped (still in cooldown)
//...200ms passes — cooldown ends...
//scroll event — runs again

//Unlike debounce, throttle fires at regular intervals even during continuous activity.
//How it works step by step
//1. throttle wraps your function and returns a new one
//2. The new function holds an isOnCooldown flag in its closure
//3. If isOnCooldown is true — do nothing, return early
//4. If false — run the function, set flag to true, set timer to reset flag after delay
function throttle(fn, interval) { //throttle() is factory that builds the throttle function. fn is the actual task. interval is how long to wait before allowing task to run
  let isOnCooldown = false; //lives in closure. acts as a permanent on/off switch

  return function(...args) { //the action. this is the bouncer
    if (isOnCooldown) { //the check. if switch is false, bouncer lets you in and actual code runs
      return; //still in cooldown — skip this call
    }

    fn(...args);           //run the function
    isOnCooldown = true;   //start cooldown. this is the lock, the bouncer immediately flips the switch to true and the gate is now locked

    setTimeout(function() { //starts a stopwatch. when interval is up, code inside the timer runs, flipping isOnCooldown back to false. the gate is now open for the next person.
      isOnCooldown = false; //cooldown over — ready again
    }, interval);
  };
}

//isOnCooldown - The "Gatekeeper" variable.
//if (isOnCooldown)Checks if we are currently in a waiting period.
//fn(...args)The actual work we are trying to perform.
//setTimeoutThe "Reset Button" that unlocks the gate after a delay.

//Usage
const throttledScroll = throttle(function() {
  console.log('Scroll position: ' + window.scrollY);
}, 200);

window.addEventListener('scroll', throttledScroll);

//Both implementations. Notice the structural similarity — both are factory functions that return a new function and use closure to hold state. The difference is the state they hold and what they do with it.

//Debounce
function debounce(fn, delay) {
  let timer;

  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
//State: a timer ID
//On call: cancel + restart timer
//Fires: after silence

//Throttle
function throttle(fn, interval) {
  let isOnCooldown = false;

  return function(...args) {
    if (isOnCooldown) return;
    fn(...args);
    isOnCooldown = true;
    setTimeout(() => {
      isOnCooldown = false;
    }, interval);
  };
}
//State: a boolean flag
//On call: check flag, skip if true
//Fires: at most once per interval

//Both functions are pure closures — the state lives in the closure, the returned function reads and updates it. This is closures applied to a real performance problem.

//When to use which
//Debounce — use when you only care about the final value
//-Search inputs — fetch after the user finishes typing, not on every keystroke
//-Window resize — recalculate layout after resizing stops, not 60 times per second
//-Form validation — validate after the user pauses, not mid-word
//-Auto-save — save a draft after typing stops, not on every character

//Throttle — use when you need regular updates during continuous activity
//-Scroll events — update a progress bar or sticky header at most 10 times/sec
//-Mouse move — track cursor position for a tooltip or drag without every pixel
//-Button clicks — prevent double-submitting a form by throttling the submit handler
//-Game input — fire a weapon at most once per 500ms regardless of button mashing

//The one - line test to pick the right one
//Ask yourself: "Do I want the function to fire while the event is still happening?"

//Yes - throttle (fires during activity, just less often)
//No  - debounce (waits until activity stops)

//Scroll position update while scrolling?  - throttle
//Search after user stops typing?          - debounce
//Live mouse tracking for a canvas?        - throttle
//Window resize layout recalculation?      - debounce