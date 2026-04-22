//What does fetch() do?
//fetch() — the browser's built-in HTTP client. fetch() is a built-in browser function that sends an HTTP request to a URL and returns a Promise. You use it to get data from APIs — weather, country info, user profiles, or anything a server can send back.

//The simplest possible fetch — one line
const response = await fetch('https://api.example.com/users');

//fetch(url) returns a Promise that resolves to a Response object — NOT the data itself yet.
//What is JSON? - APIs send data back in JSON format — it looks almost exactly like a JS object.
//{ "name": "Nigeria", "capital": "Abuja", "population": 218541212 }
//JSON keys are always in double quotes. response.json() converts JSON text into a real JS object.


//Anatomy of a fetch request
//Two await steps — always. Every fetch call has exactly two await steps.Ideally, you would expect one.

async function getData() {
  //Step 1: send the request, wait for headers
  const response = await fetch('https://api.example.com/data');

  //Step 2: wait for body and parse as JSON
  const data = await response.json();

  console.log(data); // plain JS object
}

//Always two awaits: one for fetch(), one for .json(). Never forget the second one.
//The Response object
response.ok     //true if status 200–299, false for 404/500
response.status //the HTTP status code number
response.json() //reads body as JSON (returns a Promise)

//response.ok is the most important one. Always check it before reading the body.

//Reading the response
//Why you must check response.ok 
//fetch() does NOT reject on 404 or 500. It only rejects on network failure.You have to check response.ok manually.

const response = await fetch('https://api.example.com/missing');

if (!response.ok) {
  throw new Error('Request failed: ' + response.status);
}

const data = await response.json();
//Never skip the response.ok check. A 404 silently passing through is one of the most common bugs in fetch code

//Error handling
//Two types of errors
//Network error — no internet, server unreachable. fetch() rejects. Caught by catch automatically.
//HTTP error — server replied with 404, 500 etc. fetch() does NOT reject. Check response.ok and throw manually.

async function getCountry(name) {
  try {
    const response = await fetch('https://restcountries.com/v3.1/name/' + name);

    if (!response.ok) {
      throw new Error('Not found (' + response.status + ')');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.log('Failed:', error.message);
  }
}
//The throw inside if (!response.ok) converts an HTTP error into a JS error, so your catch block handles both cases with one handler.

//The full pattern
//The complete fetch pattern — memorise this. Every fetch call you write follows this skeleton. Only the URL and what you do with data changes.

async function fetchData(url) {
  try {
    //1. Send the request
    const response = await fetch(url);

    //2. Check for HTTP errors
    if (!response.ok) {
      throw new Error('HTTP error: ' + response.status);
    }

    //3. Parse the JSON
    const data = await response.json();

    //4. Use the data
    return data;

  } catch (error) {
    //5. Handle any failure
    console.log('Error:', error.message);
  }
}
//Steps 1–3 never change. Steps 4–5 are your specific app logic. Write this skeleton first, then fill it in.