/**
 * example #1 my own for to foreach
*/

const arr = [1, 2, 3, 4, 5];

/* for (let i = 0; i < arr.length; i++) {
  console.log(arr[i] * 10);
}; */

arr.forEach((value) => { console.log(value * 10) });

/**
 * example #2 async in foreach does not work
*/
const results = [5, 4, 8, 7];
let sum = 0;

const sumFunction = async (a, b) => a + b;

results.forEach(async (result) => {
  sum = await sumFunction(sum, result);
});

const avg = sum / results.length;
console.log("avg: " + avg);
