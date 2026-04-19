//Dataset
//This is our "database" — an array of product objects.

const products = [
  { name: "Sourdough Bread", category: "food", price: 4.5 },
  { name: "Cheddar cheese", category: "food", price: 6.0 },
  { name: "Chicken breast", category: "food", price: 9.0 },
  { name: "Orange juice", category: "drink", price: 2.5 },
  { name: "Sparkling water", category: "drink", price: 1.2 },
  { name: "Oat milk", category: "drink", price: 3.0 },
  { name: "Granola bar", category: "snack", price: 1.8 },
  { name: "Mixed nuts", category: "snack", price: 3.5 },
  { name: "Rice cakes", category: "snack", price: 2.2 },
];

//Step 1: Filter
//Keep only the products that match the selected category.
//If "all" is selected, keep everything.

function getFilteredProducts(category) {
  if (category === "all") {
    return products; // Return the original array if "all" is selected. no filtering needed.
  }
  return products.filter(function (product) {
    return product.category === category; // Keep only products that match the selected category.
  });
}

//Step 2: Sort
//Sort the filtered list by name or price.
//.sort() takes a comparison function that returns a number.

function getSortedProducts(list, sorOrder) {
  //.slice() makes a copy first so we don't mutate the original array.
  const copy = list.slice();

  if (sorOrder === "name") {
    copy.sort(function (a, b) {
      return a.name.localeCompare(b.name); // alphabetical.
    });
  } else if (sorOrder === "price-asc") {
    copy.sort(function (a, b) {
      return a.price - b.price; // low to high.
    });
  } else if (sorOrder === "price-desc") {
    copy.sort(function (a, b) {
      return b.price - a.price; // high to low.
    });
  }
  return copy; // Return the sorted copy of the list.
}

//Step 3: Map → HTML strings
//Turn each product object into an HTML string.
//.map() gives us an array of strings, then .join("") glues them.

function buildListHTML(list) {
  if (list.length === 0) {
    return '<li class="empty">No products found.</li>';
  }
  const htmlItems = list.map(function (product) {
    return `
        <li class="product">
        <div class="product-left">
        <span class="product-name">${product.name}</span>
        <span class="product-category">${product.category}</span>
        </div>
        <span class="product-price">$${product.price.toFixed(2)}</span>
        </li>
        `;
  });
  return htmlItems.join("");
}

//Step 4: Reduce -> summary stats
//Crunch the filtered list into a single summary object.
//We build { count, total } in one pass using reduce.

function buildSummary(list) {
  const summary = list.reduce(
    function (acc, product) {
      acc.count = acc.count + 1; // Add 1 to the count for each product.
      acc.total = acc.total + product.price; // Add the price of each product to the total.
      return acc;
    },
    { count: 0, total: 0 },
  );
  return summary;
}

//Render: put it all together
//Called every time a dropdown changes.

function render() {
  //Read the current dropdown values.
  const category = document.getElementById("category-filter").value;
  const sortOrder = document.getElementById("sort-order").value;

  //Run the pipeline: filter → sort → map → render
  const filtered = getFilteredProducts(category);
  const sorted = getSortedProducts(filtered, sortOrder);
  const listHtml = buildListHTML(sorted);

  const summary = buildSummary(filtered);

  //Update the DOM
  document.getElementById("product-list").innerHTML = listHtml;
  document.getElementById("summary").innerHTML = `
    Showing <span>${summary.count}</span> item${summary.count !== 1 ? "s" : ""} 
    &nbsp;·&nbsp;
    Total: <span>$${summary.total.toFixed(2)}</span>`;
}

//Event listeners
//Re-render whenever a dropdown changes.

document.getElementById("category-filter").addEventListener("change", render);
document.getElementById("sort-order").addEventListener("change", render);

//Run once on page load to show the initial list.
render();
