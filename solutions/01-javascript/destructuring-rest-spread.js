/**
 * @challenge #1
 * Task: Refactor this function using destructuring and spread/rest
 */
/* 
function processUser(user) {
    const name = user.name;
    const email = user.email;
    const age = user.age;
    const otherProps = {};
    for (let key in user) {
        if (key !== 'name' && key !== 'email' && key !== 'age') {
            otherProps[key] = user[key];
        }
    }
    return {
        name: name,
        email: email,
        age: age,
        rest: otherProps
    };
}
*/

/**
 * @challenge #2
 * Task: Also: merge these arrays removing duplicates
 */
/* 
const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5]; 
*/

/**
 * @solution #1
 */
function processUser({ name, email, age, ...otherProps }) {
    return {
        name,
        email,
        age,
        rest: otherProps
    };
}

const userA = {
    name: "Alejandro",
    email: "a@me.com",
    age: "25",
    married: true,
}

console.log(processUser(userA));

/**
 * @solution #2
 */

const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5];

const newArray = [...new Set([...arr1, ...arr2])];
console.log(newArray);

/**
 * @challenge #3 comment what each one is doing
 * @solution #3
 */
const arr = [1, 2, 3];
const copy = [...arr]; // this is spread, it uses expanding the elements into the individuals values into a new array

function sum(...numbers) { // this is rest it is collecting all params in an array called numbers
  return numbers.reduce((a, b) => a + b);
}
