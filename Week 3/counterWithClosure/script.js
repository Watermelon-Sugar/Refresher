// makeCounter() returns an object of three functions.
// All three functions share ONE closure — the same `count`
// variable. That variable is private: nothing outside
// makeCounter() can read or change it directly.
//
// This is a closure applied to a real UI problem.

function makeCounter(start) {
    let count = start;

    return {
        increment: function () {
            count = count + 1;
            return count;
        },

        decrement: function () {
            count = count - 1;
            return count;
        },
        
        reset: function () {
            count = start; //always resets to the original start value
            return count;
        },

        getCount: function () {
            return count;
        }
    };
}

//2 independent counters
const counterA = makeCounter(0); //starts at 0
const counterB = makeCounter(10); //starts at 10


//Expose them on window so you can test in the browser console:
//Try: counterA.getCount() - works fine
//Try: counterA.count - undefined (it's private!)
window.counterA = counterA;
window.counterB = counterB;

//DOM references
const displayA = document.getElementById('display-a');
const displayB = document.getElementById('display-b');
const logA = document.getElementById('log-a');
const logB = document.getElementById('log-b');

// Reads the current count, updates the screen, and applies the right CSS colour class (positive / negative / neutral). Called after every button click.

function updateDisplay(counter, displayEl, logEl) {
    const value = counter.getCount();

    //Update the number
    displayEl.textContent = value;

    displayEl.classList.remove('positive', 'negative');
    if (value > 0) displayEl.classList.add('positive');
    if (value < 0) displayEl.classList.add('negative');

    logEl.textContent = 'current count (via getCount): ' + value;
}

//Event listener - Counter A
document.getElementById('inc-a').addEventListener('click', function () {
    counterA.increment();
    updateDisplay(counterA, displayA, logA);
});

document.getElementById('dec-a').addEventListener('click', function () {
    counterA.decrement();
    updateDisplay(counterA, displayA, logA);

});

document.getElementById('reset-a').addEventListener('click', function () {
    counterA.reset();
        updateDisplay(counterA, displayA, logA);

})
 
//Event listener - Counter B
document.getElementById('inc-b').addEventListener('click', function () {
    counterB.increment();
    updateDisplay(counterB, displayB, logB);
});

document.getElementById('dec-b').addEventListener('click', function () {
    counterB.decrement();
    updateDisplay(counterB, displayB, logB);

});

document.getElementById('reset-b').addEventListener('click', function () {
    counterB.reset();
    updateDisplay(counterB, displayB, logB);

});

//Initial render
updateDisplay(counterA, displayA, logA);
updateDisplay(counterB, displayB, logB);