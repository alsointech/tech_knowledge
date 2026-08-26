// Q2: Destructuring & Spread/Rest Operators
// Score: 7/10

// ── FINAL SOLUTION ──────────────────────────────────────────────

// REST operator in function parameter — collects remaining props into object
function processUser({ name, email, age, ...rest }) {
  return {
    fullName: name,
    contact: email,
    years: age,
    metadata: rest
  };
}

console.log(processUser({
  name: "Alejo",
  email: "mail@me.com",
  age: 31,
  iq: 100
}));
// { fullName: 'Alejo', contact: 'mail@me.com', years: 31, metadata: { iq: 100 } }

// SPREAD operator — expands each array element into a new array, then dedup via Set
const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5];

const newArr = [...new Set([...arr1, ...arr2])];
console.log(newArr); // [1, 2, 3, 4, 5]

// ── DISCARDED APPROACHES ────────────────────────────────────────

// Original verbose version (no destructuring, manual rest with for...in)
// function processUser(user) {
//   const name = user.name;
//   const email = user.email;
//   const age = user.age;
//   const rest = {};
//   for (let key in user) {
//     if (key !== 'name' && key !== 'email' && key !== 'age') {
//       rest[key] = user[key];
//     }
//   }
//   return { fullName: name, contact: email, years: age, metadata: rest };
// }

// Merge without dedup (spread only)
// const newArr = [...arr1, ...arr2]; // [1, 2, 3, 3, 4, 5]

// Merge with filter instead of Set
// const newArr = [...arr1, ...arr2].filter((v, i, arr) => arr.indexOf(v) === i);
