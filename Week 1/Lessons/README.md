**Day 1**
Variables
Use const by default. Switch to let only when the value needs to change. Never use var

Data types
string, number, boolean, null, undefined, object, array. Check with typeof. Always use === not ==.

**Day 2**
Functions
Named block of reusable code. Parameters are inputs, return sends the result back. No return = undefined.

Arrow functions
Shorter syntax for functions. Single-expression bodies can drop {} and return — the result is returned automatically.

**Day 3**
.map()
Transform every item → new array of same length. Original untouched. Use when you want to change each item into something else.

.filter()
Keep only items where the test returns true → shorter array. Original untouched. Use when you want to remove items.

.reduce()
Crunch an array into one value. Has an accumulator (running result) and a starting value. Use for totals, counts, max.

**Day 4**
if / else
Runs code only when a condition is true. Chain with else if. JS stops at the first true condition.

switch
Matches one variable against exact values. Cleaner than many else ifs. Always include break and default.

for / forEach
Use for when you need an index or early exit. Use forEach when you just want to visit every item.

**Day 5**
DOM basics
getElementById finds an element. .textContent sets text. .innerHTML sets HTML. addEventListener listens for clicks.

**Day 6**
Debugging rules
Use === not = in conditions. Always return values. Check const vs let. Read error messages — they name the line.