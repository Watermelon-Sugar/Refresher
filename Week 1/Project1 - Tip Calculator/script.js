//State 
let billAmount = 0; //the bill amount entered by the user
let tipPercentage = 15; //selected tip % (default is 15%)
let numberOfPeople = 1; //the number of people to split the bill with
let roundedTip = false //whether to round the tip amount to the nearest whole number
let isCustom = false; //whether the user has selected the custom tip option

//DOM Elements

const billInput = document.getElementById('bill-input');
const customRow = document.getElementById('custom-row');
const customInput = document.getElementById('custom-input');
const splitMinus = document.getElementById('split-minus');
const splitPlus = document.getElementById('split-plus');
const splitCount = document.getElementById('split-count');
const splitLabel = document.getElementById('split-label');
const roundToggle = document.getElementById('round-toggle');
const presetButtons = document.querySelectorAll('.preset-btn');

const resultTip = document.getElementById('tip-value');
const resultTotal = document.getElementById('total-value');
const resultPerPerson = document.getElementById('per-person-item');
const valuePerPerson = document.getElementById('value-per-person');

//Calculation function: take only numbers

function calculate(bill, tipPercent, people, round) {
    const tip = bill * (tipPercent / 100);
    let total = bill + tip;

    if (round) {
        total = Math.ceil(total); //rounds total up to nearest whole naira
    }
    const perPerson = total / people;
    return {
        tip: tip,
        total: total,
        perPerson: perPerson
    }
}


//Render function: update the UI with calculated values

function render() {
    //updates the split label: person vs people
    splitCount.textContent = numberOfPeople;
    splitLabel.textContent = numberOfPeople === 1 ? 'person' : 'people';

    //Disable the minus button if there's only one person
    splitMinus.disabled = numberOfPeople <= 1;

    //Hide 'per person' section if there's only one person

    if (numberOfPeople === 1) {
        resultPerPerson.style.visibility = 'hidden';
    } else {
        resultPerPerson.style.visibility = 'visible';
    }

    //If bill amount is zero or negative, show dashes - not 0 or NaN
    if (billAmount <= 0) {
        resultTip.textContent = '-';
        resultTotal.textContent = '-';
        valuePerPerson.textContent = '-';
        return; //exit early since we can't calculate with invalid bill amount
    }

    //Run the calculation with current state values
    const result = calculate(billAmount, tipPercentage, numberOfPeople, roundedTip);

    //Update the UI with formatted results
    resultTip.textContent = `₦${result.tip.toFixed(2)}`;
    resultTotal.textContent = `₦${result.total.toFixed(2)}`;
    valuePerPerson.textContent = `₦${result.perPerson.toFixed(2)}`;
}

//Event Listeners - Bill input

billInput.addEventListener("input", function () {
    //parseFloat converts the input string to a number. If the input is empty or invalid, it returns NaN, so we use || 0 to default to 0 in those cases.
    billAmount = parseFloat(billInput.value) || 0;
    render();
});

//Event Listeners - Tip percentage buttons
presetButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        //remove active class from all buttons
        presetButtons.forEach(function (btn) {
            btn.classList.remove('active');
        });
        //add active class to the clicked button
        button.classList.add('active');

        if (button.dataset.tip === 'custom') {
            //show the custom input row
            isCustom = true;
            customRow.classList.add('visible');
            tipPercentage = parseFloat(customInput.value) || 0; //set tip percentage to custom input value or 0 if invalid
        } else {
//hide the custom input row, use preset tip
            isCustom = false;
            customRow.classList.remove('visible');
            tipPercentage = parseFloat(button.dataset.tip) || 0;
        }   
        render();
    });
});

//Event - Custom tip input
customInput.addEventListener("input", function () {
    if (isCustom) {
        tipPercentage = parseFloat(customInput.value) || 0;
        render();
    }
});

//Event - Split buttons
splitMinus.addEventListener("click", function () {
    if (numberOfPeople > 1) {
        numberOfPeople = numberOfPeople - 1;
        render();
    }
});

splitPlus.addEventListener("click", function () {
    numberOfPeople = numberOfPeople + 1;
    render();
});

//Event - Round toggle
roundToggle.addEventListener("click", function () {
    //flip the boolean value of roundedTip. If it was true, it becomes false; if it was false, it becomes true.
    roundedTip = !roundedTip; //toggle the boolean value

//update the toggle button's appearance based on the new state
    if (roundedTip) {
        roundToggle.classList.add('on');
    } else {
        roundToggle.classList.remove('on'); 
    }   
    render();
}); 

//Initial render to set default values on page load
render();
