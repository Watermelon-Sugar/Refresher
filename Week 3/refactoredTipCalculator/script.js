//Closure: state manager

function createTipCalculator() {
  //Private state
  let state = {
    billAmount: 0,
    tipPercentage: 15,
    numberOfPeople: 1,
    roundedTip: false,
  };

  //Destructuring
  function calculate({
    billAmount,
    tipPercentage,
    numberOfPeople,
    roundedTip,
  }) {
    let tip = billAmount * (tipPercentage / 100);

    if (roundedTip) {
      tip = Math.ceil(tip);
    }

    const total = billAmount + tip;
    const perPerson = numberOfPeople > 0 ? total / numberOfPeople : 0;

    return {
      tip,
      total,
      perPerson,
    };
  }

  //The Closure
  return {
    updateState: (newState) => {
      state = { ...state, ...newState };
      return state;
    },
    getState: () => ({ ...state }), //return a copy for stafety
    getResults: () => calculate(state),
  };
}

const calculator = createTipCalculator();

// Currency formatter (Nigeria)
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value);

//DOM Elements
const billInput = document.getElementById("bill-input");
const customRow = document.getElementById("custom-row");
const customInput = document.getElementById("custom-input");
const splitMinus = document.getElementById("split-minus");
const splitPlus = document.getElementById("split-plus");
const splitCount = document.getElementById("split-count");
const splitLabel = document.getElementById("split-label");
const roundToggle = document.getElementById("round-toggle");
const presetButtons = document.querySelectorAll(".preset-btn");

const resultTip = document.getElementById("tip-value");
const resultTotal = document.getElementById("total-value");
const resultPerPerson = document.getElementById("per-person-item");
const valuePerPerson = document.getElementById("value-per-person");

//Render
function render() {
  const state = calculator.getState();
  const { tip, total, perPerson } = calculator.getResults();

  const { billAmount, numberOfPeople } = state;

  //Update SPlit UI
  splitCount.textContent = numberOfPeople;
  splitLabel.textContent = numberOfPeople === 1 ? "person" : "people";
  splitMinus.disabled = numberOfPeople <= 1;
  resultPerPerson.style.visibility =
    numberOfPeople === 1 ? "hidden" : "visible";

  //Update Total
  if (billAmount <= 0) {
    [resultTip, resultTotal, valuePerPerson].forEach(
      (el) => (el.textContent = "-"),
    );
    return;
  }

  resultTip.textContent = formatCurrency(tip);
  resultTotal.textContent = formatCurrency(total);
  valuePerPerson.textContent = formatCurrency(perPerson);
}

//Event Listeners
billInput.addEventListener("input", (e) => {
  calculator.updateState({
    billAmount: parseFloat(e.target.value) || 0,
  });
  render();
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    presetButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const isCustom = button.dataset.tip === "custom";

    customRow.classList.toggle("visible", isCustom);

    if (!isCustom) {
      calculator.updateState({
        tipPercentage: parseFloat(button.dataset.tip) || 0,
      });
    }

    render();
  });
});

customInput.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value) || 0;

  if (customRow.classList.contains("visible")) {
    calculator.updateState({ tipPercentage: value });
    render();
  }
});

splitPlus.addEventListener("click", () => {
  const { numberOfPeople } = calculator.getState();
  calculator.updateState({ numberOfPeople: numberOfPeople + 1 });
  render();
});

splitMinus.addEventListener("click", () => {
  const { numberOfPeople } = calculator.getState();
  if (numberOfPeople > 1) {
    calculator.updateState({ numberOfPeople: numberOfPeople - 1 });
    render();
  }
});

roundToggle.addEventListener("click", () => {
  const { roundedTip } = calculator.getState();
  const nextValue = !roundedTip;

  calculator.updateState({ roundedTip: nextValue });

  roundToggle.classList.toggle("on", nextValue);
  roundToggle.setAttribute("aria-pressed", nextValue);

  render();
});

//Initial render
render();
