# Technical Interview Questions - Semi Senior Fullstack Developer
## Node.js | JavaScript | TypeScript | React | AWS

---

# SECTION 1: JavaScript & TypeScript Fundamentals

---
  
## 1.1 ES6+ Features

### Question 1: Variable Declarations
**Question:** Explain the differences between `var`, `let`, and `const`. What is hoisting, and how does it affect each declaration type? How are function declarations hoisted compared to function expressions and arrow functions?

**Expected Answer:**
- `var`: Function-scoped, hoisted (initialized as `undefined`), can be redeclared
- `let`: Block-scoped, hoisted but not initialized (Temporal Dead Zone), cannot be redeclared
- `const`: Block-scoped, hoisted but not initialized (TDZ), cannot be reassigned (but objects/arrays can be mutated)
- Hoisting moves declarations to the top of their scope during compilation
- Function declarations are hoisted **with their body**, so they can be called before they appear
- Function expressions and arrow functions follow their variable's rules: with `var` the name is `undefined` (calling it gives `TypeError: ... is not a function`); with `let`/`const` it's in the TDZ (`ReferenceError`)
- `class` declarations are hoisted like `let` (TDZ)

**Code Challenge:**
```javascript
// Predict the output and explain why:
console.log(a); // ?
console.log(b); // ?
var a = 1;
let b = 2;

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}

// Also predict:
sayHi();  // ?
sayBye(); // ?
function sayHi() { console.log('hi'); }
var sayBye = function () { console.log('bye'); };
```

**Expected Output & Explanation:**
```javascript
// console.log(a) → undefined (var is hoisted and initialized as undefined)
// console.log(b) → ReferenceError (let is in TDZ)
// First loop: 3, 3, 3 (var is function-scoped, same reference)
// Second loop: 0, 1, 2 (let creates new binding per iteration)
// sayHi()  → 'hi' (function declaration hoisted with its body)
// sayBye() → TypeError: sayBye is not a function (var hoisted as undefined)
```

**Evaluation Criteria:**
- Understanding of scope (block vs function)
- Knowledge of Temporal Dead Zone
- Practical implications in loops with closures
- Distinguishes declaration hoisting from expression/arrow hoisting

---

### Question 2: Destructuring & Spread/Rest Operators
**Question:** Explain destructuring assignment and the spread/rest operators. How do they differ, and when would you use each?

**Expected Answer:**
- Destructuring: Extracts values from arrays/objects into distinct variables
- Spread (`...`): Expands iterables into individual elements (used in function calls, array/object literals)
- Rest (`...`): Collects multiple elements into an array (used in function parameters, destructuring)
- Same syntax, different context determines behavior

**Code Challenge:**
```javascript
// Task: Refactor this function using destructuring and spread/rest
function processUser(user) {
  const name = user.name;
  const email = user.email;
  const age = user.age;
  const rest = {};
  for (let key in user) {
    if (key !== 'name' && key !== 'email' && key !== 'age') {
      rest[key] = user[key];
    }
  }
  return {
    fullName: name,
    contact: email,
    years: age,
    metadata: rest
  };
}

// Also: merge these arrays removing duplicates
const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5];
```

**Expected Solution:**
```javascript
function processUser({ name, email, age, ...rest }) {
  return {
    fullName: name,
    contact: email,
    years: age,
    metadata: rest
  };
}

// Merge arrays removing duplicates
const merged = [...new Set([...arr1, ...arr2])]; // [1, 2, 3, 4, 5]
```

---

### Question 3: Template Literals & Tagged Templates
**Question:** What are template literals and tagged templates? Provide a practical use case for tagged templates.

**Expected Answer:**
- Template literals: String literals with embedded expressions using backticks and `${}`
- Tagged templates: Function that processes template literal parts
- Use cases: i18n, sanitization, CSS-in-JS, SQL query builders

**Code Challenge:**
```javascript
// Create a tagged template function that sanitizes HTML to prevent XSS
const userInput = '<script>alert("hacked")</script>';
const html = sanitize`<div>User said: ${userInput}</div>`;
// Should output: <div>User said: &lt;script&gt;alert("hacked")&lt;/script&gt;</div>
```

**Expected Solution:**
```javascript
function sanitize(strings, ...values) {
  const escapeHTML = (str) => 
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined ? escapeHTML(values[i]) : '';
    return result + str + value;
  }, '');
}
```

---

## 1.2 Arrays & Strings

### Question 4: Array Methods
**Question:** Explain the differences between `forEach()`, `map()`, `filter()`, `reduce()`, and `find()`. When would you use each one?

**Expected Answer:**
- `forEach()`: Iterates, no return value, side effects only
- `map()`: Transforms each element, returns new array of same length
- `filter()`: Returns new array with elements passing test
- `reduce()`: Accumulates values into single result
- `find()`: Returns first element matching condition (or undefined)

**Code Challenge:**
```javascript
const transactions = [
  { id: 1, type: 'credit', amount: 100, category: 'salary' },
  { id: 2, type: 'debit', amount: 50, category: 'food' },
  { id: 3, type: 'credit', amount: 200, category: 'freelance' },
  { id: 4, type: 'debit', amount: 30, category: 'transport' },
  { id: 5, type: 'debit', amount: 100, category: 'food' }
];

// Task 1: Get total balance (credits positive, debits negative)
// Task 2: Get array of all unique categories
// Task 3: Get all food expenses as formatted strings ["$50", "$100"]
// Task 4: Find the first transaction over $150
// Task 5: Group transactions by type { credit: [...], debit: [...] }
```

**Expected Solution:**
```javascript
// Task 1: Total balance
const balance = transactions.reduce((acc, t) => 
  t.type === 'credit' ? acc + t.amount : acc - t.amount, 0
); // 120

// Task 2: Unique categories
const categories = [...new Set(transactions.map(t => t.category))];
// ['salary', 'food', 'freelance', 'transport']

// Task 3: Food expenses formatted
const foodExpenses = transactions
  .filter(t => t.category === 'food')
  .map(t => `$${t.amount}`); // ['$50', '$100']

// Task 4: First over $150
const largeTransaction = transactions.find(t => t.amount > 150);
// { id: 3, type: 'credit', amount: 200, category: 'freelance' }

// Task 5: Group by type
const grouped = transactions.reduce((acc, t) => {
  acc[t.type] = acc[t.type] || [];
  acc[t.type].push(t);
  return acc;
}, {});
```

---

### Question 5: Array Manipulation
**Question:** What's the difference between mutating and non-mutating array methods? Give examples of each.

**Expected Answer:**
- **Mutating:** `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`
- **Non-mutating:** `map`, `filter`, `reduce`, `slice`, `concat`, `flat`, `flatMap`, `toSorted`, `toReversed`, `toSpliced`
- Importance: Immutability in React state, functional programming, avoiding side effects

**Code Challenge:**
```javascript
// Implement these operations WITHOUT mutating the original array:
const original = [3, 1, 4, 1, 5, 9, 2, 6];

// 1. Remove element at index 2
// 2. Insert 'x' at index 3
// 3. Sort in descending order
// 4. Reverse the array
// 5. Replace element at index 1 with 'replaced'
```

**Expected Solution:**
```javascript
const original = [3, 1, 4, 1, 5, 9, 2, 6];

// 1. Remove at index 2
const removed = [...original.slice(0, 2), ...original.slice(3)];
// or: original.filter((_, i) => i !== 2)
// or (ES2023): original.toSpliced(2, 1)

// 2. Insert at index 3
const inserted = [...original.slice(0, 3), 'x', ...original.slice(3)];
// or (ES2023): original.toSpliced(3, 0, 'x')

// 3. Sort descending (non-mutating)
const sorted = [...original].sort((a, b) => b - a);
// or (ES2023): original.toSorted((a, b) => b - a)

// 4. Reverse
const reversed = [...original].reverse();
// or (ES2023): original.toReversed()

// 5. Replace at index 1
const replaced = original.map((el, i) => i === 1 ? 'replaced' : el);
// or: [...original.slice(0, 1), 'replaced', ...original.slice(2)]
// or (ES2023): original.with(1, 'replaced')
```

---

### Question 6: String Methods
**Question:** Given a string, demonstrate various string manipulation techniques including searching, splitting, and transformation.

**Code Challenge:**
```javascript
const text = "  Hello World! Welcome to JavaScript Programming.  ";

// Perform the following:
// 1. Trim whitespace and convert to lowercase
// 2. Check if it contains "javascript" (case-insensitive)
// 3. Replace all spaces with underscores
// 4. Split into array of words (no empty strings)
// 5. Get the substring between "Welcome" and "Programming"
// 6. Pad the string "42" to be 5 characters with leading zeros
```

**Expected Solution:**
```javascript
const text = "  Hello World! Welcome to JavaScript Programming.  ";

// 1. Trim and lowercase
const cleaned = text.trim().toLowerCase();
// "hello world! welcome to javascript programming."

// 2. Contains check (case-insensitive)
const hasJS = text.toLowerCase().includes('javascript'); // true
// or: /javascript/i.test(text)

// 3. Replace spaces
const underscored = text.trim().replace(/\s+/g, '_');
// "Hello_World!_Welcome_to_JavaScript_Programming."

// 4. Split into words
const words = text.trim().split(/\s+/);
// ["Hello", "World!", "Welcome", "to", "JavaScript", "Programming."]

// 5. Substring between
const between = text.substring(
  text.indexOf('Welcome') + 'Welcome'.length,
  text.indexOf('Programming')
).trim();
// "to JavaScript"
// or using regex: text.match(/Welcome(.+?)Programming/)?.[1].trim()

// 6. Pad with zeros
const padded = "42".padStart(5, '0'); // "00042"
```

---

## 1.3 Object Manipulation

### Question 7: Object Methods & Iteration
**Question:** What are the different ways to iterate over object properties? Explain `Object.keys()`, `Object.values()`, `Object.entries()`, and `for...in`.

**Expected Answer:**
- `Object.keys()`: Returns array of own enumerable property names
- `Object.values()`: Returns array of own enumerable property values
- `Object.entries()`: Returns array of own enumerable [key, value] pairs
- `for...in`: Iterates over all enumerable properties including inherited
- `hasOwnProperty()` or `Object.hasOwn()` to filter inherited properties

**Code Challenge:**
```javascript
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

// 1. Create a shallow copy
// 2. Create a deep copy
// 3. Merge with another object { phone: '123', age: 31 }
// 4. Pick only 'name' and 'email' properties
// 5. Omit 'age' property
// 6. Check if objects are equal (deep comparison)
```

**Expected Solution:**
```javascript
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  address: { city: 'New York', country: 'USA' }
};

// 1. Shallow copy
const shallow1 = { ...user };
const shallow2 = Object.assign({}, user);

// 2. Deep copy
const deep1 = JSON.parse(JSON.stringify(user)); // loses functions, dates
const deep2 = structuredClone(user); // modern, better

// 3. Merge (later properties override)
const merged = { ...user, phone: '123', age: 31 };

// 4. Pick properties
const pick = (obj, keys) => 
  keys.reduce((acc, key) => (key in obj && (acc[key] = obj[key]), acc), {});
const picked = pick(user, ['name', 'email']);
// or: const { name, email } = user; const picked = { name, email };

// 5. Omit properties
const omit = (obj, keys) => 
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
const omitted = omit(user, ['age']);
// or: const { age, ...omitted } = user;

// 6. Deep equality
const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
};
```

---

### Question 8: Object Descriptors & Immutability
**Question:** How can you make an object immutable in JavaScript? Explain `Object.freeze()`, `Object.seal()`, and property descriptors.

**Expected Answer:**
- `Object.freeze()`: No add/remove/modify properties (shallow)
- `Object.seal()`: No add/remove, but can modify existing values
- `Object.preventExtensions()`: No add, but can modify/delete
- Property descriptors: `writable`, `configurable`, `enumerable`
- All are shallow - nested objects remain mutable

**Code Challenge:**
```javascript
// 1. Create a deep freeze function
// 2. Create an object with a read-only 'id' and hidden 'password' property
// 3. Create a getter/setter for a 'fullName' computed property
```

**Expected Solution:**
```javascript
// 1. Deep freeze
function deepFreeze(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}

// 2. Property descriptors
const secureUser = {};
Object.defineProperties(secureUser, {
  id: {
    value: 'usr_123',
    writable: false,      // cannot modify
    configurable: false,  // cannot delete or reconfigure
    enumerable: true      // shows in Object.keys()
  },
  password: {
    value: 'secret123',
    writable: true,
    configurable: false,
    enumerable: false     // hidden from Object.keys()
  }
});

// 3. Getters/Setters
const person = {
  firstName: 'John',
  lastName: 'Doe',
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(value) {
    const [first, last] = value.split(' ');
    this.firstName = first;
    this.lastName = last;
  }
};
person.fullName = 'Jane Smith';
console.log(person.firstName); // 'Jane'
```

---

## 1.4 Classes & Prototypes

### Question 9: Classes & Inheritance
**Question:** Explain JavaScript classes, inheritance, and how they relate to prototypes. What's the difference between class syntax and prototypal inheritance? What are the four pillars of OOP (encapsulation, abstraction, inheritance, polymorphism) and how does each look in JavaScript?

**Expected Answer:**
- Classes are syntactic sugar over prototype-based inheritance
- `extends` sets up prototype chain
- `super()` calls parent constructor
- `static` methods belong to class, not instances
- Private fields with `#` prefix
- Prototype chain: instance → Class.prototype → Parent.prototype → Object.prototype
- **Four pillars of OOP:**
    - Encapsulation: hide internal state behind methods (`#private` fields, closures)
    - Abstraction: expose a simple interface (`process()`), hide how it works; JS has no `abstract` keyword, so a base method throws `new Error('not implemented')`
    - Inheritance: reuse behavior through `extends`/prototype chain; prefer composition when the hierarchy gets deep
    - Polymorphism: same call, different behavior (`payment.validate()` works for any subclass); in JS it's mostly duck typing plus method overriding

**Code Challenge:**
```javascript
// Create a class hierarchy for a payment system:
// 1. Base class Payment with: amount, date, process() method
// 2. CreditCardPayment extends Payment: cardNumber (last 4 digits only), validate()
// 3. PayPalPayment extends Payment: email, validate()
// 4. Use private fields where appropriate
// 5. Add a static method to track total processed payments
// 6. Point out where your solution shows each of the four OOP pillars
```

**Expected Solution:**
```javascript
class Payment {
  static #totalProcessed = 0;
  #amount;
  #date;
  #status = 'pending';

  constructor(amount) {
    if (new.target === Payment) {
      throw new Error('Payment is abstract');
    }
    this.#amount = amount;
    this.#date = new Date();
  }

  get amount() { return this.#amount; }
  get date() { return this.#date; }
  get status() { return this.#status; }

  process() {
    if (!this.validate()) {
      throw new Error('Validation failed');
    }
    this.#status = 'processed';
    Payment.#totalProcessed += this.#amount;
    return true;
  }

  validate() {
    throw new Error('validate() must be implemented');
  }

  static getTotalProcessed() {
    return Payment.#totalProcessed;
  }
}

class CreditCardPayment extends Payment {
  #cardLastFour;

  constructor(amount, cardNumber) {
    super(amount);
    this.#cardLastFour = cardNumber.slice(-4);
  }

  get cardLastFour() { return this.#cardLastFour; }

  validate() {
    return this.#cardLastFour.length === 4 && 
           /^\d{4}$/.test(this.#cardLastFour);
  }
}

class PayPalPayment extends Payment {
  #email;

  constructor(amount, email) {
    super(amount);
    this.#email = email;
  }

  get email() { return this.#email; }

  validate() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.#email);
  }
}

// Usage
const cc = new CreditCardPayment(100, '4111111111111234');
cc.process();
const pp = new PayPalPayment(50, 'user@example.com');
pp.process();
console.log(Payment.getTotalProcessed()); // 150

// 6. Pillars in this solution:
// - Encapsulation: #amount, #status, #cardNumber can't be touched from outside
// - Abstraction: callers only use process(); validation details stay inside
// - Inheritance: CreditCardPayment/PayPalPayment extend Payment
// - Polymorphism: process() calls this.validate(), which resolves to the subclass version
```

**Evaluation Criteria:**
- Knows classes are sugar over prototypes
- Uses private fields and static members correctly
- Names the four OOP pillars and maps each one to concrete code
- Knows when to prefer composition over inheritance

---

### Question 10: Prototypes
**Question:** Explain the prototype chain. How does property lookup work? What's the difference between `__proto__` and `prototype`?

**Expected Answer:**
- Every object has internal `[[Prototype]]` (accessed via `__proto__` or `Object.getPrototypeOf()`)
- `prototype` is a property on constructor functions, becomes instance's `[[Prototype]]`
- Property lookup walks up the chain until found or reaches `null`
- `Object.create()` creates object with specified prototype
- `instanceof` checks if prototype appears in chain

**Code Challenge:**
```javascript
// 1. Create object inheritance WITHOUT using class keyword
// 2. Demonstrate prototype chain lookup
// 3. Add a method to all arrays (monkey-patching)
// 4. Check if a property exists on object itself vs prototype
```

**Expected Solution:**
```javascript
// 1. Prototypal inheritance without class
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}
// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() {
  console.log(`${this.name} barks!`);
};

const dog = new Dog('Rex', 'German Shepherd');
dog.speak(); // "Rex makes a sound" (inherited)
dog.bark();  // "Rex barks!"

// 2. Prototype chain demonstration
console.log(dog.__proto__ === Dog.prototype);                    // true
console.log(dog.__proto__.__proto__ === Animal.prototype);       // true
console.log(dog.__proto__.__proto__.__proto__ === Object.prototype); // true
console.log(dog.__proto__.__proto__.__proto__.__proto__);        // null

// 3. Monkey-patching (not recommended in production)
Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b, 0);
};
console.log([1, 2, 3].sum()); // 6

// 4. Own vs prototype property
console.log(dog.hasOwnProperty('name'));   // true
console.log(dog.hasOwnProperty('speak'));  // false
console.log('speak' in dog);               // true
console.log(Object.hasOwn(dog, 'name'));   // true (modern)
```

---

## 1.5 Closures & Scope

### Question 11: Closures
**Question:** What is a closure? How do closures work, and what are practical use cases?

**Expected Answer:**
- Closure: Function bundled with its lexical environment
- Inner function retains access to outer function's variables even after outer function returns
- Use cases: Data privacy, partial application, factory functions, event handlers, memoization
- Memory implications: Closed-over variables stay in memory

**Code Challenge:**
```javascript
// 1. Create a counter with increment, decrement, and getCount (private count)
// 2. Create a memoization function for expensive calculations
// 3. Create a rate limiter that only allows function calls N times per second
// 4. Explain what's wrong with this code and fix it:
for (var i = 0; i < 5; i++) {
  document.getElementById('btn' + i).addEventListener('click', function() {
    console.log('Button ' + i + ' clicked');
  });
}
```

**Expected Solution:**
```javascript
// 1. Counter with private state
function createCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
    reset: () => count = initial
  };
}
const counter = createCounter(10);
counter.increment(); // 11
counter.decrement(); // 10

// 2. Memoization
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const expensiveFn = memoize((n) => {
  console.log('Computing...');
  return n * 2;
});
expensiveFn(5); // "Computing..." → 10
expensiveFn(5); // 10 (from cache, no log)

// 3. Rate limiter
function createRateLimiter(fn, maxCalls, perMs) {
  let calls = 0;
  let resetTime = Date.now() + perMs;
  
  return function(...args) {
    const now = Date.now();
    if (now >= resetTime) {
      calls = 0;
      resetTime = now + perMs;
    }
    if (calls < maxCalls) {
      calls++;
      return fn.apply(this, args);
    }
    console.log('Rate limit exceeded');
    return null;
  };
}

// 4. Fix the loop closure issue
// Problem: var is function-scoped, all handlers share same i (5)
// Solutions:
// a) Use let (block-scoped)
for (let i = 0; i < 5; i++) {
  document.getElementById('btn' + i).addEventListener('click', function() {
    console.log('Button ' + i + ' clicked');
  });
}

// b) Use IIFE to create closure
for (var i = 0; i < 5; i++) {
  (function(j) {
    document.getElementById('btn' + j).addEventListener('click', function() {
      console.log('Button ' + j + ' clicked');
    });
  })(i);
}

// c) Use closure via function
for (var i = 0; i < 5; i++) {
  document.getElementById('btn' + i).addEventListener('click', createHandler(i));
}
function createHandler(i) {
  return function() {
    console.log('Button ' + i + ' clicked');
  };
}
```

---

### Question 12: Scope & Execution Context
**Question:** Explain lexical scope, execution context, and the call stack. What is the `this` keyword and how is it determined?

**Expected Answer:**
- **Lexical scope:** Determined at write-time based on where variables are declared
- **Execution context:** Environment where code is evaluated (global, function, eval)
- **Call stack:** LIFO structure tracking execution contexts
- **`this` determination:**
  - Global: `window` (browser) or `undefined` (strict mode)
  - Method: The object calling the method
  - Constructor: The new instance
  - `call/apply/bind`: Explicitly set
  - Arrow functions: Lexical (inherited from parent)

**Code Challenge:**
```javascript
// Predict and explain the output of this:
const obj = {
  name: 'Object',
  regular: function() {
    console.log('Regular:', this.name);
    const inner = function() {
      console.log('Inner regular:', this.name);
    };
    inner();
  },
  arrow: function() {
    console.log('Arrow outer:', this.name);
    const inner = () => {
      console.log('Arrow inner:', this.name);
    };
    inner();
  },
  arrowMethod: () => {
    console.log('Arrow method:', this.name);
  }
};

obj.regular();
obj.arrow();
obj.arrowMethod();

const detached = obj.regular;
detached();

// Fix obj.regular to work correctly
```

**Expected Solution:**
```javascript
obj.regular();
// Regular: Object (this = obj)
// Inner regular: undefined (this = global/undefined in strict mode)

obj.arrow();
// Arrow outer: Object (this = obj)
// Arrow inner: Object (arrow inherits this from arrow outer)

obj.arrowMethod();
// Arrow method: undefined (arrow defined in global scope, no parent function)

const detached = obj.regular;
detached();
// Regular: undefined (this = global, not obj)
// Inner regular: undefined

// Fixes for obj.regular inner:
const obj2 = {
  name: 'Object',
  // Fix 1: Save reference to this
  regular1: function() {
    const self = this;
    const inner = function() {
      console.log('Inner:', self.name);
    };
    inner();
  },
  // Fix 2: Use arrow function (preferred)
  regular2: function() {
    const inner = () => {
      console.log('Inner:', this.name);
    };
    inner();
  },
  // Fix 3: Use bind
  regular3: function() {
    const inner = function() {
      console.log('Inner:', this.name);
    }.bind(this);
    inner();
  },
  // Fix 4: Use call/apply
  regular4: function() {
    const inner = function() {
      console.log('Inner:', this.name);
    };
    inner.call(this);
  }
};
```

---

## 1.6 Promises & Async/Await

### Question 13: Promises Fundamentals
**Question:** Explain Promises. What are the three states? How do `.then()`, `.catch()`, and `.finally()` work?

**Expected Answer:**
- **States:** Pending → Fulfilled/Rejected (settled)
- **`.then(onFulfilled, onRejected)`:** Returns new promise, enables chaining
- **`.catch(onRejected)`:** Handles rejections, equivalent to `.then(null, onRejected)`
- **`.finally()`:** Runs regardless of outcome, doesn't receive value
- Promises are always asynchronous (microtask queue)
- Return value from handler becomes next promise's resolved value

**Code Challenge:**
```javascript
// 1. Create a function that wraps setTimeout in a Promise
// 2. Chain promises to: fetch user → fetch user's posts → fetch first post comments
// 3. Handle errors appropriately
// 4. What's the output order?

console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```

**Expected Solution:**
```javascript
// 1. Promise-wrapped setTimeout
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// With value:
function delayWithValue(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// 2. Chained promises (simulated API)
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id) resolve({ id, name: 'John' });
      else reject(new Error('User ID required'));
    }, 100);
  });
}

function fetchPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve([
      { id: 1, userId, title: 'Post 1' },
      { id: 2, userId, title: 'Post 2' }
    ]), 100);
  });
}

function fetchComments(postId) {
  return new Promise(resolve => {
    setTimeout(() => resolve([
      { id: 1, postId, text: 'Great post!' }
    ]), 100);
  });
}

// Chaining
fetchUser(1)
  .then(user => {
    console.log('User:', user);
    return fetchPosts(user.id);
  })
  .then(posts => {
    console.log('Posts:', posts);
    return fetchComments(posts[0].id);
  })
  .then(comments => {
    console.log('Comments:', comments);
  })
  .catch(error => {
    console.error('Error:', error.message);
  })
  .finally(() => {
    console.log('Done');
  });

// 4. Event loop output order:
// 1 (sync)
// 4 (sync)
// 3 (microtask - promise)
// 2 (macrotask - setTimeout)
```

---

### Question 14: Async/Await
**Question:** How does `async/await` work? What's the difference from `.then()`? Can you mix them?

**Expected Answer:**
- `async` function always returns a Promise
- `await` pauses execution until promise settles
- Syntactic sugar making async code look synchronous
- Error handling with try/catch instead of `.catch()`
- Can mix: async functions return promises, so `.then()` works on them
- `await` can only be used inside `async` functions (or top-level in modules)

**Code Challenge:**
```javascript
// Convert this .then() chain to async/await with proper error handling:
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) throw new Error('User not found');
      return response.json();
    })
    .then(user => fetch(`/api/posts?userId=${user.id}`))
    .then(response => response.json())
    .then(posts => {
      return { user, posts };  // Bug: user not in scope
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

// Also: Execute multiple independent promises in parallel
// And: Execute promises sequentially
```

**Expected Solution:**
```javascript
// Converted to async/await
async function getUserData(userId) {
  try {
    const userResponse = await fetch(`/api/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error('User not found');
    }
    const user = await userResponse.json();
    
    const postsResponse = await fetch(`/api/posts?userId=${user.id}`);
    const posts = await postsResponse.json();
    
    return { user, posts };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Parallel execution (independent promises)
async function getMultipleUsers(ids) {
  try {
    const promises = ids.map(id => fetch(`/api/users/${id}`).then(r => r.json()));
    const users = await Promise.all(promises);
    return users;
  } catch (error) {
    // If any fails, all fail
    console.error('One or more requests failed:', error);
    throw error;
  }
}

// With Promise.allSettled (get all results regardless of failures)
async function getMultipleUsersSafe(ids) {
  const promises = ids.map(id => fetch(`/api/users/${id}`).then(r => r.json()));
  const results = await Promise.allSettled(promises);
  return results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  );
}

// Sequential execution
async function processSequentially(items) {
  const results = [];
  for (const item of items) {
    const result = await processItem(item); // waits for each
    results.push(result);
  }
  return results;
}

// Mixing async/await with .then()
async function getData() {
  return { data: 'example' };
}
// Can use .then() on async function:
getData().then(result => console.log(result));

// Can use await on .then() chain:
async function mixed() {
  const result = await fetch('/api').then(r => r.json());
  return result;
}
```

---

### Question 15: Promise Static Methods
**Question:** Explain `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, and `Promise.any()`. When would you use each?

**Expected Answer:**
- **`Promise.all()`:** Resolves when all resolve, rejects on first rejection
- **`Promise.allSettled()`:** Waits for all to settle, never rejects, returns status objects
- **`Promise.race()`:** Settles with first settled promise (fulfilled or rejected)
- **`Promise.any()`:** Resolves with first fulfilled, rejects only if all reject (AggregateError)

**Code Challenge:**
```javascript
// Implement:
// 1. Fetch from multiple APIs, fail if any fails (all or nothing)
// 2. Fetch from multiple APIs, get all results (successes and failures)
// 3. Fetch from multiple mirrors, use first successful response
// 4. Implement a timeout wrapper for any promise
// 5. Implement Promise.all polyfill
```

**Expected Solution:**
```javascript
// 1. All or nothing
async function fetchAllOrNothing(urls) {
  const promises = urls.map(url => fetch(url).then(r => r.json()));
  return Promise.all(promises);
}

// 2. Get all results
async function fetchAllResults(urls) {
  const promises = urls.map(url => fetch(url).then(r => r.json()));
  const results = await Promise.allSettled(promises);
  return results.map((result, i) => ({
    url: urls[i],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null
  }));
}

// 3. First successful from mirrors
async function fetchFromMirrors(mirrors) {
  try {
    return await Promise.any(
      mirrors.map(url => fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }))
    );
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('All mirrors failed:', error.errors);
    }
    throw error;
  }
}

// 4. Timeout wrapper
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

// Usage:
const data = await withTimeout(fetch('/api/slow'), 5000);

// 5. Promise.all polyfill
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    const results = [];
    let completed = 0;
    const total = promises.length;
    
    if (total === 0) {
      return resolve([]);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          if (completed === total) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
```

---

## 1.7 TypeScript Fundamentals

### Question 16: TypeScript Basics
**Question:** What are the benefits of TypeScript? Explain basic types, interfaces, and type aliases.

**Expected Answer:**
- **Benefits:** Static typing, better IDE support, catch errors at compile time, self-documenting code
- **Basic types:** `string`, `number`, `boolean`, `null`, `undefined`, `void`, `never`, `any`, `unknown`
- **Interfaces:** Describe object shapes, can be extended, declaration merging
- **Type aliases:** Can represent any type, no declaration merging, use `type` keyword
- **Difference:** Interfaces for objects/classes, type aliases for unions/primitives/tuples

**Code Challenge:**
```typescript
// Create types for an e-commerce system:
// 1. Product with id, name, price, optional description, and category
// 2. Category as a union type of specific strings
// 3. Cart that contains products with quantities
// 4. User with shipping address (nested type)
// 5. Order that combines user, cart, and status
// 6. Function type for calculating cart total
```

**Expected Solution:**
```typescript
// 1 & 2. Product and Category
type Category = 'electronics' | 'clothing' | 'books' | 'food';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;  // optional
  category: Category;
}

// 3. Cart
interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// 4. User with nested address
interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  shippingAddress: Address;
  billingAddress?: Address;  // optional, might be same as shipping
}

// 5. Order
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  user: User;
  cart: Cart;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
}

// 6. Function type
type CalculateCartTotal = (cart: Cart) => number;

// Implementation
const calculateCartTotal: CalculateCartTotal = (cart) => {
  return cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

// Alternative: Function signature in interface
interface CartOperations {
  calculateTotal: (cart: Cart) => number;
  addItem: (cart: Cart, product: Product, quantity: number) => Cart;
  removeItem: (cart: Cart, productId: string) => Cart;
}
```

---

### Question 17: TypeScript Advanced Types
**Question:** Explain generics, utility types, and conditional types in TypeScript.

**Expected Answer:**
- **Generics:** Type parameters for reusable, type-safe code
- **Utility types:** `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `Readonly<T>`
- **Conditional types:** `T extends U ? X : Y`
- **Mapped types:** Transform properties of existing types
- **`keyof`:** Gets union of keys from type
- **`typeof`:** Gets type from value

**Code Challenge:**
```typescript
// 1. Create a generic function that fetches and types API responses
// 2. Create a type that makes all nested properties optional (DeepPartial)
// 3. Create a type that extracts all function property names from an object type
// 4. Create a generic Result type for success/error handling
// 5. Use utility types to create DTO variations (Create, Update, Response)
```

**Expected Solution:**
```typescript
// 1. Generic API fetch
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// Usage:
interface User {
  id: string;
  name: string;
}
const user = await fetchApi<User>('/api/users/1');

// 2. DeepPartial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P];
};

// Usage:
interface Config {
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
  };
}
type PartialConfig = DeepPartial<Config>;
// { server?: { host?: string; port?: number; }; database?: { url?: string; }; }

// 3. Extract function property names
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

interface Example {
  name: string;
  age: number;
  greet: () => void;
  calculate: (x: number) => number;
}
type ExampleFunctions = FunctionPropertyNames<Example>; // 'greet' | 'calculate'

// 4. Result type (like Rust's Result)
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: 'Division by zero' };
  }
  return { success: true, data: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.data); // TypeScript knows data exists
} else {
  console.error(result.error); // TypeScript knows error exists
}

// 5. DTO variations
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create DTO - no id, no dates, password required
type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Update DTO - partial, no id/dates
type UpdateUserDTO = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

// Response DTO - no password
type UserResponseDTO = Omit<User, 'password'>;

// Or more explicitly:
type CreateUserDTO2 = Pick<User, 'email' | 'password' | 'name'>;

// Generic DTO creator
type CreateDTO<T, OmitKeys extends keyof T> = Omit<T, OmitKeys | 'id' | 'createdAt' | 'updatedAt'>;
type ResponseDTO<T, OmitKeys extends keyof T> = Omit<T, OmitKeys>;
```

---

### Question 18: TypeScript with Functions & Type Guards
**Question:** How do you type functions in TypeScript? What are type guards and how do you create custom ones?

**Expected Answer:**
- Function typing: Parameter types, return types, overloads
- Optional/default/rest parameters
- Type guards: Narrow types within conditional blocks
- Built-in: `typeof`, `instanceof`, `in`, `Array.isArray()`
- Custom: Functions returning `paramName is Type`
- Discriminated unions: Use literal type property to narrow

**Code Challenge:**
```typescript
// 1. Create a function with multiple overload signatures for parsing input
// 2. Create type guards for a discriminated union of API responses
// 3. Create a type-safe event emitter with typed events
```

**Expected Solution:**
```typescript
// 1. Function overloads
function parseInput(input: string): string[];
function parseInput(input: number): number;
function parseInput(input: string[]): string;
function parseInput(input: string | number | string[]): string | number | string[] {
  if (typeof input === 'string') {
    return input.split(',');
  }
  if (typeof input === 'number') {
    return input * 2;
  }
  return input.join(',');
}

const a = parseInput('a,b,c');  // string[]
const b = parseInput(5);         // number
const c = parseInput(['a', 'b']); // string

// 2. Discriminated unions with type guards
interface SuccessResponse {
  type: 'success';
  data: unknown;
  statusCode: 200;
}

interface ErrorResponse {
  type: 'error';
  message: string;
  statusCode: 400 | 404 | 500;
}

interface LoadingResponse {
  type: 'loading';
}

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse;

// Type guard functions
function isSuccess(response: ApiResponse): response is SuccessResponse {
  return response.type === 'success';
}

function isError(response: ApiResponse): response is ErrorResponse {
  return response.type === 'error';
}

function handleResponse(response: ApiResponse) {
  if (isSuccess(response)) {
    // TypeScript knows: response is SuccessResponse
    console.log(response.data, response.statusCode);
  } else if (isError(response)) {
    // TypeScript knows: response is ErrorResponse
    console.error(response.message, response.statusCode);
  } else {
    // TypeScript knows: response is LoadingResponse
    console.log('Loading...');
  }
  
  // Or use discriminant directly:
  switch (response.type) {
    case 'success':
      return response.data;
    case 'error':
      throw new Error(response.message);
    case 'loading':
      return null;
  }
}

// 3. Type-safe event emitter
interface EventMap {
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string };
  'error': { message: string; code: number };
}

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: { [K in keyof T]?: ((data: T[K]) => void)[] } = {};

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  off<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      this.listeners[event] = callbacks.filter(cb => cb !== callback);
    }
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// Usage:
const emitter = new TypedEventEmitter<EventMap>();

emitter.on('user:login', (data) => {
  // TypeScript knows: data is { userId: string; timestamp: Date }
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

emitter.emit('user:login', { 
  userId: '123', 
  timestamp: new Date() 
});

// Type error: emitter.emit('user:login', { wrong: 'data' });
```

---

## Summary & Scoring Guide

### Section 1 Scoring Rubric:

| Score | Level | Description |
|-------|-------|-------------|
| 0-3   | Junior | Basic syntax knowledge, major gaps in fundamentals |
| 4-5   | Mid-Junior | Understands basics but struggles with advanced concepts |
| 6-7   | Semi-Senior | Solid understanding, minor gaps in edge cases |
| 8-9   | Senior | Deep understanding, can explain nuances and trade-offs |
| 10    | Expert | Complete mastery, knows internals and edge cases |

### Key Concepts to Evaluate:
- [ ] ES6+ syntax and when to use each feature
- [ ] Array/String manipulation fluency
- [ ] Object manipulation and immutability
- [ ] Class syntax and prototypal inheritance understanding
- [ ] Closure mechanics and practical applications
- [ ] Scope and `this` binding rules
- [ ] Promise lifecycle and async patterns
- [ ] TypeScript type system depth
- [ ] Error handling best practices
- [ ] Code readability and best practices

---

*End of Section 1: JavaScript & TypeScript Fundamentals*

---

# SECTION 2: React Fundamentals

---

## 2.1 Components & JSX

### Question 19: Functional vs Class Components
**Question:** What are the differences between functional and class components in React? When would you use each?

**Expected Answer:**
- **Functional components:** JavaScript functions, simpler syntax, use Hooks for state/lifecycle
- **Class components:** ES6 classes extending `React.Component`, use `this.state` and lifecycle methods
- Modern React favors functional components with Hooks
- Class components still needed for error boundaries
- Functional components are easier to test and reuse

**Code Challenge:**
```jsx
// Convert this class component to a functional component with hooks:
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      name: props.user.name
    };
  }

  componentDidMount() {
    document.title = `Profile: ${this.state.name}`;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.name !== this.state.name) {
      document.title = `Profile: ${this.state.name}`;
    }
  }

  componentWillUnmount() {
    document.title = 'App';
  }

  handleEdit = () => {
    this.setState(prev => ({ isEditing: !prev.isEditing }));
  };

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    const { isEditing, name } = this.state;
    return (
      <div>
        {isEditing ? (
          <input value={name} onChange={this.handleNameChange} />
        ) : (
          <h1>{name}</h1>
        )}
        <button onClick={this.handleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    );
  }
}
```

**Expected Solution:**
```jsx
import { useState, useEffect } from 'react';

function UserProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  // Combined componentDidMount, componentDidUpdate, componentWillUnmount
  useEffect(() => {
    document.title = `Profile: ${name}`;
    
    // Cleanup function (componentWillUnmount)
    return () => {
      document.title = 'App';
    };
  }, [name]); // Dependency array - runs when name changes

  const handleEdit = () => {
    setIsEditing(prev => !prev);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      {isEditing ? (
        <input value={name} onChange={handleNameChange} />
      ) : (
        <h1>{name}</h1>
      )}
      <button onClick={handleEdit}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}

export default UserProfile;
```

---

### Question 20: Rendering Lists & Keys
**Question:** How do you render lists in React? Why are keys important, and what are the rules for using them?

**Expected Answer:**
- Use `.map()` to transform arrays into JSX elements
- Keys help React identify which items changed, added, or removed
- Keys must be unique among siblings (not globally)
- Don't use array index as key if list can reorder (causes bugs)
- Keys should be stable, predictable, and unique (use IDs from data)

**Code Challenge:**
```jsx
// Render this users array, displaying firstname and lastname
// Sort alphabetically by lastname
// Each user should have an "Remove" button
// Include proper keys and handle empty state

const users = [
  { id: 1, firstName: 'John', lastName: 'Zebra' },
  { id: 2, firstName: 'Jane', lastName: 'Adams' },
  { id: 3, firstName: 'Bob', lastName: 'Miller' },
  { id: 4, firstName: 'Alice', lastName: 'Smith' },
  { id: 5, firstName: 'Charlie', lastName: 'Adams' }
];

// Expected output order:
// Jane Adams
// Charlie Adams
// Bob Miller
// Alice Smith
// John Zebra
```

**Expected Solution:**
```jsx
import { useState } from 'react';

function UserList() {
  const [users, setUsers] = useState([
    { id: 1, firstName: 'John', lastName: 'Zebra' },
    { id: 2, firstName: 'Jane', lastName: 'Adams' },
    { id: 3, firstName: 'Bob', lastName: 'Miller' },
    { id: 4, firstName: 'Alice', lastName: 'Smith' },
    { id: 5, firstName: 'Charlie', lastName: 'Adams' }
  ]);

  // Sort by lastName (and firstName as tiebreaker)
  const sortedUsers = [...users].sort((a, b) => {
    const lastNameCompare = a.lastName.localeCompare(b.lastName);
    if (lastNameCompare !== 0) return lastNameCompare;
    return a.firstName.localeCompare(b.firstName);
  });

  const handleRemove = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  // Empty state
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <ul>
      {sortedUsers.map(user => (
        <li key={user.id}>
          {user.firstName} {user.lastName}
          <button onClick={() => handleRemove(user.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

// Alternative: Extracted UserItem component
function UserItem({ user, onRemove }) {
  return (
    <li>
      {user.firstName} {user.lastName}
      <button onClick={() => onRemove(user.id)}>Remove</button>
    </li>
  );
}

function UserListWithComponent() {
  const [users, setUsers] = useState([/* ... */]);
  
  const sortedUsers = [...users].sort((a, b) => 
    a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
  );

  const handleRemove = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  if (!users.length) return <p>No users found.</p>;

  return (
    <ul>
      {sortedUsers.map(user => (
        <UserItem key={user.id} user={user} onRemove={handleRemove} />
      ))}
    </ul>
  );
}
```

**Evaluation Criteria:**
- Correct use of `.map()` with proper keys (not index)
- Immutable state update (spread operator or filter)
- Sorting without mutating original array
- Empty state handling
- Event handler patterns

---

## 2.2 State & Props

### Question 21: State Management Patterns
**Question:** Explain the difference between props and state. How do you lift state up, and when should you do it?

**Expected Answer:**
- **Props:** Read-only data passed from parent to child, immutable by child
- **State:** Local data managed within component, can be updated
- **Lifting state:** Move shared state to closest common ancestor
- Lift state when multiple components need same data or need to stay in sync
- Pass state down as props, pass updater functions for child modifications

**Code Challenge:**
```jsx
// Create a temperature converter with two inputs (Celsius and Fahrenheit)
// When one input changes, the other should update automatically
// Use proper state lifting pattern
// Include validation (must be a number)
```

**Expected Solution:**
```jsx
import { useState } from 'react';

// Conversion functions
const toCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;
const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

// Reusable input component
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  const scaleNames = { c: 'Celsius', f: 'Fahrenheit' };

  const handleChange = (e) => {
    onTemperatureChange(e.target.value);
  };

  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input
        type="number"
        value={temperature}
        onChange={handleChange}
        placeholder={scaleNames[scale]}
      />
    </fieldset>
  );
}

// Parent component with lifted state
function TemperatureConverter() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c'); // which input was last changed

  const handleCelsiusChange = (value) => {
    setScale('c');
    setTemperature(value);
  };

  const handleFahrenheitChange = (value) => {
    setScale('f');
    setTemperature(value);
  };

  // Calculate derived values
  const celsius = scale === 'f' && temperature !== '' 
    ? toCelsius(parseFloat(temperature)).toFixed(2) 
    : temperature;
  
  const fahrenheit = scale === 'c' && temperature !== '' 
    ? toFahrenheit(parseFloat(temperature)).toFixed(2) 
    : temperature;

  // Validation
  const isValid = temperature === '' || !isNaN(parseFloat(temperature));

  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      {!isValid && <p style={{ color: 'red' }}>Please enter a valid number</p>}
      {isValid && temperature !== '' && (
        <p>
          {celsius}°C = {fahrenheit}°F
        </p>
      )}
    </div>
  );
}

export default TemperatureConverter;
```

---

### Question 22: Controlled vs Uncontrolled Components
**Question:** What's the difference between controlled and uncontrolled components? When would you use each?

**Expected Answer:**
- **Controlled:** Form data handled by React state, value prop + onChange handler
- **Uncontrolled:** Form data handled by DOM itself, use refs to access values
- Controlled: More control, validation on every keystroke, React is source of truth
- Uncontrolled: Simpler for basic forms, integrating non-React code, file inputs
- `useRef` for uncontrolled, `useState` for controlled

**Code Challenge:**
```jsx
// Create a form with:
// 1. Controlled text input with live character count (max 100 chars)
// 2. Controlled select dropdown
// 3. Uncontrolled file input
// 4. Submit handler that logs all values
// 5. Reset functionality
```

**Expected Solution:**
```jsx
import { useState, useRef } from 'react';

function HybridForm() {
  // Controlled state
  const [text, setText] = useState('');
  const [category, setCategory] = useState('general');
  
  // Uncontrolled ref
  const fileInputRef = useRef(null);
  
  const maxLength = 100;
  const remainingChars = maxLength - text.length;

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      text,
      category,
      file: fileInputRef.current?.files[0] || null
    };
    
    console.log('Form submitted:', formData);
    
    // If you need FormData for file upload:
    const data = new FormData();
    data.append('text', text);
    data.append('category', category);
    if (fileInputRef.current?.files[0]) {
      data.append('file', fileInputRef.current.files[0]);
    }
  };

  const handleReset = () => {
    setText('');
    setCategory('general');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Controlled text input */}
      <div>
        <label htmlFor="text">Message:</label>
        <textarea
          id="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter your message..."
        />
        <span style={{ color: remainingChars < 20 ? 'red' : 'inherit' }}>
          {remainingChars} characters remaining
        </span>
      </div>

      {/* Controlled select */}
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="general">General</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
        </select>
      </div>

      {/* Uncontrolled file input */}
      <div>
        <label htmlFor="file">Attachment:</label>
        <input
          type="file"
          id="file"
          ref={fileInputRef}
          accept=".pdf,.jpg,.png"
        />
      </div>

      <div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
}

export default HybridForm;
```

---

## 2.3 React Hooks

### Question 23: useState & useEffect
**Question:** Explain `useState` and `useEffect` hooks. What are the rules of hooks? What's the dependency array in useEffect?

**Expected Answer:**
- **useState:** Adds state to functional components, returns [value, setter]
- **useEffect:** Side effects (data fetching, subscriptions, DOM manipulation)
- **Rules:** Only call at top level, only call in React functions
- **Dependency array:** 
  - `[]` = run once on mount
  - `[dep]` = run when dep changes
  - No array = run every render
- Cleanup function for subscriptions/timers

**Code Challenge:**
```jsx
// Create a custom hook useDebounce that:
// 1. Takes a value and delay
// 2. Returns the debounced value
// 3. Then use it in a search component that fetches results

// Also create a component that:
// 1. Fetches data on mount
// 2. Shows loading state
// 3. Handles errors
// 4. Cleans up if component unmounts during fetch
```

**Expected Solution:**
```jsx
import { useState, useEffect, useCallback } from 'react';

// Custom debounce hook
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timer if value changes before delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search component using debounce
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Don't search for empty query
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        setResults(data);
      } catch (err) {
        // Ignore abort errors
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    // Cleanup: abort fetch if query changes or unmount
    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}

// Data fetching component with full lifecycle handling
function DataFetchingComponent({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Only update state if still mounted
        if (isMounted) {
          setUser(data);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Cleanup
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userId]); // Re-fetch when userId changes

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

export { useDebounce, SearchComponent, DataFetchingComponent };
```

---

### Question 24: useCallback, useMemo, useRef
**Question:** When should you use `useCallback`, `useMemo`, and `useRef`? What problems do they solve?

**Expected Answer:**
- **useMemo:** Memoize expensive calculations, returns cached value
- **useCallback:** Memoize functions, returns cached function reference
- **useRef:** Persist mutable value across renders without causing re-render
- Use `useMemo`/`useCallback` for optimization when passing to child components with `React.memo`
- Premature optimization is bad - profile first
- `useRef` for DOM references and instance variables

**Code Challenge:**
```jsx
// Create a component that:
// 1. Has an expensive filtered/sorted list
// 2. Passes stable callbacks to child components
// 3. Uses ref to focus an input
// 4. Tracks render count without causing re-renders
// 5. Child component should not re-render unnecessarily
```

**Expected Solution:**
```jsx
import { useState, useMemo, useCallback, useRef, memo } from 'react';

// Memoized child component
const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }) {
  console.log(`Rendering TodoItem: ${todo.id}`);
  
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});

function OptimizedTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build project', completed: false },
    { id: 3, text: 'Deploy app', completed: true },
  ]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Ref for input focus
  const inputRef = useRef(null);
  
  // Ref to track render count (doesn't cause re-render)
  const renderCount = useRef(0);
  renderCount.current++;

  // Expensive computation - memoized
  const filteredAndSortedTodos = useMemo(() => {
    console.log('Computing filtered todos...');
    
    let result = [...todos];
    
    // Filter
    if (filter === 'active') {
      result = result.filter(t => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter(t => t.completed);
    }
    
    // Sort
    result.sort((a, b) => {
      const comparison = a.text.localeCompare(b.text);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [todos, filter, sortOrder]); // Only recompute when these change

  // Stable callback references
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // Empty deps - setTodos is stable

  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const handleAddTodo = useCallback((text) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, completed: false }
    ]);
  }, []);

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputRef.current.value.trim();
    if (text) {
      handleAddTodo(text);
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <p>Render count: {renderCount.current}</p>
      
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} placeholder="New todo..." />
        <button type="submit">Add</button>
        <button type="button" onClick={handleFocusInput}>
          Focus Input
        </button>
      </form>

      <div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        
        <button onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}>
          Sort: {sortOrder.toUpperCase()}
        </button>
      </div>

      <ul>
        {filteredAndSortedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}

export default OptimizedTodoList;
```

**Evaluation Criteria:**
- Correct use of `useMemo` for derived data
- Correct use of `useCallback` with proper dependencies
- Understanding when memoization is necessary
- Proper use of `React.memo` for child components
- `useRef` for DOM and render count

---

## 2.4 Context API

### Question 25: Context API & State Management
**Question:** What is the Context API? When should you use it vs prop drilling vs external state management?

**Expected Answer:**
- **Context:** Share data without passing props through every level
- **Use cases:** Theme, auth, locale, user preferences
- **Avoid for:** Frequently changing data (causes re-renders of all consumers)
- **Prop drilling:** Fine for 2-3 levels, explicit data flow
- **External state (Redux, Zustand):** Complex state, many updaters, time-travel debugging
- Split contexts by concern to minimize re-renders

**Code Challenge:**
```jsx
// Create a theme and auth context system:
// 1. ThemeContext with light/dark toggle
// 2. AuthContext with user, login, logout
// 3. A component that uses both contexts
// 4. Custom hooks for consuming each context
// 5. Proper provider composition
```

**Expected Solution:**
```jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ============ Theme Context ============
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook with error handling
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ============ Auth Context ============
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      // Simulated API call
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      const userData = await response.json();
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  }), [user, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ============ Combined Provider ============
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

// ============ Consumer Component ============
function Header() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const styles = {
    header: {
      backgroundColor: isDark ? '#333' : '#fff',
      color: isDark ? '#fff' : '#333',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between'
    }
  };

  return (
    <header style={styles.header}>
      <h1>My App</h1>
      <div>
        <button onClick={toggleTheme}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
        
        {isAuthenticated ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={logout} disabled={isLoading}>
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <span>Please log in</span>
        )}
      </div>
    </header>
  );
}

// ============ Protected Route Component ============
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view this content</div>;
  }

  return children;
}

// ============ Usage ============
function App() {
  return (
    <AppProviders>
      <Header />
      <main>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </main>
    </AppProviders>
  );
}

export { ThemeProvider, useTheme, AuthProvider, useAuth, AppProviders };
```

---

## 2.5 React Router

### Question 26: Client-Side Routing
**Question:** How does React Router work? Explain nested routes, route parameters, and navigation guards.

**Expected Answer:**
- **BrowserRouter:** Uses HTML5 history API
- **Routes/Route:** Define route configuration
- **Nested routes:** Child routes render inside parent's `<Outlet />`
- **Params:** Dynamic segments with `:param`, access via `useParams()`
- **Navigation:** `<Link>`, `<NavLink>`, `useNavigate()` hook
- **Guards:** Check conditions before rendering, redirect if unauthorized
- **Loaders/Actions:** Data fetching and mutations (React Router 6.4+)

**Code Challenge:**
```jsx
// Create a routing setup with:
// 1. Public routes (home, about)
// 2. Protected routes (dashboard, profile)
// 3. Nested routes (dashboard/settings, dashboard/analytics)
// 4. Route with URL parameters (user/:id)
// 5. 404 page
// 6. Auth-based navigation guard
// 7. Active link styling
```

**Expected Solution:**
```jsx
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  NavLink,
  Navigate,
  Outlet,
  useParams,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useAuth } from './AuthContext'; // From previous example

// ============ Protected Route Wrapper ============
function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save attempted URL for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}

// ============ Layout Components ============
function PublicLayout() {
  return (
    <div>
      <nav>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Home
        </NavLink>
        <NavLink 
          to="/about"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          About
        </NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>
        <nav>
          <NavLink to="/dashboard" end>Overview</NavLink>
          <NavLink to="/dashboard/analytics">Analytics</NavLink>
          <NavLink to="/dashboard/settings">Settings</NavLink>
        </nav>
      </aside>
      <main>
        <Outlet /> {/* Nested dashboard routes */}
      </main>
    </div>
  );
}

// ============ Page Components ============
function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login({ email: 'test@test.com' });
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Dashboard() {
  return <h1>Dashboard Overview</h1>;
}

function Analytics() {
  return <h1>Analytics</h1>;
}

function Settings() {
  return <h1>Settings</h1>;
}

// Route with params
function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h1>User Profile: {id}</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
}

// ============ Router Configuration ============
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with shared layout */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes - index is default */}
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Route with URL parameter */}
        <Route
          path="user/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

// ============ Styles for NavLink ============
/*
CSS:
nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
}

nav a.active {
  font-weight: bold;
  color: #007bff;
  border-bottom: 2px solid #007bff;
}
*/
```

---

## 2.6 Advanced Patterns

### Question 27: Custom Hooks
**Question:** What makes a good custom hook? What are the patterns for creating reusable hooks?

**Expected Answer:**
- Custom hooks extract reusable stateful logic
- Must start with "use" prefix
- Can use other hooks inside
- Return values/functions needed by components
- Separate concerns: data fetching, form handling, subscriptions
- Each call gets its own isolated state

**Code Challenge:**
```jsx
// Create these custom hooks:
// 1. useLocalStorage - persist state to localStorage
// 2. useFetch - data fetching with loading/error states
// 3. useForm - form handling with validation
```

**Expected Solution:**
```jsx
import { useState, useEffect, useCallback } from 'react';

// ============ useLocalStorage ============
function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Usage:
// const [user, setUser, removeUser] = useLocalStorage('user', null);


// ============ useFetch ============
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    const cleanup = refetch();
    return () => {
      if (cleanup) cleanup();
    };
  }, [refetch]);

  return { data, loading, error, refetch };
}

// Usage:
// const { data: users, loading, error, refetch } = useFetch('/api/users');


// ============ useForm ============
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update single field
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Mark field as touched on blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Validate all fields
  const validateForm = useCallback(() => {
    if (!validate) return {};
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return validationErrors;
  }, [values, validate]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }), {}
    );
    setTouched(allTouched);

    // Validate
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [values, validateForm]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateForm
  };
}

// Usage Example:
function LoginForm() {
  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email format';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm({ email: '', password: '' }, validate);

  const onSubmit = async (formValues) => {
    console.log('Submitting:', formValues);
    // API call here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Login'}
      </button>
    </form>
  );
}

export { useLocalStorage, useFetch, useForm };
```

---

### Question 28: Error Boundaries & Performance
**Question:** What are Error Boundaries? How do you optimize React performance?

**Expected Answer:**
- **Error Boundaries:** Class components catching JS errors in children
- Only catch errors during rendering, lifecycle, constructors
- Don't catch: event handlers, async code, SSR, errors in boundary itself
- **Performance optimization:**
  - `React.memo()` for component memoization
  - `useMemo`/`useCallback` for expensive operations
  - Virtualization for long lists (react-window)
  - Code splitting with `React.lazy()` and `Suspense`
  - Profiler to identify bottlenecks

**Code Challenge:**
```jsx
// Create:
// 1. An Error Boundary component with fallback UI
// 2. A lazy-loaded component with Suspense
// 3. A virtualized list for 10,000 items
```

**Expected Solution:**
```jsx
import React, { Component, Suspense, lazy, useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

// ============ Error Boundary ============
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to service
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Send to error tracking service
    // errorTrackingService.log({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleReset
        });
      }

      // Default fallback
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage with custom fallback
function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div>
          <h1>Oops! {error.message}</h1>
          <button onClick={resetError}>Retry</button>
        </div>
      )}
    >
      <MainContent />
    </ErrorBoundary>
  );
}


// ============ Lazy Loading with Suspense ============
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const UserDashboard = lazy(() => import('./UserDashboard'));

// Loading component
function LoadingSpinner() {
  return <div className="spinner">Loading...</div>;
}

// Skeleton loader
function DashboardSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-content" />
    </div>
  );
}

function LazyLoadedApp() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Load Chart</button>
      
      {/* Suspense wraps lazy components */}
      <Suspense fallback={<LoadingSpinner />}>
        {showChart && <HeavyChart />}
      </Suspense>

      {/* Multiple lazy components with different fallbacks */}
      <ErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          <UserDashboard />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}


// ============ Virtualized List ============
// Row renderer - memoized to prevent unnecessary re-renders
const Row = React.memo(function Row({ index, style, data }) {
  const item = data[index];
  
  return (
    <div style={style} className="list-row">
      <span>{item.id}</span>
      <span>{item.name}</span>
      <span>{item.email}</span>
    </div>
  );
});

function VirtualizedUserList() {
  // Generate 10,000 items
  const [items] = useState(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`
    }))
  );

  const [filter, setFilter] = useState('');

  // Memoize filtered items
  const filteredItems = React.useMemo(() => {
    if (!filter) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div>
      <input
        type="text"
        placeholder="Filter users..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <p>Showing {filteredItems.length} of {items.length} users</p>
      
      {/* Virtualized list - only renders visible items */}
      <List
        height={400}
        width={600}
        itemCount={filteredItems.length}
        itemSize={50}
        itemData={filteredItems}
      >
        {Row}
      </List>
    </div>
  );
}

// Without react-window (manual implementation concept)
function SimpleVirtualList({ items, itemHeight, windowHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(windowHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: windowHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ErrorBoundary, LazyLoadedApp, VirtualizedUserList };
```

---

## Section 2 Summary & Scoring Guide

### Section 2 Scoring Rubric:

| Score | Level | Description |
|-------|-------|-------------|
| 0-3   | Junior | Can create basic components, struggles with state management |
| 4-5   | Mid-Junior | Understands hooks basics, limited optimization knowledge |
| 6-7   | Semi-Senior | Solid hook patterns, understands context and routing |
| 8-9   | Senior | Deep understanding of patterns, performance optimization |
| 10    | Expert | Mastery of advanced patterns, can architect complex apps |

### Key Concepts to Evaluate:
- [ ] Component composition and reusability
- [ ] State management patterns (lifting state, context)
- [ ] Hooks rules and proper usage
- [ ] Custom hooks design
- [ ] Performance optimization techniques
- [ ] Error handling strategies
- [ ] Routing and navigation patterns
- [ ] Controlled vs uncontrolled components
- [ ] Proper key usage in lists
- [ ] useEffect cleanup and dependencies

---

*End of Section 2: React Fundamentals*


---

# SECTION 3: Node.js & Backend Fundamentals

---

## 3.1 Node.js Core Concepts

### Question 29: Event Loop & Asynchronous Programming
**Question:** Explain the Node.js event loop. How does Node.js handle asynchronous operations? What are the different phases of the event loop?

**Expected Answer:**
- **Event Loop Phases:**
    1. Timers: `setTimeout()`, `setInterval()`
    2. Pending callbacks: I/O callbacks deferred to next loop
    3. Idle/prepare: Internal use
    4. Poll: Retrieve new I/O events
    5. Check: `setImmediate()` callbacks
    6. Close callbacks: Socket close events
- **Microtasks:** `process.nextTick()`, Promises (run between phases)
- **Blocking vs Non-blocking:** I/O operations are non-blocking
- Node.js is single-threaded but uses libuv for async I/O

**Code Challenge:**
```javascript
// Predict the output order and explain why:
console.log('1');

setTimeout(() => console.log('2'), 0);

setImmediate(() => console.log('3'));

process.nextTick(() => console.log('4'));

Promise.resolve().then(() => console.log('5'));

console.log('6');

// Also: Demonstrate the difference between synchronous and asynchronous file reading
```

**Expected Solution:**
```javascript
// Output order: 1, 6, 4, 5, 2, 3
// Explanation:
// 1, 6: Synchronous code runs first
// 4: process.nextTick() runs before any other async (microtask, highest priority)
// 5: Promise.then() is a microtask (runs after nextTick)
// 2, 3: setTimeout and setImmediate (macrotasks)
// Note: Order of 2 and 3 may vary depending on system

// Synchronous vs Asynchronous file reading
const fs = require('fs');
const path = require('path');

// BLOCKING (Synchronous) - stops execution
console.log('Before sync read');
try {
    const dataSync = fs.readFileSync(path.join(__dirname, 'file.txt'), 'utf8');
    console.log('Sync data:', dataSync);
} catch (err) {
    console.error('Sync error:', err);
}
console.log('After sync read'); // Waits for file to be read

// NON-BLOCKING (Asynchronous with callbacks)
console.log('Before async read');
fs.readFile(path.join(__dirname, 'file.txt'), 'utf8', (err, data) => {
    if (err) {
        console.error('Async error:', err);
        return;
    }
    console.log('Async data:', data);
});
console.log('After async read'); // Doesn't wait

// NON-BLOCKING (Promises/async-await - preferred)
async function readFileAsync() {
    console.log('Before promise read');
    try {
        const data = await fs.promises.readFile(
            path.join(__dirname, 'file.txt'),
            'utf8'
        );
        console.log('Promise data:', data);
    } catch (err) {
        console.error('Promise error:', err);
    }
    console.log('After promise read');
}

readFileAsync();

// Worker threads for CPU-intensive tasks
const { Worker } = require('worker_threads');

function runHeavyTask(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./heavy-task.js', { workerData: data });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
        });
    });
}
```

---

## 3.2 Core Modules & Streams

### Question 30: Streams & Buffers
**Question:** What are streams in Node.js? Explain the different types of streams and when to use them. What are buffers?

**Expected Answer:**
- **Stream Types:**
    - Readable: Read data from source (fs.createReadStream, HTTP requests)
    - Writable: Write data to destination (fs.createWriteStream, HTTP responses)
    - Duplex: Both readable and writable (TCP sockets)
    - Transform: Modify data while reading/writing (zlib, crypto)
- **Benefits:** Handle large data efficiently, memory-efficient, composable via piping
- **Buffers:** Fixed-size chunks of binary data, used when streams aren't available
- **Backpressure:** Slow consumer can pause fast producer

**Code Challenge:**
```javascript
// 1. Copy a large file using streams
// 2. Create a transform stream that converts text to uppercase
// 3. Compress a file using streams
// 4. Handle stream errors properly
// 5. Demonstrate backpressure handling
```

**Expected Solution:**
```javascript
const fs = require('fs');
const { pipeline, Transform } = require('stream');
const zlib = require('zlib');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

// 1. Copy file using streams (memory efficient for large files)
async function copyFile(source, destination) {
    try {
        await pipelineAsync(
            fs.createReadStream(source),
            fs.createWriteStream(destination)
        );
        console.log('File copied successfully');
    } catch (err) {
        console.error('Copy error:', err);
        throw err;
    }
}

// 2. Transform stream (uppercase)
class UpperCaseTransform extends Transform {
    _transform(chunk, encoding, callback) {
        // Convert buffer to string, uppercase, back to buffer
        const upperChunk = chunk.toString().toUpperCase();
        this.push(upperChunk);
        callback();
    }
}

// Usage
async function transformFile(input, output) {
    await pipelineAsync(
        fs.createReadStream(input, 'utf8'),
        new UpperCaseTransform(),
        fs.createWriteStream(output)
    );
}

// 3. Compress file with streams
async function compressFile(input, output) {
    await pipelineAsync(
        fs.createReadStream(input),
        zlib.createGzip(),
        fs.createWriteStream(output)
    );
    console.log('File compressed');
}

async function decompressFile(input, output) {
    await pipelineAsync(
        fs.createReadStream(input),
        zlib.createGunzip(),
        fs.createWriteStream(output)
    );
    console.log('File decompressed');
}

// 4. Comprehensive error handling
async function processFileWithErrorHandling(input, output) {
    const readStream = fs.createReadStream(input);
    const writeStream = fs.createWriteStream(output);
    const gzipStream = zlib.createGzip();

    // Individual error handlers (optional, for specific handling)
    readStream.on('error', err => console.error('Read error:', err));
    writeStream.on('error', err => console.error('Write error:', err));
    gzipStream.on('error', err => console.error('Gzip error:', err));

    try {
        // pipeline handles errors from all streams
        await pipelineAsync(readStream, gzipStream, writeStream);
        console.log('Processing complete');
    } catch (err) {
        console.error('Pipeline error:', err);
        // Cleanup if needed
        writeStream.destroy();
        throw err;
    }
}

// 5. Manual backpressure handling (when not using pipeline)
function copyWithBackpressure(source, destination) {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);

    readStream.on('data', (chunk) => {
        const canContinue = writeStream.write(chunk);
        
        // If write buffer is full, pause reading
        if (!canContinue) {
            readStream.pause();
        }
    });

    // Resume when write buffer is drained
    writeStream.on('drain', () => {
        readStream.resume();
    });

    readStream.on('end', () => {
        writeStream.end();
    });

    readStream.on('error', (err) => {
        console.error('Read error:', err);
        writeStream.end();
    });

    writeStream.on('error', (err) => {
        console.error('Write error:', err);
        readStream.destroy();
    });
}

// Custom readable stream
const { Readable } = require('stream');

class NumberStream extends Readable {
    constructor(max) {
        super();
        this.current = 1;
        this.max = max;
    }

    _read() {
        if (this.current <= this.max) {
            this.push(String(this.current) + '\n');
            this.current++;
        } else {
            this.push(null); // Signal end of stream
        }
    }
}

// Usage
const numberStream = new NumberStream(5);
numberStream.pipe(process.stdout);

// Buffer operations
const buffer1 = Buffer.from('Hello');
const buffer2 = Buffer.from(' World');
const combined = Buffer.concat([buffer1, buffer2]);
console.log(combined.toString()); // "Hello World"

// Buffer allocation
const buf = Buffer.alloc(10); // Filled with zeros
const unsafeBuf = Buffer.allocUnsafe(10); // Not initialized (faster but may contain old data)

module.exports = {
    copyFile,
    transformFile,
    compressFile,
    decompressFile,
    processFileWithErrorHandling,
    copyWithBackpressure
};
```

---

## 3.3 Express.js Server Setup

### Question 31: Express Server & Middleware
**Question:** How do you set up an Express server? What is middleware, and how does the middleware chain work?

**Expected Answer:**
- Middleware: Functions with access to `req`, `res`, and `next()`
- Execution order: Defined order matters
- Types: Application-level, router-level, error-handling, built-in, third-party
- `next()` passes control to next middleware
- Error middleware has 4 params: `(err, req, res, next)`
- Middleware can modify req/res, end request, or call next

**Code Challenge:**
```javascript
// Create an Express server with:
// 1. Request logging middleware
// 2. JSON body parsing
// 3. Custom authentication middleware
// 4. Route-specific middleware
// 5. Error handling middleware
// 6. 404 handler
```

**Expected Solution:**
```javascript
const express = require('express');
const app = express();

// ============ Built-in Middleware ============
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// ============ Custom Application Middleware ============
// 1. Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log after response is sent
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    
    next();
};

app.use(requestLogger);

// Request ID middleware
app.use((req, res, next) => {
    req.id = Math.random().toString(36).substring(7);
    res.setHeader('X-Request-ID', req.id);
    next();
});

// ============ Authentication Middleware ============
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Simulate token verification
    // In real app: jwt.verify(token, process.env.JWT_SECRET, (err, user) => {...})
    if (token === 'valid-token') {
        req.user = { id: 1, username: 'john' };
        next();
    } else {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === 'valid-token') {
        req.user = { id: 1, username: 'john' };
    }
    
    next(); // Continue regardless
};

// ============ Validation Middleware ============
const validateUser = (req, res, next) => {
    const { username, email } = req.body;
    
    if (!username || username.length < 3) {
        return res.status(400).json({ 
            error: 'Username must be at least 3 characters' 
        });
    }
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ 
            error: 'Valid email is required' 
        });
    }
    
    next();
};

// ============ Routes ============
// Public route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Public route with optional auth
app.get('/posts', optionalAuth, (req, res) => {
    const posts = [{ id: 1, title: 'Post 1' }];
    
    // Show extra data if authenticated
    if (req.user) {
        posts.forEach(post => post.canEdit = true);
    }
    
    res.json(posts);
});

// Protected route
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// Multiple middleware for single route
app.post('/users', 
    authenticateToken,
    validateUser,
    (req, res) => {
        // All middleware passed
        res.status(201).json({ 
            message: 'User created',
            user: req.body 
        });
    }
);

// Route with multiple handlers (like middleware)
app.get('/multi',
    (req, res, next) => {
        console.log('Handler 1');
        req.custom = 'data';
        next();
    },
    (req, res, next) => {
        console.log('Handler 2');
        res.json({ custom: req.custom });
    }
);

// ============ Router-level Middleware ============
const adminRouter = express.Router();

// Middleware applies to all admin routes
adminRouter.use((req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
});

adminRouter.get('/dashboard', (req, res) => {
    res.json({ message: 'Admin dashboard' });
});

adminRouter.delete('/users/:id', (req, res) => {
    res.json({ message: `User ${req.params.id} deleted` });
});

app.use('/admin', adminRouter);

// ============ Error Handling ============
// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Route with async error handling
app.get('/async-error', asyncHandler(async (req, res) => {
    throw new Error('Async error occurred');
}));

// 404 handler (must be after all routes)
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        path: req.path 
    });
});

// Error handling middleware (must be last, has 4 params)
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Log stack trace in development
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============ Server Start ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
```

---

## 3.4 RESTful API Design

### Question 32: REST Principles & Route Design
**Question:** What are REST principles? How do you design a RESTful API with proper HTTP methods, status codes, and resource naming?

**Expected Answer:**
- **REST Principles:**
    - Stateless: Each request contains all needed information
    - Resource-based: URLs represent resources (nouns, not verbs)
    - HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (delete)
    - Standard status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
- **Best Practices:**
    - Use plural nouns: `/users`, not `/user`
    - Nested resources: `/users/:id/posts`
    - Versioning: `/api/v1/users`
    - Filtering/pagination: `/users?role=admin&page=2&limit=10`

**Code Challenge:**
```javascript
// Design a RESTful API for a blog system with:
// 1. CRUD operations for posts
// 2. Nested comments for posts
// 3. Proper status codes
// 4. Validation
// 5. Filtering and pagination
```

**Expected Solution:**
```javascript
const express = require('express');
const router = express.Router();

// Simulated database
let posts = [
    { id: 1, title: 'First Post', content: 'Hello World', authorId: 1, createdAt: new Date() },
    { id: 2, title: 'Second Post', content: 'Another post', authorId: 1, createdAt: new Date() }
];

let comments = [
    { id: 1, postId: 1, text: 'Great post!', authorId: 2, createdAt: new Date() },
    { id: 2, postId: 1, text: 'Thanks!', authorId: 1, createdAt: new Date() }
];

let nextPostId = 3;
let nextCommentId = 3;

// ============ Validation Helpers ============
const validatePost = (req, res, next) => {
    const { title, content } = req.body;
    
    if (!title || title.trim().length < 3) {
        return res.status(400).json({ 
            error: 'Title must be at least 3 characters' 
        });
    }
    
    if (!content || content.trim().length < 10) {
        return res.status(400).json({ 
            error: 'Content must be at least 10 characters' 
        });
    }
    
    next();
};

const validateComment = (req, res, next) => {
    const { text } = req.body;
    
    if (!text || text.trim().length < 1) {
        return res.status(400).json({ 
            error: 'Comment text is required' 
        });
    }
    
    next();
};

// ============ POSTS ENDPOINTS ============

// GET /api/posts - List all posts (with filtering and pagination)
router.get('/posts', (req, res) => {
    const { 
        authorId, 
        page = 1, 
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc'
    } = req.query;

    let filtered = [...posts];

    // Filter by author
    if (authorId) {
        filtered = filtered.filter(p => p.authorId === parseInt(authorId));
    }

    // Sort
    filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const comparison = aVal > bVal ? 1 : -1;
        return order === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = filtered.slice(startIndex, endIndex);

    res.json({
        data: paginatedPosts,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / limit)
        }
    });
});

// GET /api/posts/:id - Get single post
router.get('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
});

// POST /api/posts - Create new post
router.post('/posts', validatePost, (req, res) => {
    const { title, content } = req.body;
    
    const newPost = {
        id: nextPostId++,
        title: title.trim(),
        content: content.trim(),
        authorId: req.user?.id || 1, // From auth middleware
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    posts.push(newPost);
    
    // 201 Created with Location header
    res.status(201)
        .location(`/api/posts/${newPost.id}`)
        .json(newPost);
});

// PUT /api/posts/:id - Full update (replace entire resource)
router.put('/posts/:id', validatePost, (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    const { title, content } = req.body;
    
    posts[postIndex] = {
        ...posts[postIndex],
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date()
    };
    
    res.json(posts[postIndex]);
});

// PATCH /api/posts/:id - Partial update
router.patch('/posts/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    const { title, content } = req.body;
    
    if (title !== undefined) {
        if (title.trim().length < 3) {
            return res.status(400).json({ error: 'Title must be at least 3 characters' });
        }
        posts[postIndex].title = title.trim();
    }
    
    if (content !== undefined) {
        if (content.trim().length < 10) {
            return res.status(400).json({ error: 'Content must be at least 10 characters' });
        }
        posts[postIndex].content = content.trim();
    }
    
    posts[postIndex].updatedAt = new Date();
    
    res.json(posts[postIndex]);
});

// DELETE /api/posts/:id - Delete post
router.delete('/posts/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    // Also delete associated comments
    comments = comments.filter(c => c.postId !== parseInt(req.params.id));
    
    posts.splice(postIndex, 1);
    
    // 204 No Content (successful delete, no body)
    res.status(204).send();
});

// ============ NESTED COMMENTS ENDPOINTS ============

// GET /api/posts/:postId/comments - Get all comments for a post
router.get('/posts/:postId/comments', (req, res) => {
    const postId = parseInt(req.params.postId);
    
    // Check if post exists
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    const postComments = comments.filter(c => c.postId === postId);
    
    res.json(postComments);
});

// POST /api/posts/:postId/comments - Create comment on post
router.post('/posts/:postId/comments', validateComment, (req, res) => {
    const postId = parseInt(req.params.postId);
    
    // Check if post exists
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    const newComment = {
        id: nextCommentId++,
        postId,
        text: req.body.text.trim(),
        authorId: req.user?.id || 1,
        createdAt: new Date()
    };
    
    comments.push(newComment);
    
    res.status(201)
        .location(`/api/posts/${postId}/comments/${newComment.id}`)
        .json(newComment);
});

// GET /api/posts/:postId/comments/:commentId - Get specific comment
router.get('/posts/:postId/comments/:commentId', (req, res) => {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    
    const comment = comments.find(c => 
        c.id === commentId && c.postId === postId
    );
    
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json(comment);
});

// DELETE /api/posts/:postId/comments/:commentId
router.delete('/posts/:postId/comments/:commentId', (req, res) => {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    
    const commentIndex = comments.findIndex(c => 
        c.id === commentId && c.postId === postId
    );
    
    if (commentIndex === -1) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    
    comments.splice(commentIndex, 1);
    
    res.status(204).send();
});

module.exports = router;

// Usage in main app:
// const blogRouter = require('./routes/blog');
// app.use('/api', blogRouter);
```

---

## 3.5 Authentication & Security

### Question 33: JWT Authentication
**Question:** How do you implement JWT authentication in Node.js? What are the security best practices?

**Expected Answer:**
- JWT: JSON Web Token (header.payload.signature)
- Stateless authentication: Token contains all user info
- Flow: Login → Generate JWT → Client stores token → Send in Authorization header
- Refresh tokens for long-lived sessions
- Security: HTTPS only, short expiration, HTTP-only cookies, validate on each request
- Never store sensitive data in JWT (it's encoded, not encrypted)

**Code Challenge:**
```javascript
// Implement:
// 1. User registration with password hashing
// 2. Login endpoint with JWT generation
// 3. Protected route with JWT verification
// 4. Refresh token mechanism
// 5. Logout (token invalidation)
```

**Expected Solution:**
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '15m'; // Access token expires in 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Simulated database
const users = [];
const refreshTokens = new Set(); // In production: use Redis

// ============ Password Hashing ============
const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

// ============ JWT Helpers ============
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};

// ============ Middleware ============
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
};

// Role-based access control
const requireRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
};

// ============ Registration ============
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters' 
            });
        }

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = {
            id: users.length + 1,
            email,
            name: name || email.split('@')[0],
            password: hashedPassword,
            role: 'user',
            createdAt: new Date()
        };

        users.push(user);

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.add(refreshToken);

        // Don't send password back
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// ============ Login ============
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.add(refreshToken);

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            user: userWithoutPassword,
            accessToken,
            refreshToken
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ============ Refresh Token ============
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    // Check if token exists in our store
    if (!refreshTokens.has(refreshToken)) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Verify token
    const decoded = verifyToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh') {
        refreshTokens.delete(refreshToken); // Remove invalid token
        return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Find user
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
        return res.status(403).json({ error: 'User not found' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Replace old refresh token
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);

    res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    });
});

// ============ Logout ============
router.post('/logout', authenticateToken, (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        refreshTokens.delete(refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
});

// ============ Protected Routes ============
router.get('/me', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// Admin-only route
router.get('/admin/users', authenticateToken, requireRole('admin'), (req, res) => {
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
});

// Change password (authenticated)
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = users.find(u => u.id === req.user.id);
        
        // Verify current password
        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Validate new password
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'New password must be at least 6 characters' 
            });
        }

        // Update password
        user.password = await hashPassword(newPassword);
        user.updatedAt = new Date();

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;

// Usage in main app:
// const authRouter = require('./routes/auth');
// app.use('/api/auth', authRouter);
```

---

## 3.6 Error Handling & Validation

### Question 34: Comprehensive Error Handling
**Question:** How do you implement proper error handling in a Node.js application? What are best practices for error responses?

**Expected Answer:**
- Operational vs programmer errors
- Centralized error handling middleware
- Custom error classes for different error types
- Consistent error response format
- Log errors but don't expose internal details to client
- Handle async errors with try-catch or wrapper
- Validate input before processing

**Code Challenge:**
```javascript
// Create:
// 1. Custom error classes
// 2. Input validation middleware using Joi or custom validation
// 3. Centralized error handler
// 4. Async error wrapper
```

**Expected Solution:**
```javascript
// ============ Custom Error Classes ============
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, errors = {}) {
        super(message, 400);
        this.errors = errors;
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

// ============ Validation Schema (using Joi) ============
const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(50),
    age: Joi.number().integer().min(18).max(120)
});

const postSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(10).required(),
    tags: Joi.array().items(Joi.string()).max(5),
    published: Joi.boolean().default(false)
});

// ============ Validation Middleware ============
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            const errors = error.details.reduce((acc, detail) => {
                acc[detail.path.join('.')] = detail.message;
                return acc;
            }, {});

            throw new ValidationError('Validation failed', errors);
        }

        // Replace req.body with validated/sanitized value
        req.body = value;
        next();
    };
};

// Custom validation function
const validateCustom = (rules) => {
    return (req, res, next) => {
        const errors = {};

        for (const [field, rule] of Object.entries(rules)) {
            const value = req.body[field];

            if (rule.required && !value) {
                errors[field] = `${field} is required`;
                continue;
            }

            if (rule.type && typeof value !== rule.type) {
                errors[field] = `${field} must be a ${rule.type}`;
                continue;
            }

            if (rule.min && value.length < rule.min) {
                errors[field] = `${field} must be at least ${rule.min} characters`;
            }

            if (rule.max && value.length > rule.max) {
                errors[field] = `${field} must be at most ${rule.max} characters`;
            }

            if (rule.pattern && !rule.pattern.test(value)) {
                errors[field] = rule.message || `${field} format is invalid`;
            }
        }

        if (Object.keys(errors).length > 0) {
            throw new ValidationError('Validation failed', errors);
        }

        next();
    };
};

// ============ Async Error Wrapper ============
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// ============ Centralized Error Handler ============
const errorHandler = (err, req, res, next) => {
    let error = err;

    // Log error
    console.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id
    });

    // Handle specific error types
    if (err.name === 'CastError') {
        error = new ValidationError('Invalid ID format');
    }

    if (err.code === 11000) { // MongoDB duplicate key
        error = new ConflictError('Duplicate entry');
    }

    if (err.name === 'JsonWebTokenError') {
        error = new AuthenticationError('Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        error = new AuthenticationError('Token expired');
    }

    // Default to 500 if not operational error
    const statusCode = error.statusCode || 500;
    const message = error.isOperational 
        ? error.message 
        : 'Internal server error';

    // Response format
    const response = {
        error: {
            message,
            statusCode,
            ...(error.errors && { details: error.errors }),
            ...(process.env.NODE_ENV === 'development' && {
                stack: error.stack,
                originalError: err.message
            })
        }
    };

    res.status(statusCode).json(response);
};

// 404 handler (for routes that don't exist)
const notFoundHandler = (req, res, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
};

// ============ Example Usage ============
const express = require('express');
const app = express();

app.use(express.json());

// Routes with validation
app.post('/users', 
    validate(userSchema),
    asyncHandler(async (req, res) => {
        // Simulated async operation
        const user = await createUser(req.body);
        res.status(201).json(user);
    })
);

app.post('/posts',
    validateCustom({
        title: { required: true, type: 'string', min: 3, max: 100 },
        content: { required: true, type: 'string', min: 10 }
    }),
    asyncHandler(async (req, res) => {
        const post = await createPost(req.body);
        res.status(201).json(post);
    })
);

// Route that throws custom error
app.get('/users/:id', asyncHandler(async (req, res) => {
    const user = await findUserById(req.params.id);
    
    if (!user) {
        throw new NotFoundError('User');
    }
    
    res.json(user);
}));

// Protected route
app.delete('/posts/:id', 
    authenticateToken,
    asyncHandler(async (req, res) => {
        const post = await findPostById(req.params.id);
        
        if (!post) {
            throw new NotFoundError('Post');
        }
        
        if (post.authorId !== req.user.id) {
            throw new AuthorizationError('You can only delete your own posts');
        }
        
        await deletePost(req.params.id);
        res.status(204).send();
    })
);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // In production, you might want to restart the process
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

module.exports = {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    validate,
    validateCustom,
    asyncHandler,
    errorHandler,
    notFoundHandler
};
```

---

## 3.7 Environment & Configuration

### Question 35: Environment Variables & Configuration Management
**Question:** How do you manage environment-specific configuration in Node.js? What are the best practices for secrets and sensitive data?

**Expected Answer:**
- Use `process.env` for environment variables
- `.env` files with `dotenv` package (never commit `.env`)
- Different configs for dev/staging/production
- Never hardcode secrets
- Use environment variable validation
- Config as code pattern

**Code Challenge:**
```javascript
// Create:
// 1. Environment configuration system with validation
// 2. Different configs for different environments
// 3. Secrets management best practices
```

**Expected Solution:**
```javascript
// ============ config/index.js ============
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'test' 
    ? '.env.test' 
    : process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env';

dotenv.config({ path: path.join(__dirname, '..', envFile) });

// Validation schema for environment variables
const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    
    PORT: Joi.number().port().default(3000),
    
    DATABASE_URL: Joi.string().uri().required(),
    
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),
    
    REDIS_URL: Joi.string().uri(),
    
    AWS_ACCESS_KEY_ID: Joi.string().when('NODE_ENV', {
        is: 'production',
        then: Joi.required()
    }),
    AWS_SECRET_ACCESS_KEY: Joi.string().when('NODE_ENV', {
        is: 'production',
        then: Joi.required()
    }),
    AWS_REGION: Joi.string().default('us-east-1'),
    S3_BUCKET: Joi.string(),
    
    SMTP_HOST: Joi.string(),
    SMTP_PORT: Joi.number().port().default(587),
    SMTP_USER: Joi.string(),
    SMTP_PASSWORD: Joi.string(),
    EMAIL_FROM: Joi.string().email(),
    
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'debug')
        .default('info'),
    
    CORS_ORIGIN: Joi.string().default('*'),
    
    RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000), // 15 minutes
    RATE_LIMIT_MAX: Joi.number().default(100)
}).unknown(); // Allow other env vars

// Validate environment variables
const { error, value: env } = envSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: false
});

if (error) {
    const errors = error.details.map(detail => detail.message).join(', ');
    throw new Error(`Environment validation error: ${errors}`);
}

// Configuration object
const config = {
    env: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    
    server: {
        port: env.PORT,
        corsOrigin: env.CORS_ORIGIN
    },
    
    database: {
        url: env.DATABASE_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: env.NODE_ENV === 'production' ? 10 : 5
        }
    },
    
    jwt: {
        secret: env.JWT_SECRET,
        accessTokenExpiry: env.JWT_EXPIRES_IN,
        refreshTokenExpiry: env.REFRESH_TOKEN_EXPIRES_IN
    },
    
    redis: {
        url: env.REDIS_URL
    },
    
    aws: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        region: env.AWS_REGION,
        s3Bucket: env.S3_BUCKET
    },
    
    email: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD
        },
        from: env.EMAIL_FROM
    },
    
    logging: {
        level: env.LOG_LEVEL
    },
    
    rateLimit: {
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        max: env.RATE_LIMIT_MAX
    }
};

// Freeze config to prevent modifications
Object.freeze(config);

module.exports = config;

// ============ .env.example (template for developers) ============
/*
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=mongodb://localhost:27017/myapp

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379

# AWS (production only)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET=

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@example.com

# Logging
LOG_LEVEL=info

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
*/

// ============ Usage Example ============
const config = require('./config');
const express = require('express');

const app = express();

// Use config throughout your app
app.listen(config.server.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.server.port}`);
});

// Database connection
const mongoose = require('mongoose');
mongoose.connect(config.database.url, config.database.options);

// AWS S3 client
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
});

// ============ Secrets Management (Production) ============
// For production, use AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault

const AWS = require('aws-sdk');

async function getSecrets() {
    const secretsManager = new AWS.SecretsManager({
        region: process.env.AWS_REGION
    });

    try {
        const data = await secretsManager.getSecretValue({
            SecretId: 'myapp/production'
        }).promise();

        const secrets = JSON.parse(data.SecretString);
        return secrets;
    } catch (err) {
        console.error('Error fetching secrets:', err);
        throw err;
    }
}

// Load secrets in production
if (config.isProduction) {
    getSecrets().then(secrets => {
        process.env.JWT_SECRET = secrets.JWT_SECRET;
        process.env.DATABASE_URL = secrets.DATABASE_URL;
        // Update config with secrets
    });
}
```

---

## 3.8 Package Management & Versioning

### Question 36: NPM & Semantic Versioning
**Question:** Explain semantic versioning (semver) in Node.js. How do `package.json` and `package-lock.json` work? What's the difference between `dependencies`, `devDependencies`, `peerDependencies` and `optionalDependencies`?

**Expected Answer:**
- **Semver format:** MAJOR.MINOR.PATCH (1.2.3)
    - MAJOR: Breaking changes
    - MINOR: New features, backward compatible
    - PATCH: Bug fixes, backward compatible
- **Version ranges:**
    - `^1.2.3` - Compatible with 1.x.x (>=1.2.3 <2.0.0)
    - `~1.2.3` - Approximately equivalent (>=1.2.3 <1.3.0)
    - `1.2.3` - Exact version
- **package-lock.json:** Locks exact versions of entire dependency tree
- **dependencies:** Required for production
- **devDependencies:** Only needed for development (`npm ci --omit=dev` skips them in production)
- **peerDependencies:** "the host app must provide this". Used by plugins/libraries (React components, ESLint plugins) so the app doesn't end up with two copies. npm 7+ installs peers automatically and fails with `ERESOLVE` on conflicts (`--legacy-peer-deps` restores the old behavior). Use `peerDependenciesMeta` to mark one optional
- **optionalDependencies:** install failure doesn't fail `npm install` (e.g. native add-ons); code must handle the module being missing
- **bundleDependencies:** packed into the tarball when you publish

**Code Challenge:**
```javascript
// Explain these package.json entries and when to use each:
{
    "dependencies": {
        "express": "^4.18.0",
        "mongoose": "~6.5.0",
        "jsonwebtoken": "8.5.1"
    },
    "devDependencies": {
        "nodemon": "^2.0.20",
        "jest": "^29.0.0",
        "eslint": "^8.0.0"
    }
}

// Also: Create a publishable NPM package with proper structure
// Also: you publish a React component library. Where does `react` go in its package.json, and why?
```

**Expected Solution:**
```javascript
// ============ Version Range Explanations ============
/*
"express": "^4.18.0"
- Caret (^): Compatible with version (won't upgrade MAJOR)
- Will install: 4.18.0 <= version < 5.0.0
- Good for: Most dependencies, gets bug fixes and new features
- Updates to: 4.18.1, 4.19.0, 4.20.0, but NOT 5.0.0

"mongoose": "~6.5.0"
- Tilde (~): Approximately equivalent (won't upgrade MINOR)
- Will install: 6.5.0 <= version < 6.6.0
- Good for: More conservative updates, only patch releases
- Updates to: 6.5.1, 6.5.2, but NOT 6.6.0

"jsonwebtoken": "8.5.1"
- Exact version: No updates
- Will install: Exactly 8.5.1
- Good for: Critical dependencies, reproducible builds
- Never updates automatically
*/

// ============ NPM Package Structure ============
// my-package/
// ├── package.json
// ├── README.md
// ├── LICENSE
// ├── .npmignore
// ├── .gitignore
// ├── src/
// │   └── index.js
// ├── test/
// │   └── index.test.js
// └── examples/
//     └── basic.js

// ============ package.json for publishable package ============
{
    "name": "@myorg/my-awesome-package",
    "version": "1.0.0",
    "description": "A useful utility package",
    "main": "dist/index.js",           // CommonJS entry point
    "module": "dist/index.esm.js",     // ES Module entry point
    "types": "dist/index.d.ts",        // TypeScript definitions
    "files": [
        "dist",
        "README.md",
        "LICENSE"
    ],
    "scripts": {
        "build": "rollup -c",
        "test": "jest",
        "test:watch": "jest --watch",
        "lint": "eslint src/**/*.js",
        "prepublishOnly": "npm test && npm run build",
        "version": "npm run build && git add -A dist",
        "postversion": "git push && git push --tags"
    },
    "keywords": [
        "utility",
        "helper",
        "tool"
    ],
    "author": "Your Name <you@example.com>",
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "https://github.com/myorg/my-package.git"
    },
    "bugs": {
        "url": "https://github.com/myorg/my-package/issues"
    },
    "homepage": "https://github.com/myorg/my-package#readme",
    "engines": {
        "node": ">=14.0.0",
        "npm": ">=6.0.0"
    },
    "dependencies": {
        "lodash": "^4.17.21"
    },
    "devDependencies": {
        "@babel/core": "^7.20.0",
        "@babel/preset-env": "^7.20.0",
        "eslint": "^8.30.0",
        "jest": "^29.3.0",
        "rollup": "^3.9.0"
    },
    "peerDependencies": {
        "react": "^18.0.0"
    }
}

// ============ .npmignore ============
/*
# Don't publish these to NPM
src/
test/
examples/
.github/
*.test.js
.eslintrc.js
rollup.config.js
.env
.env.*
node_modules/
*/

// ============ Publishing Commands ============
/*
# Initial setup
npm login

# Check what will be published
npm pack --dry-run

# Version bump (automatically commits and tags)
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0

# Publish
npm publish --access public  # For scoped packages

# Unpublish (within 72 hours)
npm unpublish @myorg/my-package@1.0.0
*/

// ============ Using Private Registry ============
// .npmrc
/*
@myorg:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
*/

// ============ Package Usage Examples ============
// For users of your package

// CommonJS
const myPackage = require('@myorg/my-awesome-package');
myPackage.doSomething();

// ES Modules
import { doSomething } from '@myorg/my-awesome-package';
doSomething();

// TypeScript (with types)
import { doSomething, SomeInterface } from '@myorg/my-awesome-package';
const result: SomeInterface = doSomething();

// ============ peerDependencies (React component library) ============
{
    "name": "@myorg/ui-kit",
    "peerDependencies": { "react": "^18.0.0 || ^19.0.0" }, // the app provides React
    "devDependencies": { "react": "^19.0.0" }               // so the library's own tests can run
}
// Putting react in "dependencies" could install a second copy → "Invalid hook call" errors
```

**Evaluation Criteria:**
- Reads ^, ~ and exact ranges correctly
- Knows the lockfile's role and `npm ci` vs `npm install`
- Places packages in the right dependency section, peerDependencies included

---

## 3.9 Testing in Node.js

### Question 37: Unit & Integration Testing
**Question:** How do you test Node.js applications? Explain unit tests, integration tests, and mocking.

**Expected Answer:**
- **Unit tests:** Test individual functions/modules in isolation
- **Integration tests:** Test how components work together
- **Test frameworks:** Jest, Mocha, Chai
- **Mocking:** Simulate dependencies (database, APIs) without actually calling them
- **Test coverage:** Measure percentage of code covered by tests
- **TDD:** Test-driven development (write tests first)

**Code Challenge:**
```javascript
// Write tests for:
// 1. A utility function (unit test)
// 2. API endpoint (integration test)
// 3. Mock external API calls
// 4. Test error scenarios
```

**Expected Solution:**
```javascript
// ============ Setup (package.json scripts) ============
/*
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "test:integration": "jest --testPathPattern=integration"
    },
    "jest": {
        "testEnvironment": "node",
        "coveragePathIgnorePatterns": ["/node_modules/"],
        "testMatch": ["**/__tests__/**/*.test.js"]
    }
}
*/

// ============ 1. Unit Test - Utility Functions ============
// src/utils/math.js
const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
};

module.exports = { sum, multiply, divide };

// __tests__/unit/math.test.js
const { sum, multiply, divide } = require('../../src/utils/math');

describe('Math utilities', () => {
        describe('sum', () => {
                it('should add two positive numbers', () => {
                        expect(sum(2, 3)).toBe(5);
                });

                it('should handle negative numbers', () => {
                        expect(sum(-2, 3)).toBe(1);
                });

                it('should handle zero', () => {
                        expect(sum(0, 5)).toBe(5);
                });
        });

        describe('multiply', () => {
                it('should multiply two numbers', () => {
                        expect(multiply(3, 4)).toBe(12);
                });

                it('should return zero when multiplying by zero', () => {
                        expect(multiply(5, 0)).toBe(0);
                });
        });

        describe('divide', () => {
                it('should divide two numbers', () => {
                        expect(divide(10, 2)).toBe(5);
                });

                it('should throw error when dividing by zero', () => {
                        expect(() => divide(10, 0)).toThrow('Division by zero');
                });

                it('should handle decimal results', () => {
                        expect(divide(7, 2)).toBe(3.5);
                });
        });
});

// ============ 2. Unit Test - User Service ============
// src/services/userService.js
class UserService {
        constructor(userRepository) {
                this.userRepository = userRepository;
        }

        async createUser(userData) {
                // Validate
                if (!userData.email) {
                        throw new Error('Email is required');
                }

                // Check if exists
                const existing = await this.userRepository.findByEmail(userData.email);
                if (existing) {
                        throw new Error('Email already exists');
                }

                // Create user
                const user = await this.userRepository.create(userData);
                return user;
        }

        async getUserById(id) {
                const user = await this.userRepository.findById(id);
                if (!user) {
                        throw new Error('User not found');
                }
                return user;
        }
}

module.exports = UserService;

// __tests__/unit/userService.test.js
const UserService = require('../../src/services/userService');

describe('UserService', () => {
        let userService;
        let mockUserRepository;

        beforeEach(() => {
                // Create mock repository
                mockUserRepository = {
                        findByEmail: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn()
                };

                userService = new UserService(mockUserRepository);
        });

        afterEach(() => {
                jest.clearAllMocks();
        });

        describe('createUser', () => {
                it('should create a new user', async () => {
                        const userData = { email: 'test@example.com', name: 'Test' };
                        const createdUser = { id: 1, ...userData };

                        mockUserRepository.findByEmail.mockResolvedValue(null);
                        mockUserRepository.create.mockResolvedValue(createdUser);

                        const result = await userService.createUser(userData);

                        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
                        expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
                        expect(result).toEqual(createdUser);
                });

                it('should throw error if email is missing', async () => {
                        await expect(userService.createUser({}))
                                .rejects.toThrow('Email is required');
                });

                it('should throw error if email already exists', async () => {
                        const userData = { email: 'existing@example.com' };
                        mockUserRepository.findByEmail.mockResolvedValue({ id: 1 });

                        await expect(userService.createUser(userData))
                                .rejects.toThrow('Email already exists');
                });
        });

        describe('getUserById', () => {
                it('should return user when found', async () => {
                        const user = { id: 1, name: 'Test' };
                        mockUserRepository.findById.mockResolvedValue(user);

                        const result = await userService.getUserById(1);

                        expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
                        expect(result).toEqual(user);
                });

                it('should throw error when user not found', async () => {
                        mockUserRepository.findById.mockResolvedValue(null);

                        await expect(userService.getUserById(999))
                                .rejects.toThrow('User not found');
                });
        });
});

// ============ 3. Integration Test - API Endpoints ============
// __tests__/integration/api.test.js
const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const User = require('../../src/models/User');

describe('User API Integration Tests', () => {
        // Setup test database
        beforeAll(async () => {
                await mongoose.connect(process.env.TEST_DATABASE_URL, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                });
        });

        afterAll(async () => {
                await mongoose.connection.close();
        });

        beforeEach(async () => {
                // Clear database before each test
                await User.deleteMany({});
        });

        describe('POST /api/users', () => {
                it('should create a new user', async () => {
                        const userData = {
                                email: 'test@example.com',
                                password: 'password123',
                                name: 'Test User'
                        };

                        const response = await request(app)
                                .post('/api/users')
                                .send(userData)
                                .expect(201)
                                .expect('Content-Type', /json/);

                        expect(response.body).toHaveProperty('id');
                        expect(response.body.email).toBe(userData.email);
                        expect(response.body).not.toHaveProperty('password');

                        // Verify in database
                        const user = await User.findById(response.body.id);
                        expect(user).toBeTruthy();
                        expect(user.email).toBe(userData.email);
                });

                it('should return 400 for invalid email', async () => {
                        const response = await request(app)
                                .post('/api/users')
                                .send({ email: 'invalid', password: 'password123' })
                                .expect(400);

                        expect(response.body).toHaveProperty('error');
                });

                it('should return 409 for duplicate email', async () => {
                        const userData = {
                                email: 'duplicate@example.com',
                                password: 'password123'
                        };

                        // Create first user
                        await request(app).post('/api/users').send(userData).expect(201);

                        // Try to create duplicate
                        const response = await request(app)
                                .post('/api/users')
                                .send(userData)
                                .expect(409);

                        expect(response.body.error).toContain('already exists');
                });
        });

        describe('GET /api/users/:id', () => {
                it('should get user by id', async () => {
                        // Create user first
                        const user = await User.create({
                                email: 'test@example.com',
                                password: 'hashed',
                                name: 'Test'
                        });

                        const response = await request(app)
                                .get(`/api/users/${user._id}`)
                                .expect(200);

                        expect(response.body.id).toBe(user._id.toString());
                        expect(response.body.email).toBe(user.email);
                });

                it('should return 404 for non-existent user', async () => {
                        const fakeId = new mongoose.Types.ObjectId();
                        await request(app)
                                .get(`/api/users/${fakeId}`)
                                .expect(404);
                });
        });

        describe('Authentication', () => {
                let authToken;

                beforeEach(async () => {
                        // Create user and get token
                        const response = await request(app)
                                .post('/api/auth/register')
                                .send({
                                        email: 'auth@example.com',
                                        password: 'password123'
                                });

                        authToken = response.body.accessToken;
                });

                it('should access protected route with valid token', async () => {
                        await request(app)
                                .get('/api/profile')
                                .set('Authorization', `Bearer ${authToken}`)
                                .expect(200);
                });

                it('should return 401 without token', async () => {
                        await request(app)
                                .get('/api/profile')
                                .expect(401);
                });

                it('should return 403 with invalid token', async () => {
                        await request(app)
                                .get('/api/profile')
                                .set('Authorization', 'Bearer invalid-token')
                                .expect(403);
                });
        });
});

// ============ 4. Mocking External APIs ============
// src/services/weatherService.js
const axios = require('axios');

class WeatherService {
        constructor(apiKey) {
                this.apiKey = apiKey;
                this.baseUrl = 'https://api.weather.com';
        }

        async getWeather(city) {
                try {
                        const response = await axios.get(`${this.baseUrl}/weather`, {
                                params: { city, apiKey: this.apiKey }
                        });
                        return response.data;
                } catch (error) {
                        throw new Error('Failed to fetch weather data');
                }
        }
}

module.exports = WeatherService;

// __tests__/unit/weatherService.test.js
const axios = require('axios');
const WeatherService = require('../../src/services/weatherService');

// Mock axios
jest.mock('axios');

describe('WeatherService', () => {
        let weatherService;

        beforeEach(() => {
                weatherService = new WeatherService('test-api-key');
                jest.clearAllMocks();
        });

        describe('getWeather', () => {
                it('should fetch weather data successfully', async () => {
                        const mockWeatherData = {
                                city: 'London',
                                temperature: 20,
                                conditions: 'Sunny'
                        };

                        axios.get.mockResolvedValue({ data: mockWeatherData });

                        const result = await weatherService.getWeather('London');

                        expect(axios.get).toHaveBeenCalledWith(
                                'https://api.weather.com/weather',
                                {
                                        params: {
                                                city: 'London',
                                                apiKey: 'test-api-key'
                                        }
                                }
                        );
                        expect(result).toEqual(mockWeatherData);
                });

                it('should handle API errors', async () => {
                        axios.get.mockRejectedValue(new Error('Network error'));

                        await expect(weatherService.getWeather('London'))
                                .rejects.toThrow('Failed to fetch weather data');
                });

                it('should call API with correct parameters', async () => {
                        axios.get.mockResolvedValue({ data: {} });

                        await weatherService.getWeather('Paris');

                        expect(axios.get).toHaveBeenCalledWith(
                                expect.any(String),
                                expect.objectContaining({
                                        params: expect.objectContaining({
                                                city: 'Paris'
                                        })
                                })
                        );
                });
        });
});

// ============ 5. Test Helpers & Setup Files ============
// __tests__/setup.js
// Global test setup
beforeAll(() => {
        // Set test environment variables
        process.env.NODE_ENV = 'test';
        process.env.JWT_SECRET = 'test-secret';
});

afterAll(() => {
        // Cleanup
});

// __tests__/helpers/testHelpers.js
const jwt = require('jsonwebtoken');

const generateTestToken = (user) => {
        return jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
        );
};

const createTestUser = async (overrides = {}) => {
        return {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                ...overrides
        };
};

module.exports = {
        generateTestToken,
        createTestUser
};

// ============ 6. Snapshot Testing ============
// __tests__/snapshots/apiResponse.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('API Response Snapshots', () => {
        it('should match user response snapshot', async () => {
                const response = await request(app)
                        .get('/api/users/1')
                        .expect(200);

                expect(response.body).toMatchSnapshot();
        });
});

// ============ 7. Testing Async Operations ============
describe('Async Tests', () => {
        // Using async/await
        it('should handle async operation', async () => {
                const result = await someAsyncFunction();
                expect(result).toBe('expected');
        });

        // Using done callback
        it('should handle callback', (done) => {
                someCallbackFunction((err, result) => {
                        expect(err).toBeNull();
                        expect(result).toBe('expected');
                        done();
                });
        });

        // Testing promises
        it('should resolve promise', () => {
                return expect(somePromiseFunction()).resolves.toBe('expected');
        });

        it('should reject promise', () => {
                return expect(somePromiseFunction()).rejects.toThrow('Error');
        });
});
```

**Evaluation Criteria:**
- Test coverage and edge cases
- Proper mocking of dependencies
- Testing both success and error scenarios
- Integration test setup and teardown
- Assertion clarity and specificity

---

# SECTION 4: Databases & Data Persistence

---

## 4.1 SQL vs NoSQL Fundamentals

### Question 38: Database Paradigm Selection
**Question:** What are the key differences between SQL and NoSQL databases? When would you choose one over the other? Explain ACID vs BASE properties.

**Expected Answer:**
- **SQL (Relational):**
    - Structured schema, tables with rows/columns
    - Relations via foreign keys
    - ACID transactions (Atomicity, Consistency, Isolation, Durability)
    - Strong consistency
    - Examples: PostgreSQL, MySQL, SQL Server
    - Best for: Complex queries, transactions, strict data integrity

- **NoSQL:**
    - Flexible/dynamic schema
    - Types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j)
    - BASE properties (Basically Available, Soft state, Eventually consistent)
    - Horizontal scalability
    - Best for: Large scale, flexible data, high throughput, denormalized data

- **ACID vs BASE:**
    - ACID: Strong consistency, immediate writes visible
    - BASE: Eventual consistency, prioritizes availability

**Code Challenge:**
```javascript
// Given this e-commerce scenario, design data models for both SQL and NoSQL:
// - Users with profiles
// - Products with categories
// - Orders with multiple items
// - Reviews for products
// Explain trade-offs of each approach
```

**Expected Solution:**
```javascript
// ============ SQL Design (PostgreSQL) ============
/*
CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        parent_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        category_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
*/

// Node.js with PostgreSQL (using pg library)
const { Pool } = require('pg');

const pool = new Pool({
        host: 'localhost',
        database: 'ecommerce',
        user: 'postgres',
        password: 'password',
        port: 5432
});

// Get product with category and average rating
async function getProductDetails(productId) {
        const query = `
                SELECT 
                        p.id,
                        p.name,
                        p.description,
                        p.price,
                        p.stock,
                        c.name as category_name,
                        AVG(r.rating) as avg_rating,
                        COUNT(r.id) as review_count
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN reviews r ON p.id = r.product_id
                WHERE p.id = $1
                GROUP BY p.id, c.name
        `;
        
        const result = await pool.query(query, [productId]);
        return result.rows[0];
}

// Create order with transaction
async function createOrder(userId, items) {
        const client = await pool.connect();
        
        try {
                await client.query('BEGIN');
                
                // Calculate total
                let total = 0;
                for (const item of items) {
                        const { rows } = await client.query(
                                'SELECT price, stock FROM products WHERE id = $1',
                                [item.productId]
                        );
                        
                        if (!rows[0] || rows[0].stock < item.quantity) {
                                throw new Error('Insufficient stock');
                        }
                        
                        total += rows[0].price * item.quantity;
                }
                
                // Create order
                const orderResult = await client.query(
                        'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id',
                        [userId, total]
                );
                
                const orderId = orderResult.rows[0].id;
                
                // Insert order items and update stock
                for (const item of items) {
                        await client.query(
                                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, (SELECT price FROM products WHERE id = $2))',
                                [orderId, item.productId, item.quantity]
                        );
                        
                        await client.query(
                                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                                [item.quantity, item.productId]
                        );
                }
                
                await client.query('COMMIT');
                return orderId;
                
        } catch (err) {
                await client.query('ROLLBACK');
                throw err;
        } finally {
                client.release();
        }
}

// ============ NoSQL Design (MongoDB) ============
// Mongoose schemas
const mongoose = require('mongoose');

// Embedded approach - denormalize for read performance
const userSchema = new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        profile: {
                firstName: String,
                lastName: String,
                avatar: String
        },
        addresses: [{
                street: String,
                city: String,
                country: String,
                postalCode: String,
                isDefault: Boolean
        }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        category: {
                id: mongoose.Schema.Types.ObjectId,
                name: String,
                slug: String
        },
        images: [String],
        // Denormalized for quick access
        avgRating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        // Embed user info (snapshot at time of order)
        userSnapshot: {
                email: String,
                name: String
        },
        items: [{
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                // Snapshot product data at time of purchase
                productSnapshot: {
                        name: String,
                        price: Number,
                        image: String
                },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
        }],
        totalAmount: { type: Number, required: true },
        status: { 
                type: String, 
                enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
                default: 'pending'
        },
        shippingAddress: {
                street: String,
                city: String,
                country: String,
                postalCode: String
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        userSnapshot: {
                name: String,
                avatar: String
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: String,
        helpful: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
});

// Compound index to ensure one review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Review = mongoose.model('Review', reviewSchema);

// MongoDB operations
async function getProductDetailsNoSQL(productId) {
        // Single document read - very fast
        const product = await Product.findById(productId);
        
        // Optionally fetch recent reviews separately
        const reviews = await Review.find({ productId })
                .sort({ createdAt: -1 })
                .limit(10);
        
        return { product, reviews };
}

async function createOrderNoSQL(userId, items) {
        // No multi-document transactions needed due to denormalization
        const user = await User.findById(userId);
        
        let totalAmount = 0;
        const orderItems = [];
        
        for (const item of items) {
                const product = await Product.findById(item.productId);
                
                if (!product || product.stock < item.quantity) {
                        throw new Error('Insufficient stock');
                }
                
                const price = product.price;
                totalAmount += price * item.quantity;
                
                // Snapshot product data
                orderItems.push({
                        productId: product._id,
                        productSnapshot: {
                                name: product.name,
                                price: product.price,
                                image: product.images[0]
                        },
                        quantity: item.quantity,
                        price: price
                });
                
                // Update stock
                await Product.findByIdAndUpdate(product._id, {
                        $inc: { stock: -item.quantity }
                });
        }
        
        const order = await Order.create({
                userId: user._id,
                userSnapshot: {
                        email: user.email,
                        name: `${user.profile.firstName} ${user.profile.lastName}`
                },
                items: orderItems,
                totalAmount,
                shippingAddress: user.addresses.find(a => a.isDefault)
        });
        
        return order;
}

// ============ Trade-offs Analysis ============
/*
SQL Advantages:
✓ Strong consistency and ACID guarantees
✓ Complex joins and aggregations
✓ Data integrity through foreign keys
✓ No data duplication
✓ Better for transactional systems
✓ Standardized query language

SQL Disadvantages:
✗ Rigid schema (migrations needed)
✗ Vertical scaling challenges
✗ Complex queries can be slow
✗ Joins can be expensive at scale

NoSQL Advantages:
✓ Flexible schema (easy to evolve)
✓ Horizontal scaling (sharding)
✓ Fast reads (denormalized data)
✓ High throughput
✓ Better for hierarchical data
✓ Built for distributed systems

NoSQL Disadvantages:
✗ Data duplication
✗ Manual consistency management
✗ No joins (need multiple queries or denormalization)
✗ Eventual consistency
✗ More complex updates

For this e-commerce scenario:
- SQL better for: Order transactions, inventory management
- NoSQL better for: Product catalog, user profiles, read-heavy operations
- Hybrid approach: Use both (SQL for transactions, NoSQL for catalog)
*/

module.exports = {
        // SQL
        pool,
        getProductDetails,
        createOrder,
        // NoSQL
        User,
        Product,
        Order,
        Review,
        getProductDetailsNoSQL,
        createOrderNoSQL
};
```

---

## 4.2 Schema Design & Data Modeling

### Question 39: Normalization vs Denormalization
**Question:** Explain database normalization (1NF, 2NF, 3NF). When should you denormalize data? How do you design schemas for optimal query performance?

**Expected Answer:**
- **Normalization:** Organizing data to reduce redundancy
    - 1NF: Atomic values, no repeating groups
    - 2NF: 1NF + no partial dependencies
    - 3NF: 2NF + no transitive dependencies
- **Denormalization:** Intentionally duplicating data for performance
- **When to denormalize:** Read-heavy workloads, reduce joins, improve query speed
- **Trade-offs:** Storage space vs query performance, consistency challenges

**Code Challenge:**
```javascript
// Design schemas for a social media platform:
// 1. Users, Posts, Comments, Likes
// 2. Show normalized SQL design
// 3. Show denormalized NoSQL design
// 4. Explain when to update denormalized data
```

**Expected Solution:**
```javascript
// ============ Normalized SQL Design (3NF) ============
/*
-- Users table
CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes table (junction table)
CREATE TABLE likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, post_id)
);

-- Follows table (self-referencing many-to-many)
CREATE TABLE follows (
        follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_id, following_id),
        CHECK (follower_id != following_id)
);

-- Indexes for common queries
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- Materialized view for post counts (denormalization for performance)
CREATE MATERIALIZED VIEW post_stats AS
SELECT 
        p.id as post_id,
        p.user_id,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT c.id) as comment_count
FROM posts p
LEFT JOIN likes l ON p.id = l.post_id
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, p.user_id;

CREATE UNIQUE INDEX idx_post_stats_id ON post_stats(post_id);
*/

// SQL query to get feed (complex join)
const { Pool } = require('pg');
const pool = new Pool();

async function getUserFeed(userId, limit = 20, offset = 0) {
        const query = `
                SELECT 
                        p.id,
                        p.content,
                        p.image_url,
                        p.created_at,
                        u.username,
                        u.avatar_url,
                        ps.like_count,
                        ps.comment_count,
                        EXISTS(SELECT 1 FROM likes WHERE user_id = $1 AND post_id = p.id) as is_liked
                FROM posts p
                INNER JOIN users u ON p.user_id = u.id
                INNER JOIN follows f ON p.user_id = f.following_id AND f.follower_id = $1
                LEFT JOIN post_stats ps ON p.id = ps.post_id
                ORDER BY p.created_at DESC
                LIMIT $2 OFFSET $3
        `;
        
        const result = await pool.query(query, [userId, limit, offset]);
        return result.rows;
}

// ============ Denormalized NoSQL Design (MongoDB) ============
const mongoose = require('mongoose');

// User schema with embedded follower/following counts
const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        avatarUrl: String,
        bio: String,
        // Denormalized counts for quick access
        stats: {
                postCount: { type: Number, default: 0 },
                followerCount: { type: Number, default: 0 },
                followingCount: { type: Number, default: 0 }
        },
        createdAt: { type: Date, default: Date.now }
});

// Post schema with embedded user info and counts
const postSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        // Denormalized user data (snapshot at post creation)
        author: {
                username: String,
                avatarUrl: String
        },
        content: { type: String, required: true },
        imageUrl: String,
        // Denormalized engagement metrics
        stats: {
                likeCount: { type: Number, default: 0 },
                commentCount: { type: Number, default: 0 }
        },
        // Store recent likes for quick "who liked this" queries
        recentLikes: [{
                userId: mongoose.Schema.Types.ObjectId,
                username: String,
                timestamp: Date
        }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
});

// Comment schema with embedded data
const commentSchema = new mongoose.Schema({
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
        // Denormalized user info
        author: {
                username: String,
                avatarUrl: String
        },
        content: { type: String, required: true },
        // Nested replies (limited depth to avoid deep nesting)
        replies: [{
                userId: mongoose.Schema.Types.ObjectId,
                author: {
                        username: String,
                        avatarUrl: String
                },
                content: String,
                createdAt: Date
        }],
        createdAt: { type: Date, default: Date.now }
});

// Like document (separate collection for flexibility)
const likeSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        createdAt: { type: Date, default: Date.now }
});

// Compound index for uniqueness and queries
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });
likeSchema.index({ postId: 1, createdAt: -1 });

// Follow relationship
const followSchema = new mongoose.Schema({
        followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now }
});

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
followSchema.index({ followerId: 1 });
followSchema.index({ followingId: 1 });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Like = mongoose.model('Like', likeSchema);
const Follow = mongoose.model('Follow', followSchema);

// Indexes for queries
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
commentSchema.index({ postId: 1, createdAt: -1 });

// Get user feed (simpler query due to denormalization)
async function getUserFeedNoSQL(userId, limit = 20, skip = 0) {
        // Get list of users the current user follows
        const follows = await Follow.find({ followerId: userId })
                .select('followingId')
                .lean();
        
        const followingIds = follows.map(f => f.followingId);
        
        // Get posts from followed users (single query, no joins)
        const posts = await Post.find({ userId: { $in: followingIds } })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();
        
        // Check which posts the user has liked
        const postIds = posts.map(p => p._id);
        const userLikes = await Like.find({ 
                userId, 
                postId: { $in: postIds } 
        })
                .select('postId')
                .lean();
        
        const likedPostIds = new Set(userLikes.map(l => l.postId.toString()));
        
        // Add isLiked flag to posts
        return posts.map(post => ({
                ...post,
                isLiked: likedPostIds.has(post._id.toString())
        }));
}

// ============ Maintaining Denormalized Data ============

// When user updates profile, update all their posts/comments
async function updateUserProfile(userId, updates) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
                // Update user
                const user = await User.findByIdAndUpdate(
                        userId,
                        updates,
                        { new: true, session }
                );
                
                // Update denormalized author data in posts
                if (updates.username || updates.avatarUrl) {
                        await Post.updateMany(
                                { userId },
                                { 
                                        $set: {
                                                'author.username': user.username,
                                                'author.avatarUrl': user.avatarUrl
                                        }
                                },
                                { session }
                        );
                        
                        // Update denormalized author data in comments
                        await Comment.updateMany(
                                { userId },
                                {
                                        $set: {
                                                'author.username': user.username,
                                                'author.avatarUrl': user.avatarUrl
                                        }
                                },
                                { session }
                        );
                }
                
                await session.commitTransaction();
                return user;
                
        } catch (error) {
                await session.abortTransaction();
                throw error;
        } finally {
                session.endSession();
        }
}

// When post is liked, update denormalized counts
async function likePost(userId, postId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
                // Create like document
                const like = await Like.create([{ userId, postId }], { session });
                
                // Get user info for recent likes
                const user = await User.findById(userId).select('username').session(session);
                
                // Increment like count and add to recent likes
                await Post.findByIdAndUpdate(
                        postId,
                        {
                                $inc: { 'stats.likeCount': 1 },
                                $push: {
                                        recentLikes: {
                                                $each: [{
                                                        userId,
                                                        username: user.username,
                                                        timestamp: new Date()
                                                }],
                                                $position: 0,
                                                $slice: 10 // Keep only 10 most recent
                                        }
                                }
                        },
                        { session }
                );
                
                await session.commitTransaction();
                return like;
                
        } catch (error) {
                await session.abortTransaction();
                throw error;
        } finally {
                session.endSession();
        }
}

// When post is unliked
async function unlikePost(userId, postId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
                // Remove like document
                await Like.deleteOne({ userId, postId }, { session });
                
                // Decrement count and remove from recent likes
                await Post.findByIdAndUpdate(
                        postId,
                        {
                                $inc: { 'stats.likeCount': -1 },
                                $pull: { recentLikes: { userId } }
                        },
                        { session }
                );
                
                await session.commitTransaction();
                
        } catch (error) {
                await session.abortTransaction();
                throw error;
        } finally {
                session.endSession();
        }
}

// When comment is added
async function addComment(userId, postId, content, parentCommentId = null) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
                const user = await User.findById(userId)
                        .select('username avatarUrl')
                        .session(session);
                
                const comment = await Comment.create([{
                        postId,
                        userId,
                        parentCommentId,
                        author: {
                                username: user.username,
                                avatarUrl: user.avatarUrl
                        },
                        content
                }], { session });
                
                // Increment comment count on post
                await Post.findByIdAndUpdate(
                        postId,
                        { $inc: { 'stats.commentCount': 1 } },
                        { session }
                );
                
                await session.commitTransaction();
                return comment[0];
                
        } catch (error) {
                await session.abortTransaction();
                throw error;
        } finally {
                session.endSession();
        }
}

// ============ Performance Comparison ============
/*
Query Performance:

SQL (Normalized):
- Feed query requires multiple joins (posts, users, likes, follows)
- Complex aggregations for counts
- More database round trips
- Better data consistency

NoSQL (Denormalized):
- Feed query is simpler (minimal joins)
- Counts are pre-calculated
- Fewer database queries
- Faster reads, but more complex writes

When to Denormalize:
✓ Read-heavy workloads (social feeds)
✓ Data rarely changes (user profiles in posts)
✓ Need fast queries
✓ Can tolerate eventual consistency

When to Keep Normalized:
✓ Write-heavy workloads
✓ Data changes frequently
✓ Strong consistency required
✓ Complex reporting needs
*/

module.exports = {
        // SQL
        getUserFeed,
        // NoSQL
        User,
        Post,
        Comment,
        Like,
        Follow,
        getUserFeedNoSQL,
        updateUserProfile,
        likePost,
        unlikePost,
        addComment
};
```

---

## 4.3 Indexing & Query Optimization

### Question 40: Database Indexing Strategies
**Question:** What are database indexes? How do they improve query performance? Explain different types of indexes and when to use them. What are the trade-offs?

**Expected Answer:**
- **Indexes:** Data structures (B-tree, Hash, etc.) that speed up data retrieval
- **Types:**
    - Single-column: Index on one field
    - Compound/Composite: Multiple columns
    - Unique: Enforces uniqueness
    - Partial: Index subset of rows
    - Full-text: For text search
    - Geospatial: For location queries
- **Trade-offs:** Faster reads vs slower writes, storage overhead
- **When to index:** Columns in WHERE, JOIN, ORDER BY, GROUP BY
- **When not to:** Small tables, frequently updated columns, low cardinality

**Code Challenge:**
```javascript
// Given these queries, design optimal indexes:
// 1. Find users by email
// 2. Find posts by user, ordered by date
// 3. Find products by category and price range
// 4. Full-text search on post content
// 5. Explain query plans and optimization
```

**Expected Solution:**
```javascript
// ============ SQL Indexing (PostgreSQL) ============
/*
-- 1. Index for email lookup (unique index)
CREATE UNIQUE INDEX idx_users_email ON users(email);
-- Why: Emails are unique, frequently queried for login
-- Type: B-tree (default), supports equality and range queries

-- 2. Compound index for user posts ordered by date
CREATE INDEX idx_posts_user_date ON posts(user_id, created_at DESC);
-- Why: Covers both WHERE clause and ORDER BY
-- Column order matters: user_id first (equality), then created_at (sort)

-- 3. Compound index for category and price range
CREATE INDEX idx_products_category_price ON products(category_id, price);
-- Why: Supports queries filtering by category and price range
-- Can also support queries on just category_id alone

-- 4. Full-text search index (GIN - Generalized Inverted Index)
ALTER TABLE posts ADD COLUMN search_vector tsvector;

CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Update search vector automatically
CREATE TRIGGER posts_search_update BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', content, title);

-- 5. Partial index (index only active users)
CREATE INDEX idx_users_active_email ON users(email) WHERE is_active = true;
-- Why: Smaller index, faster for common queries on active users

-- 6. Covering index (includes additional columns)
CREATE INDEX idx_posts_user_date_covering ON posts(user_id, created_at DESC) 
INCLUDE (title, content);
-- Why: Query can be satisfied entirely from index (index-only scan)

-- 7. Multi-column unique constraint
CREATE UNIQUE INDEX idx_likes_user_post ON likes(user_id, post_id);
-- Why: Enforce one like per user per post, optimize like checks

-- 8. Geospatial index (PostGIS)
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
-- Why: For spatial queries (find nearby locations)

-- 9. Case-insensitive index for username
CREATE INDEX idx_users_username_lower ON users(LOWER(username));
-- Why: Support case-insensitive username lookups
*/

const { Pool } = require('pg');
const pool = new Pool();

// ============ Query Examples with Indexes ============

// 1. Email lookup (uses idx_users_email)
async function findUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
}

// 2. User posts ordered by date (uses idx_posts_user_date)
async function getUserPosts(userId, limit = 20) {
        const query = `
                SELECT * FROM posts 
                WHERE user_id = $1 
                ORDER BY created_at DESC 
                LIMIT $2
        `;
        const result = await pool.query(query, [userId, limit]);
        return result.rows;
}

// 3. Products by category and price (uses idx_products_category_price)
async function findProducts(categoryId, minPrice, maxPrice) {
        const query = `
                SELECT * FROM products 
                WHERE category_id = $1 
                AND price BETWEEN $2 AND $3
                ORDER BY price ASC
        `;
        const result = await pool.query(query, [categoryId, minPrice, maxPrice]);
        return result.rows;
}

// 4. Full-text search (uses idx_posts_search)
async function searchPosts(searchTerm) {
        const query = `
                SELECT 
                        id,
                        title,
                        content,
                        ts_rank(search_vector, query) as rank
                FROM posts, 
                         plainto_tsquery('english', $1) query
                WHERE search_vector @@ query
                ORDER BY rank DESC
                LIMIT 20
        `;
        const result = await pool.query(query, [searchTerm]);
        return result.rows;
}

// ============ Query Plan Analysis ============
async function explainQuery(query, params) {
        const explainQuery = `EXPLAIN (ANALYZE, BUFFERS) ${query}`;
        const result = await pool.query(explainQuery, params);
        console.log(result.rows);
        return result.rows;
}

// Example: Analyze email lookup
/*
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM users WHERE email = 'test@example.com';

Output:
Index Scan using idx_users_email on users  (cost=0.42..8.44 rows=1 width=...)
    Index Cond: (email = 'test@example.com'::text)
    Buffers: shared hit=4

Interpretation:
- "Index Scan" = using index (good!)
- cost=0.42..8.44 = startup cost..total cost
- rows=1 = estimated rows returned
- "Buffers: shared hit=4" = data found in cache
*/

// ============ MongoDB Indexing ============
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: String,
        tags: [String],
        views: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
});

// 1. Single field index
postSchema.index({ userId: 1 });

// 2. Compound index (order matters!)
postSchema.index({ userId: 1, createdAt: -1 });
// Supports: { userId: X }, { userId: X, createdAt: Y }
// Doesn't support: { createdAt: Y } alone

// 3. Unique index
postSchema.index({ userId: 1, title: 1 }, { unique: true });
// Prevents duplicate titles per user

// 4. Text index for full-text search
postSchema.index({ title: 'text', content: 'text' });
// Only one text index per collection

// 5. Multi-key index (for arrays)
postSchema.index({ tags: 1 });
// Each array element is indexed

// 6. TTL index (auto-delete documents)
postSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 * 30 });
// Delete posts after 30 days

// 7. Sparse index (only index documents with the field)
postSchema.index({ deletedAt: 1 }, { sparse: true });
// Smaller index, excludes documents without deletedAt

// 8. Partial index (with filter)
postSchema.index(
        { views: 1 },
        { partialFilterExpression: { views: { $gt: 1000 } } }
);
// Only index popular posts

// 9. Case-insensitive index
postSchema.index(
        { username: 1 },
        { collation: { locale: 'en', strength: 2 } }
);

const Post = mongoose.model('Post', postSchema);

// ============ MongoDB Query Examples ============

// Uses userId_1_createdAt_-1 index
async function getUserPostsMongo(userId, limit = 20) {
        return Post.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
}

// Full-text search (uses text index)
async function searchPostsMongo(searchTerm) {
        return Post.find(
                { $text: { $search: searchTerm } },
                { score: { $meta: 'textScore' } }
        )
                .sort({ score: { $meta: 'textScore' } })
                .limit(20)
                .lean();
}

// Compound query (uses userId_1_createdAt_-1)
async function getRecentUserPosts(userId, since) {
        return Post.find({
                userId,
                createdAt: { $gte: since }
        })
                .sort({ createdAt: -1 })
                .lean();
}

// ============ Explain Plan (MongoDB) ============
async function explainMongoQuery() {
        const explain = await Post.find({ userId: 'someId' })
                .sort({ createdAt: -1 })
                .explain('executionStats');
        
        console.log(JSON.stringify(explain, null, 2));
        
        /*
        Look for:
        - "stage": "IXSCAN" = using index (good)
        - "stage": "COLLSCAN" = collection scan (bad, no index used)
        - "executionTimeMillis": query execution time
        - "totalDocsExamined" vs "nReturned": should be close
        */
}

// ============ Index Management ============

// List indexes (MongoDB)
async function listIndexes() {
        const indexes = await Post.collection.getIndexes();
        console.log(indexes);
}

// Drop index (MongoDB)
async function dropIndex(indexName) {
        await Post.collection.dropIndex(indexName);
}

// Get index stats
async function getIndexStats() {
        const stats = await Post.collection.stats();
        console.log('Index sizes:', stats.indexSizes);
}

// SQL: List indexes
/*
SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
FROM pg_indexes
WHERE tablename = 'posts';
*/

// SQL: Index size
/*
SELECT
        indexrelname AS index_name,
        pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE schemaname = 'public';
*/

// ============ Index Best Practices ============
/*
1. Index Selectivity:
     - High cardinality (many unique values) = good for indexing
     - Low cardinality (few unique values) = poor index candidate
     - Example: email (high), gender (low)

2. Compound Index Column Order:
     - Equality conditions first
     - Range conditions last
     - Sort fields after filters
     - Example: (user_id, created_at) not (created_at, user_id)

3. Covering Indexes:
     - Include all columns needed by query
     - Enables "index-only scan" (no table access)
     - Faster but larger index

4. Avoid Over-Indexing:
     - Each index slows down INSERT/UPDATE/DELETE
     - Indexes consume storage
     - Only index frequently queried columns

5. Monitor Index Usage:
     SQL:
     SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
     
     MongoDB:
     db.collection.aggregate([{ $indexStats: {} }])

6. Regular Maintenance:
     SQL: VACUUM ANALYZE posts; REINDEX INDEX idx_name;
     MongoDB: Indexes are maintained automatically

7. Test Queries:
     - Use EXPLAIN to verify index usage
     - Measure query performance
     - Compare before/after indexing
*/

module.exports = {
        // SQL
        findUserByEmail,
        getUserPosts,
        findProducts,
        searchPosts,
        explainQuery,
        // MongoDB
        Post,
        getUserPostsMongo,
        searchPostsMongo,
        getRecentUserPosts,
        explainMongoQuery,
        listIndexes,
        dropIndex,
        getIndexStats
};
```

---

## 4.4 Complex Queries & Aggregations

### Question 41: Advanced Querying Techniques
**Question:** How do you write complex queries involving joins, subqueries, aggregations, and window functions? Explain MongoDB aggregation pipeline.

**Expected Answer:**
- **SQL Joins:** INNER, LEFT, RIGHT, FULL OUTER, CROSS
- **Subqueries:** Correlated vs non-correlated
- **Aggregations:** GROUP BY, HAVING, COUNT, SUM, AVG, MAX, MIN
- **Window Functions:** ROW_NUMBER, RANK, LAG, LEAD, running totals
- **CTEs:** Common Table Expressions for readability
- **MongoDB:** Aggregation pipeline with stages ($match, $group, $project, $lookup)

**Code Challenge:**
```javascript
// Write queries for:
// 1. Top 10 users by post count with total likes
// 2. Monthly revenue report with running total
// 3. Posts with more comments than average
// 4. Find users who never posted but commented
// 5. MongoDB aggregation equivalent
```

**Expected Solution:**
```javascript
// ============ SQL Complex Queries (PostgreSQL) ============
const { Pool } = require('pg');
const pool = new Pool();

// 1. Top 10 users by post count with total likes
async function getTopUsers() {
    const query = `
        WITH user_stats AS (
            SELECT 
                u.id,
                u.username,
                u.avatar_url,
                COUNT(DISTINCT p.id) as post_count,
                COUNT(DISTINCT l.id) as like_count
            FROM users u
            LEFT JOIN posts p ON u.id = p.user_id
            LEFT JOIN likes l ON p.id = l.post_id
            GROUP BY u.id, u.username, u.avatar_url
        )
        SELECT 
            id,
            username,
            avatar_url,
            post_count,
            like_count,
            RANK() OVER (ORDER BY post_count DESC) as rank
        FROM user_stats
        ORDER BY post_count DESC, like_count DESC
        LIMIT 10
    `;
    
    const result = await pool.query(query);
    return result.rows;
}

// 2. Monthly revenue report with running total
async function getMonthlyRevenue(year) {
    const query = `
        WITH monthly_revenue AS (
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                SUM(total_amount) as revenue,
                COUNT(*) as order_count,
                AVG(total_amount) as avg_order_value
            FROM orders
            WHERE EXTRACT(YEAR FROM created_at) = $1
            AND status IN ('completed', 'shipped')
            GROUP BY DATE_TRUNC('month', created_at)
        )
        SELECT 
            month,
            revenue,
            order_count,
            avg_order_value,
            SUM(revenue) OVER (ORDER BY month) as running_total,
            LAG(revenue, 1) OVER (ORDER BY month) as prev_month_revenue,
            ROUND(
                ((revenue - LAG(revenue, 1) OVER (ORDER BY month)) / 
                LAG(revenue, 1) OVER (ORDER BY month) * 100)::numeric, 
                2
            ) as growth_percentage
        FROM monthly_revenue
        ORDER BY month
    `;
    
    const result = await pool.query(query, [year]);
    return result.rows;
}

// 3. Posts with more comments than average (correlated subquery)
async function getPopularPosts() {
    const query = `
        SELECT 
            p.id,
            p.title,
            p.content,
            u.username,
            COUNT(c.id) as comment_count,
            (SELECT AVG(comment_count)::integer
             FROM (
                 SELECT COUNT(*) as comment_count
                 FROM comments
                 GROUP BY post_id
             ) sub
            ) as avg_comments
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        LEFT JOIN comments c ON p.id = c.post_id
        GROUP BY p.id, p.title, p.content, u.username
        HAVING COUNT(c.id) > (
            SELECT AVG(comment_count)
            FROM (
                SELECT COUNT(*) as comment_count
                FROM comments
                GROUP BY post_id
            ) sub
        )
        ORDER BY comment_count DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
}

// Alternative using WITH clause
async function getPopularPostsV2() {
    const query = `
        WITH post_comments AS (
            SELECT 
                post_id,
                COUNT(*) as comment_count
            FROM comments
            GROUP BY post_id
        ),
        avg_comment_count AS (
            SELECT AVG(comment_count) as avg_count
            FROM post_comments
        )
        SELECT 
            p.id,
            p.title,
            u.username,
            pc.comment_count,
            acc.avg_count
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        LEFT JOIN post_comments pc ON p.id = pc.post_id
        CROSS JOIN avg_comment_count acc
        WHERE pc.comment_count > acc.avg_count
        ORDER BY pc.comment_count DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
}

// 4. Users who never posted but commented
async function getCommentersWithoutPosts() {
    const query = `
        SELECT 
            u.id,
            u.username,
            u.email,
            COUNT(DISTINCT c.id) as comment_count,
            MIN(c.created_at) as first_comment,
            MAX(c.created_at) as last_comment
        FROM users u
        INNER JOIN comments c ON u.id = c.user_id
        WHERE NOT EXISTS (
            SELECT 1 
            FROM posts p 
            WHERE p.user_id = u.id
        )
        GROUP BY u.id, u.username, u.email
        ORDER BY comment_count DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
}

// Alternative using LEFT JOIN with NULL check
async function getCommentersWithoutPostsV2() {
    const query = `
        SELECT DISTINCT
            u.id,
            u.username,
            u.email
        FROM users u
        INNER JOIN comments c ON u.id = c.user_id
        LEFT JOIN posts p ON u.id = p.user_id
        WHERE p.id IS NULL
    `;
    
    const result = await pool.query(query);
    return result.rows;
}

// 5. Advanced join query - user activity summary
async function getUserActivitySummary(userId) {
    const query = `
        WITH user_posts AS (
            SELECT 
                p.id as post_id,
                p.created_at,
                COUNT(DISTINCT l.id) as likes,
                COUNT(DISTINCT c.id) as comments
            FROM posts p
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.user_id = $1
            GROUP BY p.id, p.created_at
        ),
        user_comments AS (
            SELECT COUNT(*) as total_comments
            FROM comments
            WHERE user_id = $1
        ),
        user_likes AS (
            SELECT COUNT(*) as total_likes_given
            FROM likes
            WHERE user_id = $1
        )
        SELECT 
            COUNT(DISTINCT up.post_id) as total_posts,
            COALESCE(SUM(up.likes), 0) as total_likes_received,
            COALESCE(SUM(up.comments), 0) as total_comments_on_posts,
            uc.total_comments as comments_by_user,
            ul.total_likes_given
        FROM user_posts up
        CROSS JOIN user_comments uc
        CROSS JOIN user_likes ul
        GROUP BY uc.total_comments, ul.total_likes_given
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
}

// ============ MongoDB Aggregation Pipeline ============
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const Like = mongoose.model('Like');

// 1. Top 10 users by post count with total likes (MongoDB)
async function getTopUsersMongo() {
    return User.aggregate([
        // Lookup posts for each user
        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: 'userId',
                as: 'posts'
            }
        },
        // Lookup likes for all posts
        {
            $lookup: {
                from: 'likes',
                localField: 'posts._id',
                foreignField: 'postId',
                as: 'likes'
            }
        },
        // Project and calculate counts
        {
            $project: {
                username: 1,
                avatarUrl: 1,
                postCount: { $size: '$posts' },
                likeCount: { $size: '$likes' }
            }
        },
        // Sort by post count
        { $sort: { postCount: -1, likeCount: -1 } },
        // Limit to top 10
        { $limit: 10 },
        // Add rank
        {
            $setWindowFields: {
                sortBy: { postCount: -1 },
                output: {
                    rank: { $rank: {} }
                }
            }
        }
    ]);
}

// 2. Monthly revenue report (MongoDB)
async function getMonthlyRevenueMongo(year) {
    const Order = mongoose.model('Order');
    
    return Order.aggregate([
        // Match orders from specific year
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year + 1}-01-01`)
                },
                status: { $in: ['completed', 'shipped'] }
            }
        },
        // Group by month
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: '%Y-%m',
                        date: '$createdAt'
                    }
                },
                revenue: { $sum: '$totalAmount' },
                orderCount: { $sum: 1 },
                avgOrderValue: { $avg: '$totalAmount' }
            }
        },
        // Sort by month
        { $sort: { _id: 1 } },
        // Add running total and growth percentage
        {
            $setWindowFields: {
                sortBy: { _id: 1 },
                output: {
                    runningTotal: {
                        $sum: '$revenue',
                        window: {
                            documents: ['unbounded', 'current']
                        }
                    },
                    prevMonthRevenue: {
                        $shift: {
                            output: '$revenue',
                            by: -1
                        }
                    }
                }
            }
        },
        // Calculate growth percentage
        {
            $addFields: {
                growthPercentage: {
                    $cond: {
                        if: { $gt: ['$prevMonthRevenue', 0] },
                        then: {
                            $multiply: [
                                {
                                    $divide: [
                                        {
                                            $subtract: [
                                                '$revenue',
                                                '$prevMonthRevenue'
                                            ]
                                        },
                                        '$prevMonthRevenue'
                                    ]
                                },
                                100
                            ]
                        },
                        else: null
                    }
                }
            }
        },
        // Rename _id to month
        {
            $project: {
                _id: 0,
                month: '$_id',
                revenue: 1,
                orderCount: 1,
                avgOrderValue: { $round: ['$avgOrderValue', 2] },
                runningTotal: 1,
                prevMonthRevenue: 1,
                growthPercentage: { $round: ['$growthPercentage', 2] }
            }
        }
    ]);
}

// 3. Posts with more comments than average (MongoDB)
async function getPopularPostsMongo() {
    return Post.aggregate([
        // Lookup comments for each post
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'postId',
                as: 'comments'
            }
        },
        // Add comment count
        {
            $addFields: {
                commentCount: { $size: '$comments' }
            }
        },
        // Calculate average in a facet
        {
            $facet: {
                posts: [
                    { $project: { title: 1, content: 1, author: 1, commentCount: 1 } }
                ],
                avgComments: [
                    {
                        $group: {
                            _id: null,
                            avg: { $avg: '$commentCount' }
                        }
                    }
                ]
            }
        },
        // Unwind and filter
        { $unwind: '$avgComments' },
        { $unwind: '$posts' },
        {
            $match: {
                $expr: {
                    $gt: ['$posts.commentCount', '$avgComments.avg']
                }
            }
        },
        // Project final shape
        {
            $project: {
                _id: '$posts._id',
                title: '$posts.title',
                content: '$posts.content',
                author: '$posts.author',
                commentCount: '$posts.commentCount',
                avgComments: '$avgComments.avg'
            }
        },
        { $sort: { commentCount: -1 } }
    ]);
}

// 4. Users who never posted but commented (MongoDB)
async function getCommentersWithoutPostsMongo() {
    return User.aggregate([
        // Lookup posts
        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: 'userId',
                as: 'posts'
            }
        },
        // Lookup comments
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'userId',
                as: 'comments'
            }
        },
        // Filter: has comments but no posts
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: [{ $size: '$posts' }, 0] },
                        { $gt: [{ $size: '$comments' }, 0] }
                    ]
                }
            }
        },
        // Project result
        {
            $project: {
                username: 1,
                email: 1,
                commentCount: { $size: '$comments' },
                firstComment: { $min: '$comments.createdAt' },
                lastComment: { $max: '$comments.createdAt' }
            }
        },
        { $sort: { commentCount: -1 } }
    ]);
}

// 5. Complex aggregation with multiple lookups
async function getUserActivitySummaryMongo(userId) {
    return User.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(userId) } },
        // Lookup user's posts
        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: 'userId',
                as: 'posts'
            }
        },
        // Lookup likes on user's posts
        {
            $lookup: {
                from: 'likes',
                localField: 'posts._id',
                foreignField: 'postId',
                as: 'likesOnPosts'
            }
        },
        // Lookup comments on user's posts
        {
            $lookup: {
                from: 'comments',
                localField: 'posts._id',
                foreignField: 'postId',
                as: 'commentsOnPosts'
            }
        },
        // Lookup comments by user
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'userId',
                as: 'commentsByUser'
            }
        },
        // Lookup likes given by user
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'userId',
                as: 'likesGiven'
            }
        },
        // Project summary
        {
            $project: {
                username: 1,
                totalPosts: { $size: '$posts' },
                totalLikesReceived: { $size: '$likesOnPosts' },
                totalCommentsOnPosts: { $size: '$commentsOnPosts' },
                commentsByUser: { $size: '$commentsByUser' },
                likesGiven: { $size: '$likesGiven' }
            }
        }
    ]).then(results => results[0]);
}

// ============ Aggregation Pipeline Optimization ============
/*
Best Practices:

1. Use $match early:
   - Filter documents before expensive operations
   - Use indexes when possible

2. Use $project to reduce document size:
   - Only include fields you need
   - Reduces memory usage in later stages

3. Use $lookup efficiently:
   - Consider denormalization for frequently accessed data
   - Use indexes on foreign keys
   - Limit lookup results with pipeline option

4. Avoid $unwind when possible:
   - Can explode document count
   - Use array operators instead

5. Use $facet for multiple aggregations:
   - Run multiple pipelines in parallel
   - Reduces database round trips

6. Monitor performance:
   - Use explain() to analyze pipeline
   - Check index usage
   - Measure execution time
*/

// Example: Optimized lookup with pipeline
async function getPostsWithLimitedCommentsMongo() {
    return Post.aggregate([
        {
            $lookup: {
                from: 'comments',
                let: { postId: '$_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$postId', '$$postId'] } } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 5 }, // Only get 5 most recent comments
                    { $project: { content: 1, author: 1, createdAt: 1 } }
                ],
                as: 'recentComments'
            }
        },
        {
            $project: {
                title: 1,
                content: 1,
                recentComments: 1,
                commentCount: { $size: '$recentComments' }
            }
        }
    ]);
}

module.exports = {
    // SQL
    getTopUsers,
    getMonthlyRevenue,
    getPopularPosts,
    getPopularPostsV2,
    getCommentersWithoutPosts,
    getCommentersWithoutPostsV2,
    getUserActivitySummary,
    // MongoDB
    getTopUsersMongo,
    getMonthlyRevenueMongo,
    getPopularPostsMongo,
    getCommentersWithoutPostsMongo,
    getUserActivitySummaryMongo,
    getPostsWithLimitedCommentsMongo
};
```

**Evaluation Criteria:**
- Understanding of JOIN types and when to use each
- Proper use of GROUP BY and aggregations
- Window function knowledge
- CTE usage for readability
- MongoDB aggregation pipeline stages
- Query optimization awareness
- Handling of NULL values
- Subquery vs JOIN trade-offs

---

# SECTION 5: AWS Core Services & Deployment

---

## 5.1 AWS Lambda & Serverless

### Question 42: Lambda Functions & Event-Driven Architecture
**Question:** How do AWS Lambda functions work? Explain the execution model, cold starts, and best practices for serverless functions.

**Expected Answer:**
- Lambda executes code in response to events without managing servers
- Supports Node.js, Python, Java, Go, .NET, custom runtimes
- **Cold start:** First invocation creates new execution environment (slower)
- **Warm start:** Reuses existing environment (faster)
- Pay per request and compute time (100ms increments)
- Max execution time: 15 minutes
- Memory: 128MB to 10GB
- Best practices: Keep functions small, minimize cold starts, use environment variables, avoid recursive calls

**Code Challenge:**
```javascript
// Create a Lambda function that:
// 1. Processes S3 file uploads
// 2. Handles API Gateway requests
// 3. Implements proper error handling
// 4. Uses AWS SDK v3
```

**Expected Solution:**
```javascript
// 1. S3 Event Handler
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({ region: process.env.AWS_REGION });

exports.processS3Upload = async (event) => {
    try {
        // Parse S3 event
        const record = event.Records[0];
        const bucket = record.s3.bucket.name;
        const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        
        console.log(`Processing file: ${bucket}/${key}`);
        
        // Get object from S3
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const response = await s3Client.send(command);
        const fileContent = await streamToString(response.Body);
        
        // Process file content (example: parse CSV)
        const lines = fileContent.split('\n').length;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File processed', lines })
        };
    } catch (error) {
        console.error('Error:', error);
        throw error; // Lambda will retry
    }
};

// 2. API Gateway Handler
exports.apiHandler = async (event) => {
    const { httpMethod, path, body, queryStringParameters } = event;
    
    try {
        if (httpMethod === 'GET' && path === '/users') {
            const users = await getUsers(queryStringParameters);
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(users)
            };
        }
        
        if (httpMethod === 'POST' && path === '/users') {
            const userData = JSON.parse(body);
            const user = await createUser(userData);
            return {
                statusCode: 201,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            };
        }
        
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Not found' })
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

// Helper function
async function streamToString(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
}
```

---

## 5.2 API Gateway

### Question 43: API Gateway Configuration
**Question:** How does AWS API Gateway work? Explain REST vs HTTP vs WebSocket APIs, and common integration patterns.

**Expected Answer:**
- **REST API:** Full-featured, supports caching, request/response transformations
- **HTTP API:** Cheaper, lower latency, simpler (no caching)
- **WebSocket API:** Bi-directional real-time communication
- Integration types: Lambda, HTTP endpoints, AWS services, Mock
- Features: Authentication (Cognito, IAM, custom authorizers), throttling, CORS, stages (dev/prod)
- Request/response mapping with VTL (Velocity Template Language)

**Code Challenge:**
```javascript
// Configure API Gateway with:
// 1. Lambda integration
// 2. Custom authorizer
// 3. Request validation
// 4. CORS configuration
```

**Expected Solution:**
```javascript
// serverless.yml (Serverless Framework)
service: my-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  # Main API function
  api:
    handler: handler.api
    events:
      - http:
          path: /users
          method: get
          cors: true
          authorizer:
            name: authorizer
            resultTtlInSeconds: 300
          request:
            parameters:
              querystrings:
                page: false
                limit: false
  
  # Custom authorizer
  authorizer:
    handler: handler.authorize

# handler.js - Custom Authorizer
exports.authorize = async (event) => {
    const token = event.authorizationToken;
    
    try {
        // Validate token (JWT, API key, etc.)
        const decoded = await verifyToken(token);
        
        return {
            principalId: decoded.userId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [{
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: event.methodArn
                }]
            },
            context: {
                userId: decoded.userId,
                email: decoded.email
            }
        };
    } catch (error) {
        throw new Error('Unauthorized');
    }
};

// AWS CDK example
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const api = new apigateway.RestApi(this, 'MyApi', {
    restApiName: 'My Service',
    defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
    }
});

const usersResource = api.root.addResource('users');
usersResource.addMethod('GET', new apigateway.LambdaIntegration(getUsersLambda));
```

---

## 5.3 ECS/EKS Container Orchestration

### Question 44: Docker Containers on AWS
**Question:** What's the difference between ECS and EKS? When would you use each? Explain task definitions and services.

**Expected Answer:**
- **ECS (Elastic Container Service):** AWS-native, simpler, less overhead
- **EKS (Elastic Kubernetes Service):** Kubernetes-based, portable, more complex
- **Fargate:** Serverless compute for containers (works with both ECS/EKS)
- **Task Definition:** Blueprint for your container (image, CPU, memory, env vars)
- **Service:** Runs and maintains desired number of tasks, integrates with load balancers
- Use ECS for AWS-only, simpler deployments; EKS for multi-cloud, Kubernetes expertise

**Code Challenge:**
```yaml
# Create:
# 1. Dockerfile for Node.js app
# 2. ECS task definition
# 3. Service configuration
```

**Expected Solution:**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```json
// ECS Task Definition (JSON)
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "portMappings": [{ "containerPort": 3000, "protocol": "tcp" }],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "secrets": [
        { "name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:..." }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 5.4 S3 Storage

### Question 45: S3 Best Practices
**Question:** How do you optimize S3 for performance, cost, and security? Explain storage classes and lifecycle policies.

**Expected Answer:**
- **Storage Classes:** Standard (frequent access), IA (infrequent), Glacier (archive), Intelligent-Tiering (auto)
- **Performance:** Use prefixes for parallel uploads, multipart upload for large files, CloudFront CDN
- **Security:** Bucket policies, IAM, ACLs, encryption (SSE-S3, SSE-KMS), versioning, MFA delete
- **Lifecycle policies:** Transition objects to cheaper storage classes, expire old versions
- **Cost optimization:** Delete incomplete multipart uploads, use lifecycle rules, compress files

**Code Challenge:**
```javascript
// Implement S3 operations:
// 1. Upload file with multipart
// 2. Generate presigned URL
// 3. List objects with pagination
```

**Expected Solution:**
```javascript
const { S3Client, PutObjectCommand, GetObjectCommand, 
        CreateMultipartUploadCommand, UploadPartCommand, 
        CompleteMultipartUploadCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');

const s3Client = new S3Client({ region: 'us-east-1' });

// 1. Multipart upload
async function uploadLargeFile(filePath, bucket, key) {
    const fileSize = fs.statSync(filePath).size;
    const partSize = 5 * 1024 * 1024; // 5MB chunks
    const numParts = Math.ceil(fileSize / partSize);
    
    // Initiate multipart upload
    const { UploadId } = await s3Client.send(new CreateMultipartUploadCommand({
        Bucket: bucket,
        Key: key
    }));
    
    const uploadPromises = [];
    for (let i = 0; i < numParts; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, fileSize);
        const partStream = fs.createReadStream(filePath, { start, end: end - 1 });
        
        uploadPromises.push(
            s3Client.send(new UploadPartCommand({
                Bucket: bucket,
                Key: key,
                UploadId,
                PartNumber: i + 1,
                Body: partStream
            }))
        );
    }
    
    const parts = await Promise.all(uploadPromises);
    
    // Complete upload
    await s3Client.send(new CompleteMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        UploadId,
        MultipartUpload: {
            Parts: parts.map((part, i) => ({
                ETag: part.ETag,
                PartNumber: i + 1
            }))
        }
    }));
}

// 2. Presigned URL (valid for 1 hour)
async function generatePresignedUrl(bucket, key) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

// 3. List with pagination
async function listAllObjects(bucket, prefix = '') {
    let continuationToken;
    const allObjects = [];
    
    do {
        const response = await s3Client.send(new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
            ContinuationToken: continuationToken,
            MaxKeys: 1000
        }));
        
        allObjects.push(...(response.Contents || []));
        continuationToken = response.NextContinuationToken;
    } while (continuationToken);
    
    return allObjects;
}
```

---

## 5.5 CloudWatch & Monitoring

### Question 46: Observability with CloudWatch
**Question:** How do you monitor AWS applications? Explain CloudWatch Logs, Metrics, Alarms, and comparison with Datadog.

**Expected Answer:**
- **CloudWatch Logs:** Centralized log storage, log groups/streams, retention policies, Insights for queries
- **Metrics:** Time-series data (CPU, memory, custom metrics), namespaces, dimensions
- **Alarms:** Trigger actions based on metric thresholds (SNS, Auto Scaling, Lambda)
- **Datadog:** Third-party APM with better dashboards, APM tracing, multi-cloud support, more expensive
- **X-Ray:** AWS distributed tracing service
- Use CloudWatch for AWS-native, Datadog for advanced features and multi-cloud

**Code Challenge:**
```javascript
// Implement:
// 1. Custom CloudWatch metrics
// 2. Structured logging
// 3. Error tracking with alarms
```

**Expected Solution:**
```javascript
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');
const { CloudWatchLogsClient, PutLogEventsCommand } = require('@aws-sdk/client-cloudwatch-logs');

const cwClient = new CloudWatchClient({ region: 'us-east-1' });

// 1. Custom metrics
async function putCustomMetric(metricName, value, unit = 'Count') {
    await cwClient.send(new PutMetricDataCommand({
        Namespace: 'MyApp',
        MetricData: [{
            MetricName: metricName,
            Value: value,
            Unit: unit,
            Timestamp: new Date(),
            Dimensions: [
                { Name: 'Environment', Value: process.env.NODE_ENV },
                { Name: 'Service', Value: 'api' }
            ]
        }]
    }));
}

// 2. Structured logging
class Logger {
    log(level, message, metadata = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            environment: process.env.NODE_ENV,
            service: 'api',
            ...metadata
        };
        console.log(JSON.stringify(logEntry));
    }
    
    info(message, metadata) { this.log('INFO', message, metadata); }
    error(message, error, metadata) { 
        this.log('ERROR', message, { 
            ...metadata, 
            error: { message: error.message, stack: error.stack } 
        }); 
    }
}

const logger = new Logger();

// 3. Usage with error tracking
async function processRequest(event) {
    const startTime = Date.now();
    
    try {
        logger.info('Processing request', { requestId: event.requestContext.requestId });
        
        const result = await doWork();
        
        await putCustomMetric('RequestSuccess', 1);
        await putCustomMetric('RequestDuration', Date.now() - startTime, 'Milliseconds');
        
        return result;
    } catch (error) {
        logger.error('Request failed', error, { requestId: event.requestContext.requestId });
        await putCustomMetric('RequestError', 1);
        throw error;
    }
}
```

---

## 5.6 CI/CD Pipeline

### Question 47: Deployment Automation
**Question:** How do you set up a CI/CD pipeline for Node.js applications on AWS? Explain blue-green and canary deployments.

**Expected Answer:**
- **CI/CD Tools:** AWS CodePipeline, CodeBuild, CodeDeploy, GitHub Actions, GitLab CI
- **Blue-Green:** Two identical environments, switch traffic instantly, easy rollback
- **Canary:** Gradually shift traffic to new version (10% → 50% → 100%), monitor metrics
- **Pipeline stages:** Source → Build → Test → Deploy
- **Best practices:** Automated tests, infrastructure as code, versioned artifacts, rollback strategy

**Code Challenge:**
```yaml
# Create GitHub Actions workflow for:
# 1. Build and test
# 2. Deploy to Lambda
# 3. Run integration tests
```

**Expected Solution:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  NODE_VERSION: 18

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      - run: npm ci --production
      - run: zip -r lambda.zip .
      - uses: actions/upload-artifact@v3
        with:
          name: lambda-package
          path: lambda.zip

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: lambda-package
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      - name: Deploy to Lambda
        run: |
          aws lambda update-function-code \
            --function-name my-function \
            --zip-file fileb://lambda.zip
      - name: Wait for deployment
        run: |
          aws lambda wait function-updated \
            --function-name my-function

  integration-test:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      - run: npm ci
      - run: npm run test:integration
        env:
          API_URL: ${{ secrets.API_URL }}
```

---

## 5.7 Infrastructure as Code

### Question 48: IaC with CloudFormation/CDK/Terraform
**Question:** Compare AWS CloudFormation, CDK, and Terraform. When would you use each?

**Expected Answer:**
- **CloudFormation:** AWS-native, YAML/JSON, declarative, automatic rollback
- **AWS CDK:** Define infrastructure in code (TypeScript, Python), generates CloudFormation
- **Terraform:** Multi-cloud, HCL language, larger community, state management
- **CDK advantages:** Type safety, IDE support, reusable constructs, familiar languages
- **Terraform advantages:** Multi-cloud, larger ecosystem, existing modules
- Use CDK for AWS-only with code preference, Terraform for multi-cloud

**Code Challenge:**
```typescript
// CDK example: Create Lambda + API Gateway + DynamoDB
```

**Expected Solution:**
```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const table = new dynamodb.Table(this, 'UsersTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Lambda function
    const fn = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    // Grant Lambda access to DynamoDB
    table.grantReadWriteData(fn);

    // API Gateway
    const api = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'My Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    const usersResource = api.root.addResource('users');
    usersResource.addMethod('GET', new apigateway.LambdaIntegration(fn));
    usersResource.addMethod('POST', new apigateway.LambdaIntegration(fn));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'TableName', { value: table.tableName });
  }
}
```

---

## 5.8 Environment Management

### Question 49: Multi-Environment Setup
**Question:** How do you manage multiple environments (dev, staging, prod) in AWS? Explain account strategies and resource isolation.

**Expected Answer:**
- **Account strategies:** Single account with tags, separate accounts per environment (recommended), AWS Organizations
- **Separate accounts benefits:** Complete isolation, separate billing, security boundaries
- **Resource naming:** Include environment in names (my-app-prod-lambda)
- **Configuration:** Environment-specific parameter stores, separate S3 buckets, different IAM roles
- **Deployment:** Same IaC code deployed to different accounts, environment variables differentiate
- **Cost tracking:** Use tags and separate accounts for accurate cost allocation

**Code Challenge:**
```typescript
// CDK: Deploy same stack to multiple environments
```

**Expected Solution:**
```typescript
// bin/app.ts
import * as cdk from 'aws-cdk-lib';
import { MyAppStack } from '../lib/my-app-stack';

const app = new cdk.App();

// Development environment
new MyAppStack(app, 'MyApp-Dev', {
  env: { account: '111111111111', region: 'us-east-1' },
  environmentName: 'dev',
  instanceSize: 't3.micro',
  minCapacity: 1
});

// Production environment
new MyAppStack(app, 'MyApp-Prod', {
  env: { account: '222222222222', region: 'us-east-1' },
  environmentName: 'prod',
  instanceSize: 't3.large',
  minCapacity: 3
});

// lib/my-app-stack.ts
interface MyAppStackProps extends cdk.StackProps {
  environmentName: string;
  instanceSize: string;
  minCapacity: number;
}

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyAppStackProps) {
    super(scope, id, props);

    // All resources include environment in name
    const table = new dynamodb.Table(this, 'Table', {
      tableName: `users-${props.environmentName}`,
      // ... config based on environment
    });

    // Apply tags for cost tracking
    cdk.Tags.of(this).add('Environment', props.environmentName);
    cdk.Tags.of(this).add('Project', 'MyApp');
  }
}
```

---

## 5.9 Security & IAM

### Question 50: AWS Security Best Practices
**Question:** Explain AWS IAM roles, policies, and security best practices. How do you implement least privilege access?

**Expected Answer:**
- **IAM Components:** Users (people), Roles (services), Policies (permissions)
- **Least Privilege:** Grant minimum permissions needed, use specific actions not wildcards
- **Best practices:** No hardcoded credentials, use roles for EC2/Lambda, rotate keys, MFA, CloudTrail logging
- **Policy types:** Identity-based (attached to users/roles), resource-based (S3 bucket policies)
- **Secrets:** Use AWS Secrets Manager or Systems Manager Parameter Store, not environment variables
- **Network security:** VPC, security groups, NACLs, private subnets

**Code Challenge:**
```json
// Create IAM policy with least privilege for Lambda accessing DynamoDB and S3
```

**Expected Solution:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789:table/Users"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:us-east-1:123456789:log-group:/aws/lambda/*"
    }
  ]
}
```

```javascript
// Using AWS SDK with IAM role (no credentials in code)
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

// Client automatically uses IAM role attached to Lambda
const client = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    const command = new GetItemCommand({
        TableName: 'Users',
        Key: { id: { S: event.userId } }
    });
    
    const response = await client.send(command);
    return response.Item;
};
```

---

## 5.10 Cost Optimization

### Question 51: AWS Cost Management
**Question:** How do you optimize AWS costs? Explain pricing models, cost monitoring, and optimization strategies.

**Expected Answer:**
- **Pricing models:** On-demand, Reserved Instances (1-3 year commitment), Savings Plans, Spot Instances (90% discount)
- **Cost monitoring:** AWS Cost Explorer, budgets with alerts, tag-based allocation
- **Optimization strategies:**
  - Right-size resources (don't over-provision)
  - Use auto-scaling (scale down when idle)
  - S3 lifecycle policies (move to Glacier)
  - Lambda instead of EC2 for sporadic workloads
  - Delete unused resources, snapshots, old logs
- **Cost allocation tags:** Track costs by project, team, environment

**Code Challenge:**
```javascript
// Implement cost-aware resource management
```

**Expected Solution:**
```javascript
// Example: Auto-stop dev resources outside business hours
const { EC2Client, StopInstancesCommand, StartInstancesCommand, 
        DescribeInstancesCommand } = require('@aws-sdk/client-ec2');

const ec2 = new EC2Client({ region: 'us-east-1' });

exports.handler = async (event) => {
    const hour = new Date().getUTCHours();
    const isWeekend = [0, 6].includes(new Date().getUTCDay());
    const isBusinessHours = hour >= 9 && hour < 18 && !isWeekend;
    
    // Find dev instances
    const { Reservations } = await ec2.send(new DescribeInstancesCommand({
        Filters: [
            { Name: 'tag:Environment', Values: ['dev'] },
            { Name: 'tag:AutoStop', Values: ['true'] },
            { Name: 'instance-state-name', Values: ['running', 'stopped'] }
        ]
    }));
    
    const instances = Reservations?.flatMap(r => r.Instances) || [];
    const runningIds = instances.filter(i => i.State.Name === 'running').map(i => i.InstanceId);
    const stoppedIds = instances.filter(i => i.State.Name === 'stopped').map(i => i.InstanceId);
    
    // Stop during non-business hours
    if (!isBusinessHours && runningIds.length > 0) {
        await ec2.send(new StopInstancesCommand({ InstanceIds: runningIds }));
        console.log('Stopped instances:', runningIds);
    }
    
    // Start during business hours
    if (isBusinessHours && stoppedIds.length > 0) {
        await ec2.send(new StartInstancesCommand({ InstanceIds: stoppedIds }));
        console.log('Started instances:', stoppedIds);
    }
};

// S3 Lifecycle Policy (Infrastructure as Code)
const lifecyclePolicy = {
    Rules: [
        {
            Id: 'archive-old-logs',
            Status: 'Enabled',
            Prefix: 'logs/',
            Transitions: [
                { Days: 30, StorageClass: 'STANDARD_IA' },
                { Days: 90, StorageClass: 'GLACIER' }
            ],
            Expiration: { Days: 365 }
        },
        {
            Id: 'delete-incomplete-uploads',
            Status: 'Enabled',
            AbortIncompleteMultipartUpload: { DaysAfterInitiation: 7 }
        }
    ]
};
```

---

## Section 5 Summary & Scoring Guide

### Section 5 Scoring Rubric:

| Score | Level | Description |
|-------|-------|-------------|
| 0-3   | Junior | Basic AWS knowledge, limited practical experience |
| 4-5   | Mid-Junior | Uses core services, needs guidance on architecture |
| 6-7   | Semi-Senior | Solid AWS fundamentals, can design basic systems |
| 8-9   | Senior | Deep understanding, optimizes costs and performance |
| 10    | Expert | Architect-level knowledge, multi-region, security expert |

### Key Concepts to Evaluate:
- [ ] Lambda best practices and cold start mitigation
- [ ] API Gateway configuration and security
- [ ] Container orchestration (ECS vs EKS)
- [ ] S3 storage classes and optimization
- [ ] CloudWatch monitoring and custom metrics
- [ ] CI/CD pipeline design
- [ ] Infrastructure as Code proficiency
- [ ] IAM security and least privilege
- [ ] Cost optimization strategies
- [ ] Multi-environment management

---

*End of Section 5: AWS Core Services & Deployment*

---

# SECTION 6: AWS Advanced Strategies & Security

---

## 6.1 AWS Well-Architected Framework

### Question 52: Well-Architected Pillars & Best Practices
**Question:** Explain the five pillars of the AWS Well-Architected Framework. How do you apply these principles when designing a production system? Provide examples of trade-offs between pillars.

**Expected Answer:**
- **Five Pillars:**
    1. **Operational Excellence:** Automation, monitoring, continuous improvement, IaC
    2. **Security:** Identity management, data protection, encryption, least privilege
    3. **Reliability:** Auto-scaling, multi-AZ, backup/recovery, fault tolerance
    4. **Performance Efficiency:** Right-sizing, caching, CDN, choosing optimal services
    5. **Cost Optimization:** Right-sizing, reserved instances, auto-scaling, lifecycle policies

- **Trade-offs:**
    - Security vs Performance: Encryption adds latency
    - Reliability vs Cost: Multi-region increases costs
    - Performance vs Cost: Larger instances are faster but expensive
    - Security vs Operational Excellence: Strict controls can slow deployments

- **Best Practices:**
    - Design for failure (everything will fail eventually)
    - Implement multiple layers of security
    - Automate everything possible
    - Use managed services when feasible
    - Test disaster recovery regularly

**Code Challenge:**
```typescript
// Design a Well-Architected system for an e-commerce platform:
// 1. Architecture diagram explanation
// 2. Multi-AZ setup with RDS and ElastiCache
// 3. Auto-scaling configuration
// 4. Security layers (WAF, Security Groups)
// 5. Cost optimization strategies
// 6. Monitoring and alerting setup
```

**Expected Solution:**
```typescript
// ============ AWS CDK Stack - Well-Architected E-commerce Platform ============
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class EcommerceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ============ 1. RELIABILITY: Multi-AZ VPC with public and private subnets ============
    const vpc = new ec2.Vpc(this, 'EcommerceVPC', {
      maxAzs: 3, // Multi-AZ for high availability
      natGateways: 2, // NAT in each AZ for redundancy
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24
        },
        {
          name: 'Database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24
        }
      ]
    });

    // ============ 2. SECURITY: Security Groups (Defense in Depth) ============
    // ALB Security Group
    const albSecurityGroup = new ec2.SecurityGroup(this, 'ALBSecurityGroup', {
      vpc,
      description: 'Security group for Application Load Balancer',
      allowAllOutbound: true
    });
    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS from internet'
    );

    // Application Security Group
    const appSecurityGroup = new ec2.SecurityGroup(this, 'AppSecurityGroup', {
      vpc,
      description: 'Security group for application servers',
      allowAllOutbound: true
    });
    appSecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(3000),
      'Allow traffic from ALB only'
    );

    // Database Security Group
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for RDS database',
      allowAllOutbound: false
    });
    dbSecurityGroup.addIngressRule(
      appSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow PostgreSQL from application tier only'
    );

    // Cache Security Group
    const cacheSecurityGroup = new ec2.SecurityGroup(this, 'CacheSecurityGroup', {
      vpc,
      description: 'Security group for ElastiCache Redis',
      allowAllOutbound: false
    });
    cacheSecurityGroup.addIngressRule(
      appSecurityGroup,
      ec2.Port.tcp(6379),
      'Allow Redis from application tier only'
    );

    // ============ 3. RELIABILITY: Multi-AZ RDS with Automatic Backups ============
    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM
      ),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSecurityGroup],
      multiAz: true, // High availability
      allocatedStorage: 100,
      storageEncrypted: true, // SECURITY: Encryption at rest
      backupRetention: cdk.Duration.days(7),
      deleteAutomatedBackups: false,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
      cloudwatchLogsExports: ['postgresql'], // OPERATIONAL EXCELLENCE: Logging
      monitoringInterval: cdk.Duration.seconds(60),
      enablePerformanceInsights: true,
      performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT
    });

    // ============ 4. PERFORMANCE EFFICIENCY: ElastiCache Redis Cluster ============
    const cacheSubnetGroup = new elasticache.CfnSubnetGroup(this, 'CacheSubnetGroup', {
      description: 'Subnet group for ElastiCache',
      subnetIds: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }).subnetIds
    });

    const redisCluster = new elasticache.CfnReplicationGroup(this, 'RedisCluster', {
      replicationGroupDescription: 'Redis cluster for session and caching',
      engine: 'redis',
      cacheNodeType: 'cache.t3.medium',
      numCacheClusters: 2, // Multi-AZ for reliability
      automaticFailoverEnabled: true,
      multiAzEnabled: true,
      cacheSubnetGroupName: cacheSubnetGroup.ref,
      securityGroupIds: [cacheSecurityGroup.securityGroupId],
      atRestEncryptionEnabled: true, // SECURITY
      transitEncryptionEnabled: true, // SECURITY
      snapshotRetentionLimit: 5,
      snapshotWindow: '03:00-05:00',
      preferredMaintenanceWindow: 'sun:05:00-sun:07:00'
    });

    // ============ 5. RELIABILITY: Application Load Balancer ============
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
    });

    // SECURITY: SSL Certificate (assume ACM certificate exists)
    const listener = alb.addListener('HttpsListener', {
      port: 443,
      certificates: [
        // Replace with actual ACM certificate ARN
        elbv2.ListenerCertificate.fromArn(
          'arn:aws:acm:us-east-1:123456789:certificate/...'
        )
      ]
    });

    // Redirect HTTP to HTTPS
    alb.addRedirect({
      sourceProtocol: elbv2.ApplicationProtocol.HTTP,
      sourcePort: 80,
      targetProtocol: elbv2.ApplicationProtocol.HTTPS,
      targetPort: 443
    });

    // ============ 6. RELIABILITY + PERFORMANCE: Auto Scaling Group ============
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'yum update -y',
      'yum install -y docker',
      'service docker start',
      'docker run -d -p 3000:3000 my-ecommerce-app:latest'
    );

    const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      securityGroup: appSecurityGroup,
      userData,
      minCapacity: 2, // At least 2 instances for HA
      maxCapacity: 10, // Scale up to 10 under load
      desiredCapacity: 2,
      healthCheck: autoscaling.HealthCheck.elb({
        grace: cdk.Duration.seconds(300)
      }),
      updatePolicy: autoscaling.UpdatePolicy.rollingUpdate({
        maxBatchSize: 2,
        minInstancesInService: 1
      })
    });

    // PERFORMANCE EFFICIENCY: Auto Scaling Policies
    asg.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70
    });

    asg.scaleOnRequestCount('RequestScaling', {
      targetRequestsPerMinute: 1000
    });

    // Connect ASG to ALB
    listener.addTargets('AppTargets', {
      port: 3000,
      targets: [asg],
      healthCheck: {
        path: '/health',
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3
      },
      deregistrationDelay: cdk.Duration.seconds(30)
    });

    // ============ 7. SECURITY: AWS WAF (Web Application Firewall) ============
    const wafRules: wafv2.CfnWebACL.RuleProperty[] = [
      {
        name: 'RateLimitRule',
        priority: 1,
        statement: {
          rateBasedStatement: {
            limit: 2000,
            aggregateKeyType: 'IP'
          }
        },
        action: { block: {} },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'RateLimitRule'
        }
      },
      {
        name: 'AWSManagedRulesCommonRuleSet',
        priority: 2,
        statement: {
          managedRuleGroupStatement: {
            vendorName: 'AWS',
            name: 'AWSManagedRulesCommonRuleSet'
          }
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'CommonRuleSet'
        }
      }
    ];

    const webAcl = new wafv2.CfnWebACL(this, 'WebACL', {
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      rules: wafRules,
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'WebACL'
      }
    });

    // Associate WAF with ALB
    new wafv2.CfnWebACLAssociation(this, 'WebACLAssociation', {
      resourceArn: alb.loadBalancerArn,
      webAclArn: webAcl.attrArn
    });

    // ============ 8. OPERATIONAL EXCELLENCE: CloudWatch Alarms & SNS ============
    const alarmTopic = new sns.Topic(this, 'AlarmTopic', {
      displayName: 'Ecommerce Platform Alarms'
    });

    alarmTopic.addSubscription(
      new subscriptions.EmailSubscription('devops@example.com')
    );

    // High CPU Alarm
    new cloudwatch.Alarm(this, 'HighCPUAlarm', {
      metric: asg.metricCpuUtilization(),
      threshold: 80,
      evaluationPeriods: 2,
      datapointsToAlarm: 2,
      alarmDescription: 'Alert when CPU exceeds 80%',
      actionsEnabled: true
    }).addAlarmAction(new cdk.aws_cloudwatch_actions.SnsAction(alarmTopic));

    // Database Connection Alarm
    new cloudwatch.Alarm(this, 'DatabaseConnectionAlarm', {
      metric: database.metricDatabaseConnections(),
      threshold: 80,
      evaluationPeriods: 2,
      alarmDescription: 'Alert when DB connections exceed 80',
      actionsEnabled: true
    }).addAlarmAction(new cdk.aws_cloudwatch_actions.SnsAction(alarmTopic));

    // ALB 5XX Errors
    new cloudwatch.Alarm(this, 'ALB5XXAlarm', {
      metric: alb.metricHttpCodeTarget(
        elbv2.HttpCodeTarget.TARGET_5XX_COUNT
      ),
      threshold: 10,
      evaluationPeriods: 1,
      alarmDescription: 'Alert on 10+ 5XX errors',
      actionsEnabled: true
    }).addAlarmAction(new cdk.aws_cloudwatch_actions.SnsAction(alarmTopic));

    // ============ 9. COST OPTIMIZATION: Tagging Strategy ============
    cdk.Tags.of(this).add('Project', 'Ecommerce');
    cdk.Tags.of(this).add('Environment', 'Production');
    cdk.Tags.of(this).add('ManagedBy', 'CDK');
    cdk.Tags.of(this).add('CostCenter', 'Engineering');

    // COST OPTIMIZATION: Use Savings Plans for predictable workload
    // (Applied at account level, not in CDK)

    // ============ 10. OUTPUTS ============
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
      description: 'ALB DNS name'
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.dbInstanceEndpointAddress,
      description: 'RDS endpoint'
    });

    new cdk.CfnOutput(this, 'RedisEndpoint', {
      value: redisCluster.attrPrimaryEndPointAddress,
      description: 'Redis cluster endpoint'
    });
  }
}

// ============ Application Code Example - Using the Infrastructure ============
// app.js
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();

// Database connection (RDS)
const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: 'ecommerce',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }, // SECURITY: SSL for RDS
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Redis cache (ElastiCache)
const redisClient = redis.createClient({
  url: `rediss://${process.env.REDIS_HOST}:6379`, // SECURITY: TLS enabled
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

redisClient.connect();

// Health check endpoint (for ALB)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Example cached endpoint
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `product:${id}`;

  try {
    // PERFORMANCE EFFICIENCY: Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Query database
    const result = await dbPool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result.rows[0];

    // Cache for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify(product));

    res.json(product);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ============ Cost Optimization Strategies Summary ============
/*
1. Right-sizing:
   - T3 instances for web tier (burstable, cost-effective)
   - Auto-scaling min capacity of 2 (not over-provisioned)

2. Reserved Instances / Savings Plans:
   - Commit to 1-year or 3-year for baseline capacity
   - Up to 72% savings compared to on-demand

3. Caching:
   - ElastiCache reduces database load
   - Fewer RDS IOPS charges

4. Auto Scaling:
   - Scale down during low traffic
   - Only pay for what you use

5. Storage Optimization:
   - RDS: Only 100GB allocated, can grow as needed
   - Enable automatic backups retention of 7 days (not excessive)

6. Monitoring:
   - CloudWatch alarms prevent over-spending on unused resources
   - SNS notifications for immediate action

7. Multi-AZ Trade-off:
   - Higher cost for reliability
   - Acceptable for production workloads
   - Could use single-AZ for dev/staging

Estimated Monthly Cost (us-east-1):
- ALB: ~$16
- EC2 (2x t3.small): ~$30 (on-demand) or ~$20 (reserved)
- RDS (1x db.t3.medium Multi-AZ): ~$120
- ElastiCache (2x cache.t3.medium): ~$100
- Data Transfer: Variable
- Total: ~$266/month baseline (without reserved instances)
- With 1-year reserved: ~$206/month (22% savings)
*/
```

**Evaluation Criteria:**
- Understanding of all five Well-Architected pillars
- Ability to balance trade-offs between pillars
- Multi-AZ deployment for high availability
- Defense-in-depth security approach
- Proper use of caching for performance
- Auto-scaling configuration
- Monitoring and alerting setup
- Cost-conscious architecture decisions
- Infrastructure as Code best practices

---

## 6.2 AWS Security Best Practices & Compliance

### Question 53: Advanced Security Strategies & Compliance
**Question:** Design a comprehensive security strategy for a financial services application on AWS. Cover identity management, data protection, network security, compliance requirements, and incident response. How do you implement defense-in-depth?

**Expected Answer:**
- **Defense-in-Depth Layers:**
    1. **Identity & Access:** IAM, Cognito, SSO, MFA, least privilege
    2. **Network:** VPC, Security Groups, NACLs, PrivateLink, WAF
    3. **Data:** Encryption at rest (KMS), in transit (TLS), tokenization
    4. **Application:** Input validation, secure APIs, secrets management
    5. **Detection:** GuardDuty, CloudTrail, Config, Security Hub
    6. **Response:** Automated remediation, incident response plan

- **Compliance Frameworks:**
    - **PCI-DSS:** Payment card data protection
    - **HIPAA:** Healthcare data
    - **GDPR:** EU privacy regulations
    - **SOC 2:** Service organization controls
    - AWS provides compliance certifications, but you're responsible for your configuration

- **Key Security Services:**
    - **AWS KMS:** Encryption key management
    - **AWS Secrets Manager:** Rotate secrets automatically
    - **AWS GuardDuty:** Threat detection
    - **AWS Macie:** Discover and protect sensitive data
    - **AWS Security Hub:** Centralized security findings
    - **AWS CloudTrail:** API audit logging
    - **AWS Config:** Resource compliance tracking

**Code Challenge:**
```typescript
// Implement a secure financial services application with:
// 1. Multi-account strategy (separate prod/dev/security accounts)
// 2. Data encryption (at rest and in transit)
// 3. Secrets rotation
// 4. Audit logging and monitoring
// 5. Automated security compliance checks
// 6. Incident response automation
```

**Expected Solution:**
```typescript
// ============ AWS CDK - Secure Financial Services Application ============
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as config from 'aws-cdk-lib/aws-config';
import * as guardduty from 'aws-cdk-lib/aws-guardduty';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class SecureFinancialAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ============ 1. ENCRYPTION: KMS Keys for Data Protection ============
    // Separate KMS keys for different data types (principle of least privilege)
    const databaseKey = new kms.Key(this, 'DatabaseKey', {
      description: 'KMS key for RDS database encryption',
      enableKeyRotation: true, // Automatic rotation every year
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pendingWindow: cdk.Duration.days(30)
    });

    const s3Key = new kms.Key(this, 'S3Key', {
      description: 'KMS key for S3 bucket encryption',
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    // ============ 2. AUDIT LOGGING: CloudTrail for All API Calls ============
    const auditBucket = new s3.Bucket(this, 'AuditLogBucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: s3Key,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      lifecycleRules: [
        {
          transitions: [
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(90)
            }
          ],
          expiration: cdk.Duration.days(2555) // 7 years (compliance requirement)
        }
      ],
      objectLockEnabled: true, // Prevent deletion (compliance)
      serverAccessLogsPrefix: 'access-logs/'
    });

    // Multi-region CloudTrail
    const trail = new cloudtrail.Trail(this, 'AuditTrail', {
      bucket: auditBucket,
      isMultiRegionTrail: true,
      includeGlobalServiceEvents: true,
      enableFileValidation: true, // Detect log tampering
      sendToCloudWatchLogs: true
    });

    // ============ 3. NETWORK SECURITY: Isolated VPC with Private Subnets ============
    const vpc = new ec2.Vpc(this, 'SecureVPC', {
      maxAzs: 3,
      natGateways: 0, // No NAT gateways, use VPC endpoints instead (more secure)
      subnetConfiguration: [
        {
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24
        }
      ]
    });

    // VPC Endpoints (no internet exposure)
    vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER
    });

    vpc.addInterfaceEndpoint('KMSEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.KMS
    });

    // VPC Flow Logs for network monitoring
    const flowLogBucket = new s3.Bucket(this, 'FlowLogBucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: s3Key,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    new ec2.FlowLog(this, 'VPCFlowLog', {
      resourceType: ec2.FlowLogResourceType.fromVpc(vpc),
      destination: ec2.FlowLogDestination.toS3(flowLogBucket)
    });

    // ============ 4. DATABASE SECURITY: Encrypted RDS with Secrets Rotation ============
    // Generate database credentials in Secrets Manager
    const databaseSecret = new secretsmanager.Secret(this, 'DBSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'admin' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        passwordLength: 32
      },
      encryptionKey: databaseKey
    });

    // Security group for database (no inbound from internet)
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for RDS database',
      allowAllOutbound: false
    });

    // Encrypted RDS with automatic backups
    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15
      }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSecurityGroup],
      storageEncrypted: true,
      storageEncryptionKey: databaseKey,
      credentials: rds.Credentials.fromSecret(databaseSecret),
      multiAz: true,
      backupRetention: cdk.Duration.days(30),
      deleteAutomatedBackups: false,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
      deletionProtection: true, // Prevent accidental deletion
      cloudwatchLogsExports: ['postgresql'],
      enablePerformanceInsights: true,
      performanceInsightEncryptionKey: databaseKey,
      iamAuthentication: true // Use IAM for database access (no passwords)
    });

    // Automatic secret rotation
    databaseSecret.addRotationSchedule('RotationSchedule', {
      automaticallyAfter: cdk.Duration.days(30),
      hostedRotation: secretsmanager.HostedRotation.postgresqlSingleUser()
    });

    // ============ 5. APPLICATION SECURITY: Lambda with IAM Roles (No Access Keys) ============
    // Lambda execution role with least privilege
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaVPCAccessExecutionRole'
        )
      ]
    });

    // Grant only necessary permissions
    databaseSecret.grantRead(lambdaRole);
    databaseKey.grantDecrypt(lambdaRole);

    const apiFunction = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSecurityGroup],
      role: lambdaRole,
      environment: {
        DB_SECRET_ARN: databaseSecret.secretArn,
        // NO hardcoded credentials!
      },
      tracing: lambda.Tracing.ACTIVE, // X-Ray tracing for monitoring
      reservedConcurrentExecutions: 10, // Prevent runaway costs
      timeout: cdk.Duration.seconds(30)
    });

    // ============ 6. DATA PROTECTION: Encrypted S3 with Access Logging ============
    const dataBucket = new s3.Bucket(this, 'DataBucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: s3Key,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      enforceSSL: true, // Require HTTPS
      serverAccessLogsPrefix: 'access-logs/',
      lifecycleRules: [
        {
          noncurrentVersionExpiration: cdk.Duration.days(30)
        }
      ]
    });

    // S3 bucket policy - deny unencrypted uploads
    dataBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:PutObject'],
        resources: [dataBucket.arnForObjects('*')],
        conditions: {
          StringNotEquals: {
            's3:x-amz-server-side-encryption': 'aws:kms'
          }
        }
      })
    );

    // ============ 7. COMPLIANCE: AWS Config Rules ============
    // Check if all EBS volumes are encrypted
    new config.ManagedRule(this, 'EBSEncryptionRule', {
      identifier: config.ManagedRuleIdentifiers.EC2_EBS_ENCRYPTION_BY_DEFAULT,
      description: 'Ensure all EBS volumes are encrypted'
    });

    // Check if RDS instances are encrypted
    new config.ManagedRule(this, 'RDSEncryptionRule', {
      identifier: config.ManagedRuleIdentifiers.RDS_STORAGE_ENCRYPTED,
      description: 'Ensure RDS instances are encrypted'
    });

    // Check if S3 buckets have encryption enabled
    new config.ManagedRule(this, 'S3EncryptionRule', {
      identifier: config.ManagedRuleIdentifiers.S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED,
      description: 'Ensure S3 buckets have encryption enabled'
    });

    // Check if CloudTrail is enabled
    new config.ManagedRule(this, 'CloudTrailRule', {
      identifier: config.ManagedRuleIdentifiers.CLOUD_TRAIL_ENABLED,
      description: 'Ensure CloudTrail is enabled'
    });

    // ============ 8. THREAT DETECTION: GuardDuty ============
    // Enable GuardDuty (done at account level, this is just a reference)
    /*
    const detector = new guardduty.CfnDetector(this, 'GuardDutyDetector', {
      enable: true,
      findingPublishingFrequency: 'FIFTEEN_MINUTES'
    });
    */

    // ============ 9. INCIDENT RESPONSE: Automated Remediation ============
    const securityTopic = new sns.Topic(this, 'SecurityAlertTopic', {
      displayName: 'Security Alerts'
    });

    // Lambda function for automated remediation
    const remediationFunction = new lambda.Function(this, 'RemediationFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'remediation.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Security event:', JSON.stringify(event, null, 2));
          
          // Parse GuardDuty finding
          const finding = JSON.parse(event.Records[0].Sns.Message);
          
          // Example: Isolate compromised EC2 instance
          if (finding.type === 'UnauthorizedAccess:EC2/MaliciousIPCaller') {
            const instanceId = finding.resource.instanceDetails.instanceId;
            
            // Call AWS SDK to isolate instance (remove from security group)
            console.log(\`Isolating instance: \${instanceId}\`);
            // await ec2.modifyInstanceAttribute(...);
          }
          
          return { statusCode: 200 };
        };
      `),
      environment: {
        SNS_TOPIC_ARN: securityTopic.topicArn
      }
    });

    securityTopic.grantPublish(remediationFunction);

    // EventBridge rule to trigger on GuardDuty findings
    const guardDutyRule = new events.Rule(this, 'GuardDutyEventRule', {
      eventPattern: {
        source: ['aws.guardduty'],
        detailType: ['GuardDuty Finding']
      }
    });

    guardDutyRule.addTarget(new targets.LambdaFunction(remediationFunction));
    guardDutyRule.addTarget(new targets.SnsTopic(securityTopic));

    // ============ 10. ACCESS CONTROL: IAM Policies with MFA ============
    // Example IAM policy requiring MFA for sensitive operations
    const mfaPolicy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: ['*'],
          resources: ['*'],
          conditions: {
            BoolIfExists: {
              'aws:MultiFactorAuthPresent': 'false'
            }
          }
        })
      ]
    });

    // ============ 11. OUTPUTS ============
    new cdk.CfnOutput(this, 'AuditLogBucketName', {
      value: auditBucket.bucketName,
      description: 'S3 bucket for audit logs'
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: databaseSecret.secretArn,
      description: 'Secrets Manager ARN for database credentials'
    });

    new cdk.CfnOutput(this, 'SecurityTopicArn', {
      value: securityTopic.topicArn,
      description: 'SNS topic for security alerts'
    });
  }
}

// ============ Application Code - Secure Database Access ============
// lambda/index.js
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { RDSDataClient, ExecuteStatementCommand } = require('@aws-sdk/client-rds-data');
const { Pool } = require('pg');

const secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION });

let dbPool;

// Initialize database connection with credentials from Secrets Manager
async function initializeDatabase() {
  if (dbPool) return dbPool;

  // Retrieve secret
  const secretResponse = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: process.env.DB_SECRET_ARN })
  );

  const secret = JSON.parse(secretResponse.SecretString);

  // Create connection pool with SSL
  dbPool = new Pool({
    host: secret.host,
    port: secret.port,
    database: secret.dbname,
    user: secret.username,
    password: secret.password,
    ssl: {
      rejectUnauthorized: true, // Enforce TLS
      ca: process.env.RDS_CA_CERT // AWS RDS CA certificate
    },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  });

  return dbPool;
}

exports.handler = async (event) => {
  const pool = await initializeDatabase();

  try {
    // Example: Query with parameterized statement (prevent SQL injection)
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 AND amount > $2',
      [event.userId, event.minAmount]
    );

    // Log access for audit (CloudWatch Logs)
    console.log(JSON.stringify({
      event: 'database_access',
      userId: event.userId,
      timestamp: new Date().toISOString(),
      query: 'SELECT transactions',
      rowCount: result.rows.length
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows)
    };
  } catch (error) {
    // Log error without exposing sensitive details
    console.error(JSON.stringify({
      event: 'database_error',
      error: error.message,
      timestamp: new Date().toISOString()
    }));

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// ============ Multi-Account Strategy (AWS Organizations) ============
/*
Recommended Account Structure:

1. Management Account (root)
   - AWS Organizations
   - Consolidated billing
   - No workloads

2. Security Account
   - AWS GuardDuty (delegated administrator)
   - AWS Security Hub
   - AWS Config aggregation
   - CloudTrail logs

3. Production Account
   - Production workloads
   - Strict IAM policies
   - MFA required
   - No direct access (via CI/CD only)

4. Development Account
   - Development workloads
   - More permissive access
   - Separate billing

5. Staging Account
   - Pre-production testing
   - Production-like environment

Benefits:
- Blast radius containment
- Separate billing
- Different compliance requirements
- Granular access control
*/

// ============ Compliance Checklist ============
/*
PCI-DSS Requirements:
✓ Network segmentation (VPC, Security Groups)
✓ Encryption at rest (KMS)
✓ Encryption in transit (TLS)
✓ Access controls (IAM, MFA)
✓ Audit logging (CloudTrail)
✓ Regular security testing (AWS Inspector)
✓ Secure key management (KMS with rotation)

GDPR Requirements:
✓ Data encryption (KMS)
✓ Access logging (CloudTrail)
✓ Data retention policies (S3 lifecycle)
✓ Right to be forgotten (S3 versioning for recovery)
✓ Breach notification (GuardDuty + SNS)

SOC 2 Requirements:
✓ Access controls (IAM)
✓ Change management (CloudFormation/CDK)
✓ Monitoring (CloudWatch)
✓ Incident response (Lambda automation)
✓ Business continuity (Multi-AZ, backups)
*/

// ============ Incident Response Runbook ============
/*
Detection:
1. GuardDuty finding triggers EventBridge rule
2. SNS notification sent to security team
3. Lambda function logs event to S3 for forensics

Containment:
1. Automated: Isolate compromised resources (security group changes)
2. Manual: Rotate compromised credentials in Secrets Manager
3. Disable compromised IAM users/roles

Investigation:
1. Review CloudTrail logs for unauthorized API calls
2. Check VPC Flow Logs for unusual network traffic
3. Analyze CloudWatch Logs for application-level anomalies

Recovery:
1. Restore from latest RDS snapshot (if data compromised)
2. Deploy new instances from golden AMI
3. Update security groups and WAF rules

Post-Incident:
1. Document timeline and root cause
2. Update security controls to prevent recurrence
3. Conduct team retrospective
*/
```

**Evaluation Criteria:**
- **Comprehensive security approach** covering all defense-in-depth layers
- **Proper encryption** for data at rest and in transit
- **Secrets management** without hardcoded credentials
- **Audit logging** for compliance and forensics
- **Network isolation** with VPC and security groups
- **Automated threat detection** with GuardDuty
- **Incident response automation** for rapid containment
- **Compliance awareness** (PCI-DSS, GDPR, SOC 2)
- **Multi-account strategy** for blast radius containment
- **IAM best practices** with least privilege and MFA

---

*End of Section 6: AWS Advanced Strategies & Security*


---

# SECTION 7: Databases — PostgreSQL, MySQL & Redis

---

## 7.1 Relational Engines

### Question 54: PostgreSQL vs MySQL
**Question:** Compare PostgreSQL and MySQL (InnoDB). How do they differ in MVCC, indexing options, JSON support, and replication? When would you pick each for a Node.js backend?

**Expected Answer:**
- **MVCC:** PostgreSQL keeps old row versions in the table heap (needs `VACUUM`/autovacuum to reclaim dead tuples). InnoDB keeps old versions in undo logs, so there's no vacuum, but long transactions grow the undo history.
- **Indexes:** PostgreSQL has B-tree, Hash, GIN (JSONB, arrays, full-text), GiST/SP-GiST (geo, ranges), BRIN (huge append-only tables), partial and expression indexes. InnoDB has B-tree clustered on the primary key (secondary indexes store the PK, so keep PKs small), full-text and spatial; functional indexes since 8.0.13.
- **JSON:** PostgreSQL `JSONB` is binary, indexable with GIN, with rich operators (`->`, `->>`, `@>`). MySQL `JSON` is indexed through generated columns or functional indexes.
- **Other:** PostgreSQL has `RETURNING`, CTEs including writable ones, window functions, `ON CONFLICT`, extensions (PostGIS, pgvector), and transactional DDL. MySQL has `ON DUPLICATE KEY UPDATE`, `LAST_INSERT_ID()`, and no transactional DDL.
- **Replication:** both support streaming/binlog async and semi-sync replicas. PostgreSQL also has logical replication; MySQL has Group Replication.
- **Choice:** PostgreSQL for complex queries, data integrity, JSON + relational, geo/vector. MySQL for simple read-heavy OLTP, existing ecosystem (WordPress, Vitess-scale sharding), or team familiarity. Both are fine for most CRUD services.

**Expected Solution:**
```javascript
// 1. Upsert
// PostgreSQL
const pgUpsert = `
  INSERT INTO users (email, name) VALUES ($1, $2)
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id`;
// MySQL
const myUpsert = `
  INSERT INTO users (email, name) VALUES (?, ?)
  ON DUPLICATE KEY UPDATE name = VALUES(name)`; // 8.0.20+: use row alias instead of VALUES()

// 2. JSON query + index
// PostgreSQL (JSONB)
//   CREATE INDEX idx_users_prefs ON users USING GIN (preferences);
//   SELECT * FROM users WHERE preferences @> '{"theme":"dark"}';
//   -- or expression index: CREATE INDEX ON users ((preferences->>'theme'));
// MySQL (JSON)
//   ALTER TABLE users ADD COLUMN theme VARCHAR(20)
//     GENERATED ALWAYS AS (preferences->>'$.theme') STORED, ADD INDEX idx_theme (theme);
//   SELECT * FROM users WHERE theme = 'dark';

// 3. Inserted id from Node.js
const { Pool } = require('pg');
const pg = new Pool();
async function createUserPg(email, name) {
  const { rows } = await pg.query(pgUpsert, [email, name]);
  return rows[0].id;
}

const mysql = require('mysql2/promise');
const my = mysql.createPool({ uri: process.env.MYSQL_URL });
async function createUserMysql(email, name) {
  const [result] = await my.execute(myUpsert, [email, name]);
  return result.insertId; // LAST_INSERT_ID()
}
```

**Evaluation Criteria:**
- Knows MVCC differs (vacuum vs undo log) and why it matters operationally
- Clustered PK in InnoDB and its effect on secondary indexes
- JSONB + GIN vs generated-column indexing
- Picks an engine from requirements, not preference

---

### Question 55: Transactions, Isolation Levels & Locking
**Question:** Explain transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the anomalies each prevents. What are the defaults in PostgreSQL and MySQL? Pessimistic vs optimistic locking?

**Expected Answer:**
- **Anomalies:** dirty read, non-repeatable read, phantom read, lost update, write skew.
- **Levels:**
  - Read Uncommitted: allows dirty reads (PostgreSQL treats it as Read Committed).
  - Read Committed: each statement sees committed data. **PostgreSQL default.**
  - Repeatable Read: a snapshot for the whole transaction. **MySQL InnoDB default** (gap/next-key locks reduce phantoms). In PostgreSQL it's snapshot isolation; concurrent updates fail with a serialization error.
  - Serializable: as if run one at a time. PostgreSQL uses SSI and aborts conflicting transactions, so **the app must retry** (SQLSTATE `40001`).
- **Pessimistic locking:** `SELECT ... FOR UPDATE` locks rows until commit. Good under high contention.
- **Optimistic locking:** a `version` column; `UPDATE ... WHERE id=? AND version=?` and retry if 0 rows changed. Good under low contention.
- **Deadlocks:** lock rows in a consistent order (e.g. by id), keep transactions short, retry on deadlock (`40P01` / MySQL `1213`).
- **Node.js gotcha:** a transaction must run on **one client checked out from the pool**, not `pool.query()` (each call may use a different connection).

**Expected Solution:**
```javascript
const { Pool } = require('pg');
const pool = new Pool();

// Pessimistic: lock both rows in id order to avoid deadlocks
async function transfer(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const [firstId, secondId] = fromId < toId ? [fromId, toId] : [toId, fromId];
    const { rows } = await client.query(
      'SELECT id, balance FROM accounts WHERE id IN ($1, $2) ORDER BY id FOR UPDATE',
      [firstId, secondId]
    );
    const from = rows.find(r => r.id === fromId);
    if (!from || rows.length !== 2) throw new Error('Account not found');
    if (Number(from.balance) < amount) throw new Error('Insufficient funds');

    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Optimistic: version column + retry
async function withdrawOptimistic(accountId, amount, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { rows: [acc] } = await pool.query(
      'SELECT balance, version FROM accounts WHERE id = $1', [accountId]
    );
    if (Number(acc.balance) < amount) throw new Error('Insufficient funds');
    const { rowCount } = await pool.query(
      `UPDATE accounts SET balance = balance - $1, version = version + 1
       WHERE id = $2 AND version = $3`,
      [amount, accountId, acc.version]
    );
    if (rowCount === 1) return;
  }
  throw new Error('Concurrent modification, retries exhausted');
}

// Serializable needs a retry loop on 40001
async function runSerializable(work, retries = 3) {
  for (let attempt = 0; ; attempt++) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
      const result = await work(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      if (err.code === '40001' && attempt < retries) continue;
      throw err;
    } finally {
      client.release();
    }
  }
}
```

**Evaluation Criteria:**
- Names the anomalies and maps them to levels; knows both engines' defaults
- Uses a single pooled client for the transaction, with ROLLBACK and release in finally
- Prevents the race (FOR UPDATE or atomic conditional UPDATE)
- Consistent lock ordering for deadlocks; retry on serialization failures

---

## 7.2 Redis

### Question 56: Redis Data Structures & Caching Patterns
**Question:** What is Redis and why is it fast? Explain its core data structures and when to use each. Compare cache-aside, write-through, and write-behind. How do you handle cache invalidation, stampedes, and eviction? Why is Redis a common session store, and how do you implement one?

**Expected Answer:**
- **Why fast:** in-memory, single-threaded command execution (no locks; I/O threads optional since 6.0), efficient encodings. Every command is atomic; a slow command (`KEYS *`, big `SMEMBERS`) blocks everyone, so use `SCAN`.
- **Structures:** String (cache values, counters `INCR`), Hash (objects/fields), List (queues), Set (unique members, tags), Sorted Set (leaderboards, time-ordered, sliding-window rate limits), Streams (event log with consumer groups), plus bitmaps, HyperLogLog, geo.
- **Persistence:** RDB snapshots vs AOF log (or both). It's a cache first; don't treat it as the source of truth unless configured for it.
- **Patterns:**
  - Cache-aside (lazy): app reads cache → on miss, reads DB and fills cache. Most common.
  - Write-through: write cache and DB together; cache is always fresh, but writes are slower.
  - Write-behind: write cache, flush to DB asynchronously; fast, but data loss risk.
- **Invalidation:** TTL on every key; delete (not update) the key on writes; versioned keys.
- **Stampede:** lock with `SET key NX PX` so only one caller rebuilds, plus stale-while-revalidate or TTL jitter.
- **Eviction:** `maxmemory` + policy (`allkeys-lru`, `allkeys-lfu`, `volatile-ttl`, `noeviction`).
- **Session store:** sessions need fast key lookup, shared state across all app instances (so no sticky sessions), and automatic expiry → a Redis key `sess:{id}` with TTL. Sliding expiration = refresh the TTL on each read. Logout = `DEL`. With `express-session`, use `connect-redis`. The cookie holds only the random session id (`HttpOnly`, `Secure`, `SameSite`).
- **Scaling:** replicas + Sentinel for HA; Redis Cluster shards 16384 hash slots (multi-key ops need the same slot, via `{hashtag}`).

**Expected Solution:**
```javascript
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// 1. Cache-aside
async function getOrSet(key, ttlSeconds, fetchFn) {
  const cached = await redis.get(key);
  if (cached !== null) return JSON.parse(cached);
  const value = await fetchFn();
  const jitter = Math.floor(Math.random() * 30); // spread expirations
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds + jitter);
  return value;
}
// usage: getOrSet(`product:${id}`, 300, () => db.findProduct(id))
// on product update: await redis.del(`product:${id}`)

// 2. Stampede protection with a short lock
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function getOrSetLocked(key, ttlSeconds, fetchFn, waitMs = 50, maxWaits = 40) {
  for (let i = 0; i < maxWaits; i++) {
    const cached = await redis.get(key);
    if (cached !== null) return JSON.parse(cached);

    const lockKey = `lock:${key}`;
    const gotLock = await redis.set(lockKey, '1', 'PX', 5000, 'NX');
    if (gotLock) {
      try {
        const value = await fetchFn();
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return value;
      } finally {
        await redis.del(lockKey);
      }
    }
    await sleep(waitMs); // someone else is rebuilding
  }
  return fetchFn(); // fallback: don't fail the request
}

// 3. Fixed-window rate limiter
async function isAllowed(userId, limit = 100, windowSec = 60) {
  const window = Math.floor(Date.now() / 1000 / windowSec);
  const key = `rate:${userId}:${window}`;
  const [[, count]] = await redis.multi().incr(key).expire(key, windowSec).exec();
  return count <= limit;
}

// 4. Leaderboard
async function addScore(userId, points) {
  await redis.zincrby('leaderboard', points, userId);
}
async function top10() {
  const flat = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
  const result = [];
  for (let i = 0; i < flat.length; i += 2) {
    result.push({ userId: flat[i], score: Number(flat[i + 1]) });
  }
  return result;
}

// 5. Session store
const crypto = require('crypto');
const SESSION_TTL = 60 * 30; // 30 min sliding
async function createSession(data) {
  const id = crypto.randomBytes(32).toString('hex');
  await redis.set(`sess:${id}`, JSON.stringify(data), 'EX', SESSION_TTL);
  return id; // goes into an HttpOnly, Secure cookie
}
async function getSession(id) {
  const raw = await redis.getex(`sess:${id}`, 'EX', SESSION_TTL); // read + refresh TTL (Redis 6.2+)
  return raw ? JSON.parse(raw) : null;
}
async function destroySession(id) {
  await redis.del(`sess:${id}`);
}
```

**Evaluation Criteria:**
- Picks the right structure per use case (sorted set for ranking, INCR for counters)
- Cache-aside with TTL, and invalidates by delete on write
- Knows stampede mitigations (lock, jitter, stale-while-revalidate)
- Knows eviction policies and that blocking commands hurt everyone
- Atomicity: MULTI/Lua for multi-step operations
- Session store: random id in the cookie, data in Redis with sliding TTL, delete on logout

---

*End of Section 7: Databases — PostgreSQL, MySQL & Redis*

# SECTION 8: Added — 2026-10-28

---

## 8.1 JavaScript

### Question 57: Counting Vowels & Consonants
**Question:** Write a function that takes a string as its only argument and returns an object with the number of vowels and consonants. How do you handle case, accents, spaces, digits and punctuation? What's the complexity?

**Expected Answer:**
- Normalize first: `toLowerCase()`, then `normalize('NFD').replace(/\p{Diacritic}/gu, '')` (or `/[̀-ͯ]/g`) so `á` counts as `a`
- Count only letters: a char is a consonant only if it's a letter and not a vowel (`/\p{L}/u` or `/[a-z]/`), so spaces, digits and punctuation are ignored
- Decide on edge cases and say so: `y`, `ñ` (a consonant, but NFD turns it into `n` + tilde, which is still fine), empty string, non-string input (throw `TypeError`)
- Use a `Set` for vowel lookup: O(1) per char, O(n) time overall, O(1) extra space
- A single loop beats `match()` twice for very long strings, but both are O(n); readability usually wins

**Code Challenge:**
```javascript
// 1. count('gato') → { vowels: 2, consonants: 2 }
// 2. Make it case-insensitive and ignore spaces, digits and punctuation: count('Hola, Mundo 2024!')
// 3. Treat accented vowels as vowels: count('canción') → { vowels: 3, consonants: 4 }
// 4. Write a second version with reduce (or regex) and compare readability and complexity
```

**Expected Solution:**
```javascript
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function count(str) {
  if (typeof str !== 'string') throw new TypeError('Expected a string');
  const clean = str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const result = { vowels: 0, consonants: 0 };
  for (const ch of clean) {
    if (VOWELS.has(ch)) result.vowels++;
    else if (ch >= 'a' && ch <= 'z') result.consonants++;
  }
  return result;
}

count('gato');              // { vowels: 2, consonants: 2 }
count('Hola, Mundo 2024!'); // { vowels: 4, consonants: 5 }
count('canción');           // { vowels: 3, consonants: 4 }

// 4. Regex version: shorter, also O(n) (two passes)
const countRegex = (str) => {
  const clean = str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return {
    vowels: (clean.match(/[aeiou]/g) || []).length,
    consonants: (clean.match(/[b-df-hj-np-tv-z]/g) || []).length,
  };
};

// reduce version
const countReduce = (str) =>
  [...str.toLowerCase().normalize('NFD')].reduce((acc, ch) => {
    if (VOWELS.has(ch)) acc.vowels++;
    else if (/[a-z]/.test(ch)) acc.consonants++;
    return acc;
  }, { vowels: 0, consonants: 0 });
```

**Evaluation Criteria:**
- Correct output for the basic case
- Ignores non-letters instead of counting them as consonants
- Handles case and accents (normalize NFD)
- States O(n) time, O(1) space; uses a Set or regex instead of nested loops
- Validates input

---

### Question 58: Data Types, null vs undefined & Symbol
**Question:** What data types exist in JavaScript? Which are primitives and which are structural? What's the difference between `null` and `undefined`? What is `Symbol` used for?

**Expected Answer:**
- **7 primitives:** `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`. Immutable, compared by value
- **Structural:** `Object` and everything built on it: arrays, functions, Date, Map/Set, RegExp, class instances. Compared by reference
- `typeof null === 'object'` is a historical bug; `typeof function` is `'function'`; arrays need `Array.isArray`
- **undefined:** "no value assigned yet". Set by the engine: uninitialized variables, missing properties, missing arguments, functions without `return`
- **null:** "intentionally empty". Set by the developer
- `null == undefined` is `true`, `===` is `false`. Default parameters and destructuring defaults apply to `undefined` only, not `null`. `??` treats both as missing. JSON keeps `null` but drops `undefined` keys
- **Symbol:** a unique, non-string property key. Uses:
    - collision-free keys / "hidden" metadata (skipped by `Object.keys`, `for...in`, `JSON.stringify`; still visible with `Object.getOwnPropertySymbols`, so not private)
    - well-known symbols to hook into the language: `Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toPrimitive`, `Symbol.hasInstance`
    - `Symbol.for(key)` for a global registry shared across modules
- Wrapper objects (`new String('x')`) exist but shouldn't be used

**Code Challenge:**
```javascript
// 1. Predict the output:
typeof null;            // ?
typeof undefined;       // ?
typeof NaN;             // ?
typeof [];              // ?
typeof function () {};  // ?
typeof Symbol('id');    // ?
typeof 10n;             // ?
null == undefined;      // ?
null === undefined;     // ?

// 2. Write getType(value) that returns 'null', 'array', 'date', 'object', 'string', etc.
// 3. Use a Symbol to add a hidden metadata key to an object that doesn't show up in JSON.stringify or Object.keys
// 4. Make a class iterable with Symbol.iterator
```

**Expected Solution:**
```javascript
// 1.
typeof null;            // 'object' (legacy bug)
typeof undefined;       // 'undefined'
typeof NaN;             // 'number'
typeof [];              // 'object'
typeof function () {};  // 'function'
typeof Symbol('id');    // 'symbol'
typeof 10n;             // 'bigint'
null == undefined;      // true
null === undefined;     // false

// 2.
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
getType(null);       // 'null'
getType([]);         // 'array'
getType(new Date()); // 'date'
getType({});         // 'object'

// 3.
const META = Symbol('meta');
const user = { name: 'Ana', [META]: { loadedAt: Date.now() } };
Object.keys(user);     // ['name']
JSON.stringify(user);  // '{"name":"Ana"}'
user[META].loadedAt;   // still accessible with the symbol

// 4.
class Playlist {
  #songs = [];
  add(song) { this.#songs.push(song); return this; }
  *[Symbol.iterator]() { yield* this.#songs; }
}
const p = new Playlist().add('a').add('b');
console.log([...p]); // ['a', 'b']
```

**Evaluation Criteria:**
- Lists all 7 primitives, including bigint and symbol
- Explains null vs undefined as intent (developer vs engine), plus the default-parameter and JSON differences
- Knows typeof quirks and a reliable type check
- Gives real Symbol uses (well-known symbols, collision-free keys), and knows symbols aren't truly private

---

### Question 59: Primitives vs References: Memory & Mutability
**Question:** How is memory managed for primitive values compared to objects/arrays (stack vs heap, copy by value vs by reference)? What is mutability, and why does it matter? Is JavaScript pass-by-value or pass-by-reference? How does garbage collection work?

**Expected Answer:**
- **Mental model:** primitives are copied by value. Objects live on the heap, and variables hold a reference to them. Assigning an object copies the reference, not the object. (Engines optimize this, e.g. small integers stored inline, but the model is what matters.)
- **Pass-by-value always:** for objects, the value passed is the reference ("call by sharing"). Mutating `obj.x` inside a function is visible outside; reassigning `obj = {}` is not
- **Mutability:** primitives are immutable (`str.toUpperCase()` returns a new string). Objects/arrays are mutable unless frozen. `const` prevents rebinding, not mutation
- **Why it matters:** shared mutable state causes bugs that are hard to trace (a function quietly changing its input), React/Redux change detection relies on new references, and concurrency in async code makes it worse
- **Copies:** spread / `Object.assign` are shallow (nested objects are shared). `structuredClone` does a deep copy (not functions/classes). `JSON.parse(JSON.stringify())` loses Dates, undefined, Map
- **GC:** V8 uses mark-and-sweep from roots (global, stack, closures), generational (young generation "scavenge" + old generation mark-compact). An object is collected when it's unreachable. Reference cycles aren't a problem
- **Leaks:** something reachable that you don't need: globals, growing caches/Maps, unremoved listeners/timers, closures holding big objects. Use `WeakMap`/`WeakRef` for caches keyed by objects

**Code Challenge:**
```javascript
// 1. Predict the output and explain:
let a = 10;
let b = a;
b++;
console.log(a, b); // ?

const user1 = { name: 'Ana', tags: ['admin'] };
const user2 = user1;
const user3 = { ...user1 };
user2.name = 'Luis';
user3.tags.push('editor');
console.log(user1); // ?

function reassign(obj) { obj = { name: 'new' }; }
function mutate(obj) { obj.name = 'mutated'; }
reassign(user1); mutate(user1);
console.log(user1.name); // ?

// 2. Write an updateUser(user, changes) that returns a new object without mutating the input (nested address included)
// 3. Show a memory leak caused by a reference that is never released, and fix it
```

**Expected Solution:**
```javascript
// 1.
// 10 11 → numbers copied by value
// { name: 'Luis', tags: ['admin', 'editor'] }
//   user2 is the same object; user3 is a shallow copy that shares the tags array
// 'mutated' → reassign only changed the local parameter; mutate changed the shared object

// 2.
function updateUser(user, changes) {
  return {
    ...user,
    ...changes,
    address: { ...user.address, ...changes.address },
  };
}
// or: const copy = structuredClone(user); then apply changes to the copy

// 3. Leak: listener added per request, never removed, closure keeps big data alive
const EventEmitter = require('events');
const bus = new EventEmitter();
function handleRequest(req) {
  const bigPayload = Buffer.alloc(10 * 1024 * 1024);
  bus.on('tick', () => console.log(bigPayload.length)); // grows forever
}
// Fix: remove it when done (or use once / AbortSignal)
function handleRequestFixed(req) {
  const bigPayload = Buffer.alloc(10 * 1024 * 1024);
  const onTick = () => console.log(bigPayload.length);
  bus.on('tick', onTick);
  req.on('close', () => bus.off('tick', onTick));
}
// Same idea for caches: use a bounded LRU, or a WeakMap keyed by the object
```

**Evaluation Criteria:**
- Correct predictions, including the shared nested array after spread
- Says "pass by value of the reference", not "pass by reference"
- Distinguishes `const` from immutability
- Knows shallow vs deep copy options and their limits
- Explains reachability-based GC and gives a realistic leak plus fix

---

### Question 60: Function Types, IIFE & call/apply/bind
**Question:** What kinds of functions exist in JavaScript (declarations, expressions, arrow, methods, constructors, async, generators)? What is an IIFE and why was it used? What do `call`, `apply` and `bind` do, and when would you use each?

**Expected Answer:**
- **Declaration** (hoisted with body), **expression** (named or anonymous, follows variable hoisting), **arrow** (no own `this`/`arguments`/`super`/`new.target`, can't be a constructor, concise body), **method shorthand** (has `super`), **constructor**/`class`, **async** (returns a Promise), **generator** (`function*`), async generator, `new Function()` (avoid)
- Functions are first-class objects: they can be passed, returned, stored, and they have properties (`name`, `length`)
- **IIFE** `(function () { ... })()`: runs immediately and creates a private scope. Before ES modules and `let`, it was the way to avoid polluting globals and to build the module pattern. Still used for top-level `async` in CommonJS: `(async () => { ... })()`
- **call(thisArg, a, b):** invoke now with explicit `this` and listed args
- **apply(thisArg, [a, b]):** same, args as an array (mostly replaced by spread)
- **bind(thisArg, a):** returns a new function with `this` fixed and optional preset args (partial application). Used for callbacks that lose `this` (`setTimeout`, event handlers). Bound `this` can't be changed again, and arrow functions ignore it
- Function borrowing: `Array.prototype.slice.call(arguments)`; today use `Array.from`

**Code Challenge:**
```javascript
// 1. Write a counter module with an IIFE that exposes increment() and getCount() but hides the count
// 2. Borrow Array.prototype methods with call/apply on an array-like object ({ 0: 'a', 1: 'b', length: 2 })
// 3. Find the max of an array using Math.max with apply, then with spread
// 4. Fix the lost `this` in: setTimeout(user.greet, 100) using bind
// 5. Implement your own Function.prototype.myBind (with partial application)
```

**Expected Solution:**
```javascript
// 1.
const counter = (function () {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
})();

// 2.
const arrayLike = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.map.call(arrayLike, (s) => s.toUpperCase()); // ['A', 'B']
Array.prototype.join.apply(arrayLike, ['-']);                 // 'a-b'

// 3.
const nums = [3, 9, 2];
Math.max.apply(null, nums); // 9
Math.max(...nums);          // 9 (large arrays: use reduce to avoid arg limits)

// 4.
const user = { name: 'Ana', greet() { console.log(`Hi ${this.name}`); } };
setTimeout(user.greet.bind(user), 100);
// or: setTimeout(() => user.greet(), 100);

// 5.
Function.prototype.myBind = function (thisArg, ...preset) {
  const fn = this;
  function bound(...later) {
    // when called with new, ignore thisArg (like native bind)
    const ctx = this instanceof bound ? this : thisArg;
    return fn.apply(ctx, [...preset, ...later]);
  }
  bound.prototype = Object.create(fn.prototype);
  return bound;
};
const add = (a, b, c) => a + b + c;
add.myBind(null, 1, 2)(3); // 6
```

**Evaluation Criteria:**
- Names the function kinds and the arrow-function differences
- Explains why IIFEs existed and that modules/block scope replaced them
- Clear call vs apply vs bind distinction, with real use cases
- Working bind polyfill with partial application (handling `new` is a bonus)

---

### Question 61: Generators & Iterators
**Question:** What is a generator function? How does `yield` work, and how do generators relate to the iteration protocol? When would you use a generator in a real backend? What are async generators?

**Expected Answer:**
- `function*` returns a generator object without running the body. Each `next()` runs until the next `yield`, then pauses and keeps its local state
- `next()` returns `{ value, done }`. `next(x)` sends `x` back in as the result of the `yield` expression. `return()` and `throw()` end it from outside
- Generators implement both the **iterator** protocol (`next`) and the **iterable** protocol (`[Symbol.iterator]` returns itself), so they work with `for...of`, spread and destructuring
- `yield*` delegates to another iterable
- **Use cases:** lazy/infinite sequences, processing big data without loading it all, custom iterables for data structures, ID generators, step-by-step state machines. Historically: async flow before async/await (co, redux-saga)
- **Async generators** (`async function*`) yield promises and are consumed with `for await...of`: paginated APIs, reading streams line by line, DB cursors. Node readable streams are async iterables
- Lazy evaluation means you only pay for what you consume; with `break` the generator's `finally` still runs (cleanup)

**Code Challenge:**
```javascript
// 1. Write an idGenerator() that yields 1, 2, 3, ... forever, and take the first 5 values
// 2. Write a range(start, end, step) generator usable in for...of
// 3. Write a lazy pipeline: take(filter(map(naturals(), x => x * 2), x => x % 3 === 0), 5)
// 4. Write an async generator that pages through an API (page 1, 2, ... until empty) and consume it with for await...of
```

**Expected Solution:**
```javascript
// 1.
function* idGenerator() {
  let id = 1;
  while (true) yield id++;
}
const ids = idGenerator();
const first5 = Array.from({ length: 5 }, () => ids.next().value); // [1,2,3,4,5]

// 2.
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) yield i;
}
for (const n of range(0, 10, 3)) console.log(n); // 0 3 6 9

// 3.
function* naturals() { let n = 1; while (true) yield n++; }
function* map(it, fn) { for (const x of it) yield fn(x); }
function* filter(it, fn) { for (const x of it) if (fn(x)) yield x; }
function* take(it, n) {
  if (n <= 0) return;
  for (const x of it) { yield x; if (--n === 0) return; }
}
[...take(filter(map(naturals(), x => x * 2), x => x % 3 === 0), 5)]; // [6, 12, 18, 24, 30]

// 4.
async function* fetchAllUsers(baseUrl) {
  let page = 1;
  while (true) {
    const res = await fetch(`${baseUrl}/users?page=${page}`);
    const users = await res.json();
    if (users.length === 0) return;
    yield* users;
    page++;
  }
}
(async () => {
  for await (const user of fetchAllUsers('https://api.example.com')) {
    console.log(user.id);
  }
})();
```

**Evaluation Criteria:**
- Explains pause/resume and the `{ value, done }` protocol
- Connects generators to iterables (`for...of`, spread)
- Gives backend use cases (lazy data, pagination, streams), not just toy examples
- Uses async generators with `for await...of` correctly

---

## 8.2 Node.js

### Question 62: NPM Scripts, npx & Node Version Managers
**Question:** How do npm scripts work? When do you need `npm run` and when not (`npm start`, `npm test`)? What are `pre`/`post` scripts and lifecycle hooks? What is `npx` for? How do you force a transitive dependency version (`overrides`/`resolutions`)? What are nvm and `n`, and how do they differ?

**Expected Answer:**
- Scripts live in `package.json` `"scripts"` and run in a shell with `node_modules/.bin` added to `PATH`, so local CLIs (jest, eslint) work without global installs
- **`run` is optional** for built-in aliases: `npm start`, `npm test` (`npm t`), `npm stop`, `npm restart`. Every custom script needs `npm run <name>`. `npm run` with no name lists scripts
- **pre/post:** `npm run build` runs `prebuild` → `build` → `postbuild` automatically. Lifecycle hooks: `preinstall`, `install`, `postinstall`, `prepare` (runs on install and before publish; used for husky), `prepublishOnly`. pnpm and Yarn Berry don't run arbitrary pre/post by default, so explicit chaining is more portable
- **Args:** `npm test -- --watch` passes `--watch` to the script's command. Env: `npm_package_version`, `npm_lifecycle_event`
- **Chaining:** `&&` sequential, `npm-run-all`/`concurrently` for parallel; `cross-env` for env vars on Windows
- **npx:** runs a package binary, local if installed, otherwise downloads it to a temporary cache (`npx create-vite`, `npx prisma migrate`). Avoids global installs and version drift. Watch out for typosquatting
- **Force versions:** npm `overrides` (8.3+), Yarn `resolutions`, pnpm `pnpm.overrides`. Used for security patches in transitive deps. Document why, and remove once upstream fixes it
- **nvm:** shell script, installs versions per user, `.nvmrc` + `nvm use`, per-shell switching. **n:** npm package, simpler, switches the global node binary (needs write access to its prefix). Alternatives: fnm, volta (auto-switch per project). Pin with `.nvmrc` and `"engines"` (with `engine-strict`)

**Code Challenge:**
```javascript
// Write the package.json "scripts" (and other fields) for:
// 1. start, dev (nodemon), test, lint and build scripts
// 2. A "prebuild" that cleans dist/ and a "postbuild" that copies assets
// 3. Passing extra arguments to a script (run jest in watch mode from the test script)
// 4. Force every copy of "minimist" in the dependency tree to 1.2.8
// 5. Pin the Node version for the project (.nvmrc + "engines")
// Also: run a CLI tool once without installing it globally
```

**Expected Solution:**
```javascript
// package.json
{
  "name": "orders-api",
  "engines": { "node": ">=20 <23" },
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon --watch src src/server.ts",
    "prebuild": "rimraf dist",
    "build": "tsc -p tsconfig.build.json",
    "postbuild": "cp -r src/templates dist/templates",
    "test": "jest",
    "test:watch": "npm test -- --watch",
    "lint": "eslint .",
    "prepare": "husky"
  },
  "overrides": {
    "minimist": "1.2.8"
  }
  // Yarn: "resolutions": { "**/minimist": "1.2.8" }
}

// .nvmrc
// 20

// Shell:
// npm start                 (no "run" needed)
// npm run build             (runs prebuild → build → postbuild)
// npm test -- --coverage    (extra args after --)
// nvm install && nvm use    (reads .nvmrc)
// npx npm-check-updates     (run once without installing globally)
```

**Evaluation Criteria:**
- Knows which scripts need `run` and how pre/post hooks chain
- Knows `node_modules/.bin` is on PATH and how to pass args with `--`
- Explains npx and why it's better than global installs
- Knows overrides/resolutions and when to use them
- Can compare nvm and n and pin the Node version for a project

---

### Question 63: EventEmitter
**Question:** What is the `EventEmitter` in Node.js? How do `on`, `once`, `emit`, `off` and `prependListener` work? Are listeners called synchronously or asynchronously? How are errors handled, and what is the max listeners warning?

**Expected Answer:**
- `events.EventEmitter` is Node's Observer pattern implementation. Streams, `http.Server`, `process`, sockets and child processes all extend it
- `on(event, fn)` adds a listener, `once` removes it after the first call, `off`/`removeListener` needs the same function reference, `prependListener` puts it first, `emit(event, ...args)` returns `true` if there were listeners
- **Listeners run synchronously**, in registration order, inside `emit`. An exception in a listener goes up to the `emit` caller. To defer work, use `setImmediate`/`queueMicrotask` inside the listener
- **`'error'` is special:** emitting `'error'` with no listener throws and can crash the process. Always attach one. `captureRejections: true` routes rejected async listeners into `'error'`
- **MaxListenersExceededWarning** at more than 10 listeners per event: usually a leak (adding a listener per request). Raise the limit with `setMaxListeners` only if it's intentional
- `events.once(emitter, name, { signal })` returns a promise; `events.on()` returns an async iterator
- `this` inside a regular-function listener is the emitter (not with arrow functions)

**Code Challenge:**
```javascript
// 1. Create an OrderService class that extends EventEmitter and emits 'created' and 'paid' events
// 2. Register a one-time listener and a regular listener; show the order they run in
// 3. Handle the 'error' event correctly (what happens if nobody listens?)
// 4. Wait for an event with a timeout using events.once() and AbortSignal
// 5. Implement a minimal EventEmitter yourself (on, once, off, emit)
```

**Expected Solution:**
```javascript
const { EventEmitter, once } = require('events');

// 1.
class OrderService extends EventEmitter {
  create(order) {
    const saved = { ...order, id: Date.now(), status: 'created' };
    this.emit('created', saved);
    return saved;
  }
  pay(order) {
    if (!order.total) {
      this.emit('error', new Error(`Order ${order.id} has no total`));
      return;
    }
    this.emit('paid', { ...order, status: 'paid' });
  }
}

// 2.
const service = new OrderService();
service.on('created', (o) => console.log('A: email', o.id));
service.once('created', (o) => console.log('B: first order bonus'));
service.prependListener('created', () => console.log('C: audit'));
console.log('before');
service.create({ total: 10 }); // C, A, B (sync, in order; prepend goes first)
service.create({ total: 20 }); // C, A (once removed)
console.log('after');          // logs after all listeners: emit is synchronous

// 3. Without this listener, pay({}) throws "Unhandled 'error' event" and crashes
service.on('error', (err) => console.error('order error:', err.message));
service.pay({ id: 1 });

// 4.
async function waitForPaid(svc, ms = 5000) {
  const [order] = await once(svc, 'paid', { signal: AbortSignal.timeout(ms) });
  return order; // rejects with AbortError on timeout
}

// 5.
class MiniEmitter {
  #listeners = new Map();
  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
    return this;
  }
  off(event, fn) {
    const list = this.#listeners.get(event) || [];
    this.#listeners.set(event, list.filter((l) => l !== fn && l.original !== fn));
    return this;
  }
  once(event, fn) {
    const wrapper = (...args) => { this.off(event, wrapper); fn.apply(this, args); };
    wrapper.original = fn;
    return this.on(event, wrapper);
  }
  emit(event, ...args) {
    const list = this.#listeners.get(event);
    if (!list || list.length === 0) {
      if (event === 'error') throw args[0];
      return false;
    }
    [...list].forEach((fn) => fn.apply(this, args)); // copy: once() mutates the list
    return true;
  }
}
```

**Evaluation Criteria:**
- Knows listeners run synchronously and in order
- Always handles `'error'` and knows the crash behavior
- Recognizes the max-listeners warning as a likely leak
- Uses `events.once` with a signal for promise-based waiting
- Working mini implementation (copies the listener array before iterating, once/off interplay)

---

### Question 64: Core Modules & CommonJS vs ESM
**Question:** What are Node.js core modules, and which ones do you use most (fs, path, http, events, stream, crypto, os, util, url, child_process, worker_threads)? What are the differences between CommonJS and ECMAScript Modules (loading, syntax, `this`, `__dirname`, top-level await, interop)?

**Expected Answer:**
- Core modules ship with Node, need no install, and are best imported with the `node:` prefix (`node:fs`), which can't be shadowed by an npm package
- Common ones: `fs`/`fs/promises` (files), `path` (cross-platform paths), `http`/`https`/`http2`, `events`, `stream` (+ `stream/promises` pipeline), `crypto` (hashing, randomUUID, scrypt), `os`, `util` (promisify, inspect, types), `url`, `zlib`, `child_process`, `worker_threads`, `cluster`, `buffer`, `timers/promises`, `async_hooks` (AsyncLocalStorage), `perf_hooks`, `test` (built-in test runner)
- **CommonJS:** `require`/`module.exports`, synchronous, resolved at runtime (can be conditional/dynamic), `__dirname`/`__filename` available, top-level `this === module.exports`, exports are a value copy at require time
- **ESM:** `import`/`export`, statically analyzable (tree shaking), asynchronous loading, live bindings, strict mode by default, top-level `this` is `undefined`, top-level `await`, no `__dirname` (use `import.meta.dirname` in Node 20.11+ or `fileURLToPath(import.meta.url)`), file extensions required in relative imports
- **Enable ESM:** `.mjs`, or `"type": "module"` in package.json (then `.cjs` for CommonJS files)
- **Interop:** ESM can `import` CJS (default import = `module.exports`; named exports only when detectable). CJS can't `require` async ESM; use `await import()`. Newer Node (22.12+) allows `require(esm)` for ESM without top-level await
- Packages: `"exports"` field with `"import"`/`"require"` conditions for dual packages

**Code Challenge:**
```javascript
// 1. Using only core modules, build an HTTP server that serves a JSON file from disk
// 2. Hash a password with crypto.scrypt and compare it with timingSafeEqual
// 3. Convert this CommonJS module to ESM (including __dirname):
const path = require('path');
const config = require('./config.json');
module.exports = { configPath: path.join(__dirname, 'config.json'), config };
// 4. Import a CommonJS package from ESM and an ESM-only package from CommonJS
```

**Expected Solution:**
```javascript
// 1.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/data') {
    const file = path.join(__dirname, 'data.json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    fs.createReadStream(file)
      .on('error', () => { res.statusCode = 500; res.end(); })
      .pipe(res);
    return;
  }
  res.writeHead(404).end();
}).listen(3000);

// 2.
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}
async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  const hash = await scrypt(password, Buffer.from(saltHex, 'hex'), 64);
  return crypto.timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));
}

// 3. ESM version (config.mjs)
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// import config from './config.json' with { type: 'json' };
// const __dirname = path.dirname(fileURLToPath(import.meta.url)); // or import.meta.dirname
// export const configPath = path.join(__dirname, 'config.json');
// export { config };

// 4.
// ESM importing CJS:
//   import express from 'express';           // default = module.exports
// CJS importing an ESM-only package (e.g. node-fetch v3):
//   async function main() {
//     const { default: fetch } = await import('node-fetch');
//   }
```

**Evaluation Criteria:**
- Names the core modules a backend uses and what each is for; uses the `node:` prefix
- Clear CJS vs ESM differences: sync vs async, static analysis, live bindings, `__dirname`, top-level await
- Knows how to enable ESM and how interop works in both directions
- Uses timing-safe comparison and streams where appropriate

---

### Question 65: Child Processes, Cluster & Worker Threads
**Question:** Explain `spawn`, `exec`, `execFile` and `fork`. How does IPC work between parent and child? How do `cluster` and `worker_threads` differ, and when would you use each? What are C++ addons (N-API) for?

**Expected Answer:**
- **spawn(cmd, args):** starts a process and gives you streams (stdout/stderr). No shell by default. Best for long-running processes or large output
- **exec(cmdString):** runs through a shell and buffers the whole output (`maxBuffer`, default 1 MB). Convenient, but shell injection risk with user input
- **execFile(file, args):** like exec but without a shell: safer, args passed as an array
- **fork(modulePath):** spawn specialized for Node scripts, with an IPC channel: `child.send(msg)` / `process.on('message')`. Messages are serialized (JSON or advanced serialization), so no shared memory
- All are separate OS processes: own memory and V8 instance, expensive to start (~30 ms+, tens of MB)
- **cluster:** forks N copies of the server that share a listening port (the primary distributes connections, round-robin on Linux). Uses all CPU cores for I/O-bound HTTP servers and gives crash isolation. In containers you'd usually run one process per container and scale with replicas instead
- **worker_threads:** threads in the same process, each with its own event loop and V8 isolate. Cheaper than processes, can share memory (`SharedArrayBuffer`, `Atomics`) and transfer `ArrayBuffer`s without copying. For CPU-heavy work (image processing, hashing, parsing) that would block the event loop. Use a pool (piscina) instead of creating a worker per request
- **Not for I/O:** Node's I/O is already async; threads help with CPU-bound work
- **C++ addons:** native modules through Node-API (N-API, ABI-stable across Node versions) or node-addon-api. Used to wrap existing C/C++ libraries (bcrypt, sharp, sqlite3) or for hot CPU paths. Cost: build toolchain (node-gyp), platform-specific binaries (prebuilds). WebAssembly is often a simpler alternative

**Code Challenge:**
```javascript
// 1. Run `ls -la` with spawn and stream its output
// 2. Run a git command with execFile and explain why exec is dangerous with user input
// 3. fork a child process and exchange messages with it (IPC)
// 4. Move a CPU-heavy calculation (e.g. fib(40)) to a worker thread so the HTTP server stays responsive
// 5. Use cluster to run one HTTP server per CPU core and restart workers that crash
```

**Expected Solution:**
```javascript
const { spawn, execFile, fork } = require('node:child_process');

// 1.
const ls = spawn('ls', ['-la']);
ls.stdout.pipe(process.stdout);
ls.on('close', (code) => console.log(`exit ${code}`));

// 2.
execFile('git', ['log', '-1', '--format=%H'], (err, stdout) => {
  if (err) throw err;
  console.log(stdout.trim());
});
// exec(`git checkout ${branch}`) with branch = "main; rm -rf /" runs both commands (shell injection)

// 3. parent.js
const child = fork('./child.js');
child.send({ type: 'sum', numbers: [1, 2, 3] });
child.on('message', (msg) => { console.log('result', msg.result); child.kill(); });
// child.js
// process.on('message', (msg) => {
//   if (msg.type === 'sum') process.send({ result: msg.numbers.reduce((a, b) => a + b, 0) });
// });

// 4.
// server.js
const http = require('node:http');
const { Worker } = require('node:worker_threads');
function runFib(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./fib-worker.js', { workerData: n });
    worker.once('message', resolve);
    worker.once('error', reject);
  });
}
http.createServer(async (req, res) => {
  if (req.url === '/fib') return res.end(String(await runFib(40)));
  res.end('still responsive');
}).listen(3000);
// fib-worker.js
// const { parentPort, workerData } = require('node:worker_threads');
// const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
// parentPort.postMessage(fib(workerData));
// Production: a worker pool (piscina) instead of one worker per request

// 5.
const cluster = require('node:cluster');
const os = require('node:os');
if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
  cluster.on('exit', (worker, code) => {
    console.log(`worker ${worker.process.pid} died (${code}), restarting`);
    cluster.fork();
  });
} else {
  http.createServer((req, res) => res.end(`pid ${process.pid}`)).listen(3001);
}
```

**Evaluation Criteria:**
- Correct trade-offs between spawn/exec/execFile/fork (streams vs buffer, shell vs no shell)
- Knows the shell injection risk of exec
- Uses IPC with fork correctly
- Picks worker_threads for CPU-bound work and cluster/replicas for using all cores; knows threads don't help with I/O
- Knows what N-API addons are and their cost

---

### Question 66: Debugging & Logging in Node.js
**Question:** How do you debug a Node.js application (`node --inspect`, `--inspect-brk`, Chrome DevTools, VS Code, ndb)? How do you debug a production issue? Which logging libraries do you use (winston, pino), and what makes good logging (levels, structured logs, correlation ids, redaction)?

**Expected Answer:**
- **`node --inspect`** opens the V8 inspector on 127.0.0.1:9229; attach with Chrome (`chrome://inspect`) or VS Code. **`--inspect-brk`** pauses on the first line (debugging startup). `--inspect=0.0.0.0` exposes it, never do that on a public host
- **VS Code:** launch.json or the auto-attach / JavaScript Debug Terminal; breakpoints, conditional breakpoints, logpoints (log without editing code)
- **ndb:** an older Google tool with a standalone DevTools UI; mostly unmaintained now, VS Code/Chrome replaced it
- Others: `debugger;` statements, `NODE_DEBUG=http,net`, the `debug` package (`DEBUG=app:*`), `node inspect` CLI, `--trace-warnings`, `--enable-source-maps` for TS stack traces
- **Production:** you don't attach a debugger. Use structured logs + correlation ids, error tracking (Sentry), metrics/APM/traces (OpenTelemetry, Datadog), heap snapshots or `--cpu-prof` on a single instance, `kill -USR1 <pid>` to enable the inspector temporarily through an SSH tunnel
- **pino:** very fast, JSON by default, logging done async; `pino-pretty` for dev; `pino-http` for request logs. **winston:** flexible transports and formats, slower. Avoid `console.log` in production (no levels, no structure)
- **Good logging:** levels (fatal/error/warn/info/debug/trace) set by env; JSON with consistent fields; a request/correlation id on every line (AsyncLocalStorage or child loggers); log errors with stack traces; redact secrets/PII; log to stdout and let the platform ship logs

**Code Challenge:**
```javascript
// 1. Show how to start the app with the inspector and stop on the first line
// 2. Create a pino (or winston) logger with levels set by env, JSON output in prod and pretty output in dev
// 3. Add a request-logging middleware that attaches a request id to every log line (AsyncLocalStorage)
// 4. Redact passwords and tokens from logs
```

**Expected Solution:**
```javascript
// 1.
// node --inspect-brk src/server.js   → open chrome://inspect or attach VS Code
// npm script: "debug": "node --inspect src/server.js"

// 2 + 4.
const pino = require('pino');
const isProd = process.env.NODE_ENV === 'production';
const baseLogger = pino({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token'],
    censor: '[REDACTED]',
  },
  transport: isProd ? undefined : { target: 'pino-pretty' },
});

// 3.
const { AsyncLocalStorage } = require('node:async_hooks');
const crypto = require('node:crypto');
const als = new AsyncLocalStorage();

const logger = new Proxy(baseLogger, {
  get(target, prop) {
    const child = als.getStore()?.logger;
    return Reflect.get(child || target, prop);
  },
});

function requestContext(req, res, next) {
  const requestId = req.get('x-request-id') || crypto.randomUUID();
  res.set('x-request-id', requestId);
  const child = baseLogger.child({ requestId });
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    child.info({
      method: req.method, url: req.originalUrl, status: res.statusCode,
      ms: Number(process.hrtime.bigint() - start) / 1e6,
    }, 'request completed');
  });
  als.run({ logger: child }, next);
}
// Anywhere deeper in the code: logger.info({ orderId }, 'order created') → includes requestId
// (pino-http does most of this out of the box)
```

**Evaluation Criteria:**
- Knows --inspect vs --inspect-brk and the security risk of exposing the inspector
- Has a production debugging strategy beyond console.log
- Picks a structured logger and explains levels, JSON, stdout
- Correlation ids through AsyncLocalStorage or child loggers
- Redacts sensitive data

---

### Question 67: HTTP Messages, Methods & Status Codes
**Question:** What are the parts of an HTTP request and of an HTTP response, and how do they differ? Explain the HTTP methods and which are safe and idempotent. Explain the status code classes (1xx–5xx) with the codes you use most.

**Expected Answer:**
- **Request:** request line (method, path + query string, version), headers (Host, Content-Type, Authorization, Accept, Cookie, User-Agent), blank line, optional body
- **Response:** status line (version, status code, reason phrase), headers (Content-Type, Content-Length, Set-Cookie, Cache-Control, Location), blank line, optional body
- Difference: requests carry a method and target, responses carry a status; `Cookie` vs `Set-Cookie`; HTTP/2 encodes the same fields as binary frames with pseudo-headers (`:method`, `:path`, `:status`)
- **Methods:** GET (read), HEAD (headers only), POST (create / non-idempotent action), PUT (replace whole resource), PATCH (partial update), DELETE, OPTIONS (capabilities / CORS preflight)
- **Safe** (no side effects): GET, HEAD, OPTIONS. **Idempotent** (same effect if repeated): safe ones + PUT, DELETE. POST and PATCH are not idempotent by default → use an `Idempotency-Key` header for safe retries of payments/orders
- **1xx** informational (100 Continue, 101 Switching Protocols for WebSocket)
- **2xx** success: 200 OK, 201 Created (+ Location), 202 Accepted (async job), 204 No Content
- **3xx** redirection: 301/308 permanent, 302/307 temporary (307/308 keep the method), 304 Not Modified (cache revalidation)
- **4xx** client error: 400 Bad Request, 401 Unauthenticated, 403 Forbidden, 404, 405 Method Not Allowed, 409 Conflict, 412 Precondition Failed, 415, 422 Unprocessable Content (validation), 429 Too Many Requests (+ Retry-After)
- **5xx** server error: 500, 502 Bad Gateway, 503 Service Unavailable (+ Retry-After), 504 Gateway Timeout. Don't leak stack traces

**Code Challenge:**
```javascript
// 1. Write out a raw HTTP request (POST /api/users with JSON body) and its raw response
// 2. Pick the status code for each case:
//    a) resource created          b) deleted, no body          c) validation failed
//    d) missing/invalid token     e) valid token, no permission f) duplicate email
//    g) rate limited              h) resource moved permanently  i) cached copy still valid
//    j) upstream service down
// 3. Which of these is safe to retry automatically: GET, PUT, DELETE, POST, PATCH? Why?
// 4. With Node's http module, return a 201 with a Location header
```

**Expected Solution:**
```javascript
// 1.
/*
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...
Content-Length: 42

{"name":"Ana","email":"ana@example.com"}

HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/123
Content-Length: 55

{"id":123,"name":"Ana","email":"ana@example.com"}
*/

// 2.
// a) 201  b) 204  c) 400 or 422  d) 401  e) 403  f) 409
// g) 429 (+ Retry-After)  h) 301 or 308  i) 304  j) 502/503/504 (503 if we're shedding, 502/504 if upstream failed/timed out)

// 3.
// GET, PUT, DELETE are idempotent → safe to retry.
// POST/PATCH may duplicate side effects → retry only with an Idempotency-Key the server dedupes.

// 4.
const http = require('node:http');
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/users') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      const user = { id: 123, ...JSON.parse(body) };
      res.writeHead(201, {
        'Content-Type': 'application/json',
        Location: `/api/users/${user.id}`,
      });
      res.end(JSON.stringify(user));
    });
    return;
  }
  res.writeHead(404).end();
}).listen(3000);
```

**Evaluation Criteria:**
- Describes request and response structure accurately and their differences
- Knows safe vs idempotent and why it matters for retries
- Covers all status classes, including 3xx and 304
- Correct 401 vs 403, 400 vs 422, 409, 429, 502/503/504 choices

---

### Question 68: Cookies, localStorage & Session vs Token Auth
**Question:** What is a JWT and what are cookies? How do cookies, localStorage and sessionStorage differ (size, sent with requests, XSS/CSRF exposure, lifetime)? Compare server-side sessions with JWT-based auth. Where should a token be stored in the browser?

**Expected Answer:**
- **JWT:** `base64url(header).base64url(payload).signature`. Signed (HS256/RS256/ES256), **not encrypted**: anyone can read the payload. Self-contained claims (`sub`, `exp`, `iat`, `aud`, `iss`), verified without a DB lookup. Hard to revoke before `exp` → short-lived access tokens + refresh tokens (rotation, denylist)
- **Cookies:** set by the server via `Set-Cookie`, sent automatically by the browser with every matching request. ~4 KB. Flags: `HttpOnly` (JS can't read it → XSS can't steal it), `Secure` (HTTPS only), `SameSite=Lax/Strict/None` (CSRF defense), `Domain`, `Path`, `Max-Age`/`Expires`. Prefix `__Host-` locks it to the host
- **localStorage:** ~5–10 MB per origin, persistent, synchronous API, never sent automatically, readable by any JS on the page → stolen by XSS. **sessionStorage:** same, but per tab and cleared when the tab closes
- **Comparison:** cookies are exposed to CSRF (sent automatically) but can be hidden from XSS; localStorage is immune to CSRF but exposed to XSS. XSS is the bigger risk, so for auth prefer HttpOnly cookies + CSRF protection
- **Sessions (stateful):** random session id in a cookie, data on the server (Redis). Easy revocation, small cookie, needs a shared store. **JWT (stateless):** scales without a store, works across services/domains and for mobile, but revocation and size are harder. Common hybrid: short-lived JWT access token in memory + refresh token in an HttpOnly cookie
- **CSRF defenses:** `SameSite=Lax/Strict`, CSRF tokens (synchronizer or double-submit), checking `Origin`, not changing state on GET

**Code Challenge:**
```javascript
// 1. In Express, set an auth cookie with the right flags (HttpOnly, Secure, SameSite, maxAge, path)
// 2. Decode a JWT by hand (header.payload.signature) and explain why it isn't encrypted
// 3. Explain how you'd protect a cookie-based session from CSRF
// 4. Pick a storage option for: access token, refresh token, UI theme preference, shopping cart draft
```

**Expected Solution:**
```javascript
// 1.
app.post('/auth/login', async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/auth/refresh',          // only sent to the refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });        // client keeps it in memory
});

// 2.
function decodeJwt(token) {
  const [header, payload] = token.split('.').map((part) =>
    JSON.parse(Buffer.from(part, 'base64url').toString('utf8')));
  return { header, payload };
}
// Anyone can decode it: base64url is an encoding, not encryption.
// The signature only proves it wasn't modified. Never put secrets in the payload.
// (JWE exists for encrypted tokens.)

// 3.
// - SameSite=Lax or Strict on the session cookie
// - CSRF token for state-changing requests (e.g. double-submit: cookie + X-CSRF-Token header must match)
// - Check the Origin header on POST/PUT/PATCH/DELETE
// - Never change state on GET

// 4.
// access token     → memory (JS variable); short-lived
// refresh token    → HttpOnly + Secure + SameSite cookie
// theme preference → localStorage (not sensitive)
// cart draft       → localStorage (or server-side if the user is logged in)
```

**Evaluation Criteria:**
- Knows JWT is signed but readable and the revocation trade-off
- Knows the cookie flags and what each defends against
- Compares storage options in terms of XSS vs CSRF, not just size
- Compares sessions vs JWT and knows the hybrid approach
- Knows concrete CSRF defenses

---

## 8.3 Databases

### Question 69: Views, Stored Procedures & Triggers
**Question:** What are views, materialized views, stored procedures, functions and triggers? What are they good for, and what are the downsides of putting business logic in the database?

**Expected Answer:**
- **View:** a saved query that acts like a virtual table. No data stored, it runs every time. Used to simplify complex joins, hide columns (security), and give a stable interface over a changing schema. Simple views can be updatable
- **Materialized view:** stores the result. Fast reads, but stale until `REFRESH MATERIALIZED VIEW` (PostgreSQL; `CONCURRENTLY` needs a unique index). Good for reports and dashboards. MySQL has no native materialized views (use summary tables + events)
- **Stored procedure:** named code stored and run in the DB (`CALL proc()`). Can manage transactions (PostgreSQL 11+ procedures). **Function:** returns a value/table, usable inside SQL (`SELECT fn()`)
- **Trigger:** runs automatically `BEFORE`/`AFTER` `INSERT`/`UPDATE`/`DELETE`, per row or per statement. Used for audit logs, `updated_at`, enforcing invariants, denormalized counters
- **Pros:** fewer round-trips, logic close to the data, consistency no matter which app writes, can restrict permissions (grant EXECUTE, not table access)
- **Cons:** logic hidden from the app code; harder to version, test, debug and review; vendor lock-in; scales with the DB, which is the hardest part to scale; triggers cause surprising side effects and slow bulk writes
- **Senior view:** keep business logic in the app; use the DB for data integrity (constraints, audit triggers, `updated_at`), reporting views, and the occasional performance-critical procedure. Keep DB code in migrations

**Code Challenge:**
```sql
-- 1. Create a view of active users with their order count
-- 2. Create a materialized view for a monthly sales report and refresh it
-- 3. Write a stored procedure/function that transfers stock between warehouses in a transaction
-- 4. Write a trigger that keeps updated_at current and writes changes to an audit table
-- 5. Call the procedure from Node.js (pg)
```

**Expected Solution:**
```sql
-- 1.
CREATE VIEW active_users_with_orders AS
SELECT u.id, u.email, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true
GROUP BY u.id, u.email;

-- 2.
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT date_trunc('month', created_at) AS month, SUM(total) AS revenue, COUNT(*) AS orders
FROM orders
GROUP BY 1;
CREATE UNIQUE INDEX ON monthly_sales (month);
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales; -- e.g. nightly cron

-- 3. (PostgreSQL)
CREATE OR REPLACE PROCEDURE transfer_stock(p_product INT, p_from INT, p_to INT, p_qty INT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE stock SET qty = qty - p_qty
   WHERE product_id = p_product AND warehouse_id = p_from AND qty >= p_qty;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Not enough stock in warehouse %', p_from;
  END IF;

  INSERT INTO stock (product_id, warehouse_id, qty) VALUES (p_product, p_to, p_qty)
  ON CONFLICT (product_id, warehouse_id) DO UPDATE SET qty = stock.qty + EXCLUDED.qty;
END;
$$;
-- The procedure runs inside the caller's transaction; the exception rolls it all back.

-- 4.
CREATE OR REPLACE FUNCTION touch_and_audit() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  INSERT INTO audit_log (table_name, row_id, old_data, new_data, changed_at)
  VALUES (TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW), now());
  RETURN NEW;
END;
$$;
CREATE TRIGGER products_touch_audit
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION touch_and_audit();
```
```javascript
// 5.
const { Pool } = require('pg');
const pool = new Pool();
async function transferStock(productId, from, to, qty) {
  await pool.query('CALL transfer_stock($1, $2, $3, $4)', [productId, from, to, qty]);
}
```

**Evaluation Criteria:**
- Clear view vs materialized view distinction, including staleness and refresh
- Knows procedure vs function vs trigger and real use cases for each
- Gives a balanced opinion on logic in the DB (testability, lock-in, scaling)
- Correct transactional procedure; trigger uses NEW/OLD correctly

---

### Question 70: ORM vs ODM
**Question:** What is an ORM and what is an ODM? Give examples (Prisma, TypeORM, Sequelize, Drizzle, Mongoose). What are the pros and cons compared with raw SQL or a query builder? What is the N+1 problem and how do you avoid it?

**Expected Answer:**
- **ORM** (Object-Relational Mapper): maps tables/rows/relations to classes/objects for SQL databases. Sequelize, TypeORM (Active Record or Data Mapper), Prisma (schema file + generated type-safe client), MikroORM, Drizzle (thin, SQL-like, typed)
- **ODM** (Object-Document Mapper): maps documents in a document DB (MongoDB) to objects. Mongoose: schemas, validation, middleware/hooks, `populate` for references. MongoDB itself has no schema, so the ODM adds one in the app
- **Query builders** (Knex, Kysely): composable SQL without mapping entities. **Raw driver** (pg, mysql2): full control
- **Pros:** productivity, migrations, type safety (Prisma/Drizzle), validation, protection from SQL injection by default, portable across DBs
- **Cons:** leaky abstraction, hard-to-see generated SQL, poor fit for complex reports/window functions, performance traps (N+1, over-fetching), heavy hydration costs. Senior answer: ORM for CRUD + raw SQL for complex/hot queries, and always look at the generated SQL
- **N+1:** 1 query for a list + 1 query per item for its relation. Fix with eager loading (`include`, JOIN), batching with `WHERE id IN (...)`, DataLoader (GraphQL), or `populate` (which runs one extra query per path, not per document)
- **Mongo modeling:** embed when the data is read together and bounded in size; reference when it's large, unbounded or shared

**Code Challenge:**
```javascript
// 1. Define a User has-many Post model with Sequelize or Prisma
// 2. Define the same with Mongoose (embedded vs referenced posts)
// 3. Show an N+1 query and fix it with eager loading / populate
// 4. Run a raw query from the ORM for a report the ORM can't express well
// 5. Run two writes in one transaction with the ORM
```

**Expected Solution:**
```javascript
// 1. Prisma (schema.prisma)
/*
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
  @@index([authorId])
}
*/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 2. Mongoose
const mongoose = require('mongoose');
// referenced (unbounded posts)
const PostSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
});
const UserSchema = new mongoose.Schema({ email: { type: String, unique: true } });
// embedded alternative (small, bounded, read together):
// const UserSchema = new mongoose.Schema({ email: String, addresses: [{ city: String, zip: String }] });
const Post = mongoose.model('Post', PostSchema);

// 3. N+1
async function listWithAuthorsSlow() {
  const posts = await prisma.post.findMany();               // 1 query
  for (const p of posts) {
    p.author = await prisma.user.findUnique({ where: { id: p.authorId } }); // N queries
  }
  return posts;
}
// Fix: eager loading
const posts = await prisma.post.findMany({ include: { author: true } });
// Mongoose: await Post.find().populate('author');   // 2 queries total

// 4. Raw query (tagged template → parameterized, safe)
const report = await prisma.$queryRaw`
  SELECT date_trunc('month', created_at) AS month, COUNT(*) AS posts
  FROM "Post" GROUP BY 1 ORDER BY 1`;

// 5. Transaction
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { email: 'ana@example.com' } });
  await tx.post.create({ data: { title: 'Hello', authorId: user.id } });
});
```

**Evaluation Criteria:**
- Clear ORM vs ODM definitions with real tools
- Balanced pros/cons; knows when to drop down to raw SQL
- Recognizes and fixes N+1
- Embedded vs referenced modeling in Mongo
- Uses transactions and parameterized raw queries

---

## 8.4 Docker & Kubernetes

### Question 71: Dockerfile vs Docker Compose
**Question:** What is the difference between a Dockerfile and Docker Compose? What are images, containers, layers and volumes? What are the best practices for a production Node.js Dockerfile?

**Expected Answer:**
- **Dockerfile:** instructions to **build one image** (FROM, WORKDIR, COPY, RUN, ENV, EXPOSE, USER, CMD)
- **Docker Compose:** a YAML file to **run several containers together** (services, networks, volumes, env, healthchecks, depends_on). Mostly for local dev and testing; in production you use an orchestrator (Kubernetes, ECS)
- **Image:** read-only template made of layers. **Container:** a running instance with a thin writable layer. **Layer:** each instruction creates one; cached and reused if the instruction and its inputs didn't change
- **Volumes:** persist data outside the container lifecycle (named volumes for DB data, bind mounts for source code in dev)
- **Best practices:**
    - Multi-stage build: build/compile in one stage, copy only the output and production deps to the final image
    - Small base (`node:22-alpine` or `-slim`, or distroless); pin the version
    - Copy `package*.json` first and run `npm ci` before copying the source, so the dependency layer stays cached
    - `npm ci --omit=dev`; a `.dockerignore` (node_modules, .git, .env)
    - Run as non-root (`USER node`)
    - `CMD ["node", "dist/server.js"]` in exec form so Node gets SIGTERM; don't run through npm. Use `--init` or tini if you spawn child processes
    - No secrets in the image (build args/ENV end up in layers); use runtime env or secret mounts
    - `HEALTHCHECK` or orchestrator probes; `NODE_ENV=production`

**Code Challenge:**
```yaml
# 1. Write a multi-stage Dockerfile for a Node.js API (small image, non-root user, layer caching, .dockerignore)
# 2. Write a docker-compose.yml with the API, PostgreSQL and Redis:
#    - env vars, named volume for DB data, healthcheck, depends_on with condition
# 3. Explain the order of COPY package*.json and COPY . and why it matters
```

**Expected Solution:**
```dockerfile
# 1. Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]

# .dockerignore
# node_modules
# dist
# .git
# .env*
# Dockerfile
```
```yaml
# 2. docker-compose.yml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/app
      REDIS_URL: redis://cache:6379
    depends_on:
      db: { condition: service_healthy }
      cache: { condition: service_started }
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 10
  cache:
    image: redis:7-alpine
volumes:
  pgdata:

# 3. package*.json is copied and installed first, so the npm ci layer is reused
#    when only source code changes. COPY . . first would reinstall deps on every change.
```

**Evaluation Criteria:**
- Clear Dockerfile (build one image) vs Compose (run many containers) distinction
- Knows images, containers, layers, volumes
- Multi-stage, non-root, layer caching, .dockerignore, exec-form CMD
- Compose with healthcheck-based depends_on and named volumes
- No secrets baked into the image

---

### Question 72: Kubernetes Core Objects
**Question:** What is Kubernetes and what problem does it solve? Explain Pods, Deployments, ReplicaSets, Services (ClusterIP, NodePort, LoadBalancer), Ingress, ConfigMaps, Secrets, liveness/readiness probes and the Horizontal Pod Autoscaler.

**Expected Answer:**
- **Kubernetes:** a container orchestrator. You declare the desired state (YAML); controllers keep reconciling the actual state toward it: scheduling, self-healing, scaling, rolling updates, service discovery, config
- **Pod:** smallest unit; one or more containers sharing network (same IP) and volumes. Ephemeral; don't create them directly
- **ReplicaSet:** keeps N identical pods running. **Deployment:** manages ReplicaSets for rolling updates and rollbacks (`maxSurge`, `maxUnavailable`)
- **StatefulSet** (stable identity/storage for DBs), **DaemonSet** (one pod per node), **Job/CronJob** (batch)
- **Service:** stable virtual IP + DNS name in front of pods matched by labels. **ClusterIP** (internal only, default), **NodePort** (port on every node), **LoadBalancer** (cloud LB)
- **Ingress:** L7 HTTP routing (host/path), TLS, through an ingress controller (nginx, ALB). Gateway API is the newer alternative
- **ConfigMap:** non-secret config. **Secret:** sensitive values, only base64-encoded by default → enable encryption at rest, RBAC, or use an external secret manager
- **Probes:** **liveness** failing → container restarted (don't check dependencies here, or a DB outage restarts everything); **readiness** failing → pod removed from Service endpoints (not restarted); **startup** for slow boots
- **Requests/limits:** requests drive scheduling, limits cap usage (memory over limit → OOMKilled). Set Node's heap accordingly
- **HPA:** scales replicas based on CPU/memory/custom metrics; needs resource requests and metrics-server
- **Namespaces** for isolation; on SIGTERM the pod has `terminationGracePeriodSeconds` (30s default) to drain

**Code Challenge:**
```yaml
# For the Node.js API from Q71, write:
# 1. A Deployment with 3 replicas, resource requests/limits, and liveness + readiness probes
# 2. A ConfigMap and a Secret, injected as environment variables
# 3. A ClusterIP Service and an Ingress exposing /api
# 4. An HPA that scales between 3 and 10 pods at 70% CPU
# 5. The kubectl commands to apply, check rollout status and roll back
```

**Expected Solution:**
```yaml
# 2.
apiVersion: v1
kind: ConfigMap
metadata: { name: api-config }
data:
  LOG_LEVEL: info
  REDIS_URL: redis://redis:6379
---
apiVersion: v1
kind: Secret
metadata: { name: api-secrets }
type: Opaque
stringData:
  DATABASE_URL: postgres://app:secret@postgres:5432/app
---
# 1.
apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  strategy:
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers:
        - name: api
          image: registry.example.com/api:1.4.2
          ports: [{ containerPort: 3000 }]
          envFrom:
            - configMapRef: { name: api-config }
            - secretRef: { name: api-secrets }
          resources:
            requests: { cpu: 250m, memory: 256Mi }
            limits: { memory: 512Mi }
          readinessProbe:
            httpGet: { path: /ready, port: 3000 }
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /health, port: 3000 }
            initialDelaySeconds: 10
            periodSeconds: 10
---
# 3.
apiVersion: v1
kind: Service
metadata: { name: api }
spec:
  type: ClusterIP
  selector: { app: api }
  ports: [{ port: 80, targetPort: 3000 }]
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata: { name: api }
spec:
  ingressClassName: nginx
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend: { service: { name: api, port: { number: 80 } } }
---
# 4.
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: api }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }

# 5.
# kubectl apply -f k8s/
# kubectl rollout status deployment/api
# kubectl rollout undo deployment/api
# kubectl get pods -l app=api ; kubectl logs -l app=api --tail=50
```

**Evaluation Criteria:**
- Explains desired-state reconciliation, not just "runs containers"
- Correct roles of Pod, ReplicaSet, Deployment, Service types, Ingress
- Liveness vs readiness difference and the dependency-check pitfall
- Knows Secrets are only base64 by default
- Requests/limits and HPA prerequisites; rollout/rollback commands

---

## 8.5 CI/CD & Teamwork

### Question 73: Git: Merge vs Rebase
**Question:** What is the difference between `git merge` and `git rebase`? When do you use each, and what is the golden rule of rebasing? What are fast-forward and squash merges? How does Git (distributed) differ from SVN (centralized)?

**Expected Answer:**
- **Merge:** combines two branches with a merge commit that has two parents. Keeps the true history, non-destructive, but the history can get noisy
- **Rebase:** replays your commits on top of another base, creating **new commits** (new hashes). Linear history, no merge commits, but it rewrites history
- **Golden rule:** never rebase commits that others have already pulled (shared/public branches). Rebase your own local/feature branch only. After rebasing a pushed branch, use `git push --force-with-lease` (not `--force`)
- **Interactive rebase** (`git rebase -i`): squash, reword, reorder, drop commits before opening a PR
- **Fast-forward:** if the target hasn't moved, merge just moves the pointer (no merge commit). `--no-ff` forces a merge commit
- **Squash merge:** collapses the whole PR into one commit on main. Clean history, but loses the individual commits
- Team policy matters more than the choice: e.g. "rebase feature branches on main, squash-merge PRs"
- **Git vs SVN:** Git is distributed (every clone has the full history, works offline, cheap branches, local commits). SVN is centralized (one server, commits go straight to the server, branches are directory copies, path-based permissions, handles huge binaries better)
- Recovery: `git reflog` shows where HEAD has been, so "lost" commits can be recovered

**Code Challenge:**
```bash
# 1. Update your feature branch with the latest main, once with merge and once with rebase. Draw the history for each.
# 2. Clean up 4 messy commits into 1 before opening a PR
# 3. You rebased a branch that a teammate already pulled. What happens and how do you recover?
# 4. Resolve a conflict during a rebase and continue
# 5. Recover a commit you lost after a bad reset
```

**Expected Solution:**
```bash
# 1.
git switch feature
git fetch origin
git merge origin/main
#   A---B---C  feature
#  /         \
# o---D---E---M        (M = merge commit)

git rebase origin/main
# o---D---E---A'---B'---C'  feature   (new commits, linear)

# 2.
git rebase -i HEAD~4
# pick a1 Add order endpoint
# squash b2 fix typo
# squash c3 wip
# squash d4 address review
git push --force-with-lease

# 3. The teammate's branch still has the old commits A, B, C; when they pull, git tries to
#    merge old and new versions → duplicated commits and conflicts.
#    Fix: teammate runs `git fetch && git rebase origin/feature` (or `git reset --hard origin/feature`
#    if they have no local work). Prevention: don't rebase shared branches.

# 4.
git rebase origin/main
# CONFLICT in src/orders.js
# edit file, then:
git add src/orders.js
git rebase --continue      # or --abort to go back to where you started

# 5.
git reflog                 # find the hash before the reset, e.g. abc123 HEAD@{2}
git reset --hard abc123    # or: git branch rescue abc123
```

**Evaluation Criteria:**
- Explains merge vs rebase effect on history and commit hashes
- States the golden rule and uses `--force-with-lease`
- Knows fast-forward, `--no-ff`, squash merge and interactive rebase
- Can resolve rebase conflicts and recover with reflog
- Knows distributed vs centralized VCS differences

---

### Question 74: Module Bundlers & Build Tools
**Question:** What is a module bundler (webpack, Rollup, esbuild, Vite) and what problems does it solve? Explain loaders/plugins, tree shaking, code splitting and source maps. What does Babel do? How do task runners (Grunt, Gulp) and preprocessors fit in, and do you need a bundler for a Node.js backend?

**Expected Answer:**
- **Bundler:** starts from entry points, follows imports to build a dependency graph, and outputs optimized bundles. Solves: many modules → few files for the browser, transforms (TS, JSX, CSS), minification, cache-busting hashes
- **webpack:** most configurable; **loaders** transform files (babel-loader, ts-loader, css-loader), **plugins** act on the whole build (HtmlWebpackPlugin, MiniCssExtract, DefinePlugin). **Rollup:** best for libraries (clean ESM output). **esbuild/SWC:** Go/Rust, 10–100x faster. **Vite:** native ESM dev server + Rollup/Rolldown for production
- **Tree shaking:** removes unused exports; needs static ESM imports and `"sideEffects": false`. CommonJS `require` of a whole library defeats it
- **Code splitting:** `import()` creates separate chunks loaded on demand; vendor chunks for better caching
- **Source maps:** map minified/transpiled code back to the original source for debugging and error tracking
- **Babel:** a transpiler: modern syntax → syntax older targets understand (`@babel/preset-env` + browserslist), JSX, TS stripping, plus polyfills via core-js. TypeScript `tsc` or SWC/esbuild do the same for TS
- **Preprocessors:** Sass/Less/PostCSS for CSS, TS for JS. **Task runners** (Grunt config-based, Gulp stream/code-based) automated build steps before bundlers and npm scripts replaced most of them. **Bower** was a front-end package manager, now dead (npm won)
- **Node backend:** usually no bundler needed; `tsc` is enough. Bundling helps for serverless (smaller packages, faster cold starts), single-file CLIs, or monorepos. Keep native modules external

**Code Challenge:**
```javascript
// 1. Write a minimal webpack.config.js: entry, output, a babel-loader rule, a CSS loader rule, production mode
// 2. Configure Babel to target Node 20 and the last 2 browser versions
// 3. Explain why this import breaks tree shaking and fix it:
const _ = require('lodash');
_.debounce(fn, 300);
// 4. Bundle a Node.js Lambda handler with esbuild into a single file
```

**Expected Solution:**
```javascript
// 1. webpack.config.js
const path = require('node:path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })],
  optimization: { splitChunks: { chunks: 'all' } },
};

// 2. babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: '20', browsers: ['last 2 versions'] },
      useBuiltIns: 'usage',
      corejs: 3,
    }],
  ],
};

// 3. require() of the whole CommonJS lodash pulls in the full library (~70 KB).
// Fix: ESM build with a named import, or a per-method import
import { debounce } from 'lodash-es';
// or: import debounce from 'lodash/debounce';

// 4. esbuild
// npx esbuild src/handler.ts --bundle --platform=node --target=node20 \
//   --minify --sourcemap --external:@aws-sdk/* --outfile=dist/handler.js
// (@aws-sdk v3 is already in the Lambda runtime; native modules must stay external)
```

**Evaluation Criteria:**
- Explains what a bundler does (graph, transforms, output) and compares tools
- Loaders vs plugins; tree shaking requirements; code splitting; source maps
- Knows Babel's role and how targets drive transpilation and polyfills
- Puts Grunt/Gulp/Bower in historical context
- Knows when a Node backend benefits from bundling (serverless) and when it doesn't

---

## 8.6 JavaScript (syllabus)

### Question 75: Functional Programming in JS
**Question:** What is functional programming? Explain pure functions, side effects, immutability, first-class and higher-order functions, currying, partial application, composition and recursion. What are the trade-offs of recursion in JavaScript?

**Expected Answer:**
- **FP:** build programs from small pure functions and combine them; avoid shared mutable state
- **Pure function:** same input → same output, no side effects (no I/O, no mutation of arguments/globals, no `Date.now()`/`Math.random()`). Easy to test, cache (memoize) and reason about
- **Side effects** are unavoidable (DB, HTTP); push them to the edges ("functional core, imperative shell")
- **Immutability:** return new values instead of mutating (spread, `map`, `toSorted`, `structuredClone`)
- **First-class functions:** functions are values. **Higher-order functions** take or return functions (`map`, `filter`, `reduce`, middleware, decorators)
- **Currying:** `f(a, b, c)` → `f(a)(b)(c)`, one argument at a time. **Partial application:** fix some arguments now, the rest later (`bind`). Useful for configurable helpers (`const logError = log('error')`)
- **Composition:** `compose(f, g)(x) = f(g(x))`; `pipe` runs left to right
- **Recursion:** a function calls itself with a smaller input until a base case. Natural for trees/nested data. **Trade-off:** JS engines (V8) don't do tail-call optimization, so deep recursion throws `RangeError: Maximum call stack size exceeded` (~10k frames). Use iteration, an explicit stack, or a trampoline for deep inputs
- FP in JS is pragmatic: use it where it improves clarity, not for its own sake

**Code Challenge:**
```javascript
// 1. Turn this impure function into a pure one:
let total = 0;
function addToTotal(x) { total += x; return total; }
// 2. Implement curry(fn) so that curry(add3)(1)(2)(3) === curry(add3)(1, 2)(3) === 6
// 3. Implement compose(...fns) and pipe(...fns)
// 4. Flatten a deeply nested array recursively, then without recursion
// 5. Sum 1..100000 recursively. What happens, and how do you avoid it?
```

**Expected Solution:**
```javascript
// 1.
const addToTotal = (total, x) => total + x; // state passed in, new value returned

// 2.
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}
const add3 = (a, b, c) => a + b + c;
curry(add3)(1)(2)(3);  // 6
curry(add3)(1, 2)(3);  // 6

// 3.
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
const slugify = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\s+/g, '-'),
);
slugify('  Hello World '); // 'hello-world'

// 4.
const flattenRec = (arr) =>
  arr.reduce((acc, x) => (Array.isArray(x) ? acc.concat(flattenRec(x)) : acc.concat(x)), []);

function flattenIter(arr) {
  const stack = [...arr];
  const out = [];
  while (stack.length) {
    const x = stack.pop();
    if (Array.isArray(x)) stack.push(...x);
    else out.push(x);
  }
  return out.reverse();
}
// built-in: arr.flat(Infinity)

// 5.
const sumRec = (n) => (n === 0 ? 0 : n + sumRec(n - 1));
// sumRec(100000) → RangeError: Maximum call stack size exceeded (no TCO in V8)
// Fixes: a loop, the formula n * (n + 1) / 2, or a trampoline:
const trampoline = (fn) => (...args) => {
  let result = fn(...args);
  while (typeof result === 'function') result = result();
  return result;
};
const sumT = trampoline(function go(n, acc = 0) {
  return n === 0 ? acc : () => go(n - 1, acc + n);
});
sumT(100000); // 5000050000
```

**Evaluation Criteria:**
- Defines pure functions and side effects precisely
- Distinguishes currying from partial application; working curry
- Implements compose/pipe and uses them meaningfully
- Knows recursion's stack limit and the lack of TCO, with alternatives
- Pragmatic view of FP in a real codebase

---

## 8.7 Node.js (syllabus)

### Question 76: Process Management & Graceful Shutdown
**Question:** How do you keep a Node.js process running in production (PM2, Forever, systemd, Docker restart policies, Kubernetes)? What does PM2 cluster mode do? How do you implement graceful shutdown? How should you handle `uncaughtException` and `unhandledRejection`?

**Expected Answer:**
- A Node process dies on an unhandled error, so something has to restart it and collect logs
- **Forever:** old, simple restart-on-crash tool; effectively deprecated. **PM2:** process manager with restart policies, cluster mode, log management, `pm2 reload` for zero-downtime restarts, startup scripts, monitoring. **systemd:** the OS service manager (`Restart=always`)
- **Containers:** the orchestrator is the process manager (Docker `restart: unless-stopped`, Kubernetes restarts pods). Run plain `node` as PID 1 (or with tini), not PM2, so signals and scaling are handled by the platform
- **PM2 cluster mode:** runs N instances sharing a port using Node's cluster module; `reload` restarts them one by one
- **Graceful shutdown on SIGTERM/SIGINT:**
    1. Mark as not ready (readiness probe fails → LB stops sending traffic)
    2. `server.close()`: stop accepting new connections, let in-flight requests finish (`closeIdleConnections()` for keep-alive)
    3. Stop consumers/cron jobs, flush logs, close DB pools, Redis, queue connections
    4. `process.exit(0)`; with a hard timeout (e.g. 10s, under the platform's grace period) that forces exit
- **uncaughtException:** the process is in an unknown state. Log it (sync or flush), report it to error tracking, then exit with code 1 and let the manager restart. Don't keep serving
- **unhandledRejection:** crashes by default since Node 15. Treat it the same way, and fix the missing `catch`
- Error tracking: Sentry/Datadog capture these with context; `process.on('warning')` for warnings

**Code Challenge:**
```javascript
// 1. Write an ecosystem.config.js for PM2: cluster mode on all cores, max memory restart, env per environment
// 2. Implement graceful shutdown on SIGTERM/SIGINT:
//    stop accepting connections, finish in-flight requests, close DB/Redis, exit with a timeout fallback
// 3. Add uncaughtException / unhandledRejection handlers. What should they do and not do?
// 4. Make the readiness check fail during shutdown so the load balancer stops sending traffic
```

**Expected Solution:**
```javascript
// 1. ecosystem.config.js
module.exports = {
  apps: [{
    name: 'orders-api',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    kill_timeout: 10000, // time allowed for graceful shutdown
    env: { NODE_ENV: 'development' },
    env_production: { NODE_ENV: 'production' },
  }],
};
// pm2 start ecosystem.config.js --env production ; pm2 reload orders-api

// 2 + 4.
const express = require('express');
const app = express();
let shuttingDown = false;

app.get('/health', (req, res) => res.sendStatus(200));                       // liveness
app.get('/ready', (req, res) => res.sendStatus(shuttingDown ? 503 : 200));   // readiness

const server = app.listen(3000);

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'shutting down');

  const forceExit = setTimeout(() => {
    logger.error('forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  try {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
      server.closeIdleConnections();
    });
    await Promise.allSettled([db.end(), redis.quit(), queueConsumer.close()]);
    logger.info('shutdown complete');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'error during shutdown');
    process.exit(1);
  }
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// 3.
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'uncaught exception');
  Sentry.captureException(err);
  Sentry.flush(2000).finally(() => process.exit(1)); // don't keep serving in an unknown state
});
process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'unhandled rejection');
  throw reason; // send it to the uncaughtException path
});
// Don't: swallow the error and continue, or do slow async work without a timeout.
```

**Evaluation Criteria:**
- Knows PM2/Forever/systemd and that containers delegate this to the orchestrator
- Graceful shutdown in the right order: readiness off → stop accepting → drain → close resources → exit, with a timeout
- Treats uncaughtException as fatal: log, report, exit, restart
- Understands PM2 cluster mode and zero-downtime reload

---

### Question 77: Event Loop Monitoring & Profiling
**Question:** How do you detect that the event loop is blocked? What is event loop lag/delay and utilization? Which tools do you use (perf_hooks, Clinic.js Doctor/Flame/Bubbleprof, N|Solid, `--prof`, heap snapshots)? How do you find a memory leak?

**Expected Answer:**
- **Symptoms of a blocked loop:** latency goes up for *all* requests, timeouts, health checks failing, low throughput while CPU is at 100% on one core
- **Event loop delay (lag):** how late timers run compared to when they were scheduled. `perf_hooks.monitorEventLoopDelay()` gives a histogram (p50/p99/max). p99 above ~50–100 ms is a warning for an API
- **Event loop utilization (ELU):** fraction of time the loop is busy (`performance.eventLoopUtilization()`). Near 1 means saturated. Better than CPU% for autoscaling Node
- **Common blockers:** sync APIs (`fs.readFileSync`, `crypto.pbkdf2Sync`), huge `JSON.parse`/`stringify`, catastrophic regex backtracking, big loops/sorts, sync compression
- **Tools:**
    - **Clinic.js:** Doctor (diagnoses the problem type), Flame (CPU flame graph), Bubbleprof (async delays), HeapProfiler
    - **N|Solid:** NodeSource's commercial runtime with production event loop, CPU and heap metrics
    - `node --cpu-prof` / `--prof` + `--prof-process`, Chrome DevTools Performance tab, `0x`
    - APMs: Datadog, New Relic, Elastic export event loop metrics
- **Fixes:** move CPU work to worker threads, chunk work with `setImmediate`, stream instead of buffering, use async APIs, cache results
- **Memory leaks:** watch heap growth after GC (`process.memoryUsage()`, `--trace-gc`), take heap snapshots (`v8.writeHeapSnapshot()`, `--heapsnapshot-signal=SIGUSR2`) some time apart, compare in DevTools (Comparison view, sort by delta/retained size), follow the retainers path to the code. Usual causes: growing caches/Maps, listeners not removed, closures, timers, global arrays

**Code Challenge:**
```javascript
// 1. Measure event loop delay with perf_hooks.monitorEventLoopDelay and log p50/p99 every 10s
// 2. Write an endpoint that blocks the loop (sync crypto or a big JSON.parse) and show how you'd find it in a flame graph
// 3. Return 503 when event loop lag is above a threshold (load shedding)
// 4. Take two heap snapshots and explain how to compare them to find a leak
```

**Expected Solution:**
```javascript
const { monitorEventLoopDelay, performance } = require('node:perf_hooks');
const crypto = require('node:crypto');
const v8 = require('node:v8');
const express = require('express');
const app = express();

// 1.
const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();
let lastElu = performance.eventLoopUtilization();
setInterval(() => {
  const elu = performance.eventLoopUtilization(lastElu);
  lastElu = performance.eventLoopUtilization();
  logger.info({
    p50ms: histogram.percentile(50) / 1e6,
    p99ms: histogram.percentile(99) / 1e6,
    maxms: histogram.max / 1e6,
    elu: elu.utilization.toFixed(2),
  }, 'event loop');
  histogram.reset();
}, 10_000).unref();

// 3. Load shedding (register before the routes)
app.use((req, res, next) => {
  const p99ms = histogram.percentile(99) / 1e6;
  if (p99ms > 200) return res.set('Retry-After', '1').sendStatus(503);
  next();
});
// (packages: under-pressure for Fastify, toobusy-js)

// 2.
app.get('/hash', (req, res) => {
  const hash = crypto.pbkdf2Sync(req.query.pw, 'salt', 500_000, 64, 'sha512'); // blocks ~hundreds of ms
  res.send(hash.toString('hex'));
});
// npx clinic flame -- node server.js   (then load test: npx autocannon localhost:3000/hash?pw=x)
// The flame graph shows a wide bar for pbkdf2Sync under the route handler → that's where time goes.
// Fix: crypto.pbkdf2 (async, runs in the libuv threadpool) or a worker thread.

// 4.
app.post('/debug/heap', (req, res) => res.json({ file: v8.writeHeapSnapshot() })); // protect this in prod!
// Take snapshot A → run traffic → take snapshot B → open both in Chrome DevTools (Memory tab).
// Comparison view: sort by "# Delta" / "Size Delta"; objects that only grow are suspects.
// Select one and read its "Retainers" path to see which variable/closure/Map keeps it alive.
```

**Evaluation Criteria:**
- Knows how a blocked loop shows up and how to measure delay and ELU
- Names concrete tools (Clinic, N|Solid, --cpu-prof, DevTools) and when to use each
- Knows common blockers and their fixes
- Can describe a heap snapshot comparison workflow for leaks
- Considers load shedding / back-pressure

---

### Question 78: Node.js Framework Landscape
**Question:** Compare Express, Fastify, Koa, Hapi, NestJS, Restify and Sails. Where do Next.js and Nuxt fit, and what about serverless frameworks (Serverless Framework, SST)? How do you choose a framework for a new backend service?

**Expected Answer:**
- **Express:** minimal, unopinionated, huge ecosystem, linear middleware. Express 5 handles rejected promises. Slower than Fastify, structure is up to you
- **Fastify:** high performance (schema-based serialization), JSON Schema validation built in, encapsulated plugin system, hooks lifecycle, first-class TypeScript, pino logging
- **Koa:** by the Express team; tiny core, `async` middleware with an "onion" model (`await next()` lets code run before and after downstream), context object. Bring your own router/body parser
- **Hapi:** configuration-centric, strong built-in validation (Joi), auth, caching; popular in enterprise; smaller community today
- **NestJS:** opinionated, Angular-inspired architecture: modules, controllers, providers, dependency injection, decorators, guards/pipes/interceptors. Runs on Express or Fastify. Great for big teams and consistent structure; more boilerplate
- **Restify:** focused on REST APIs, DTrace support; mostly legacy now
- **Sails:** Rails-like MVC with the Waterline ORM and blueprints; largely legacy
- **Next.js / Nuxt:** full-stack meta-frameworks for React / Vue: SSR/SSG, file-based routing, API routes/server actions. Good for BFFs and web apps, not a replacement for a dedicated backend service
- **Serverless frameworks:** Serverless Framework, SST, AWS SAM, Architect deploy functions + infra (IaC) to FaaS. Middy adds middleware for Lambda
- **Choosing:** team experience, performance needs, need for structure/DI (NestJS for big teams), ecosystem/plugins, TypeScript support, long-term maintenance, deployment target (Lambda vs containers)

**Code Challenge:**
```javascript
// Implement GET /users/:id with JSON schema validation of the param in:
// 1. Express
// 2. Fastify (with a route schema)
// 3. NestJS (controller + service + DTO with class-validator)
// Then: explain middleware in Express vs Koa (onion model) vs Fastify hooks
```

**Expected Solution:**
```javascript
// 1. Express
const express = require('express');
const app = express();
app.get('/users/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
  try {
    const user = await usersService.findById(id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) { next(err); }
});

// 2. Fastify
const fastify = require('fastify')({ logger: true });
fastify.get('/users/:id', {
  schema: {
    params: {
      type: 'object',
      properties: { id: { type: 'integer', minimum: 1 } },
      required: ['id'],
    },
    response: {
      200: { type: 'object', properties: { id: { type: 'integer' }, email: { type: 'string' } } },
    },
  },
}, async (request, reply) => {
  const user = await usersService.findById(request.params.id); // already coerced to integer
  if (!user) return reply.code(404).send();
  return user; // serialized with the response schema (fast, and drops extra fields)
});

// 3. NestJS (TypeScript)
/*
class GetUserParams {
  @Type(() => Number) @IsInt() @Min(1)
  id: number;
}

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}
  findById(id: number) { return this.repo.findOne(id); }
}

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get(':id')
  async getOne(@Param() { id }: GetUserParams) {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }
}
// main.ts: app.useGlobalPipes(new ValidationPipe({ transform: true }));
*/

// Middleware models:
// Express: linear chain, next() passes control; no clean "after" hook (use res.on('finish')).
// Koa: onion — code after `await next()` runs on the way back out:
//   app.use(async (ctx, next) => { const t = Date.now(); await next(); ctx.set('X-Time', `${Date.now() - t}ms`); });
// Fastify: lifecycle hooks (onRequest, preValidation, preHandler, onSend, onResponse) scoped per plugin.
```

**Evaluation Criteria:**
- Accurate trade-offs for the main frameworks (not just "Fastify is faster")
- Knows where Next/Nuxt and serverless frameworks fit
- Working validation in Express, Fastify schema and Nest DTO + ValidationPipe
- Explains the middleware models (linear vs onion vs hooks)
- Gives a reasoned choice process

---

### Question 79: HTTP Optimization, CORS & HTTP/2
**Question:** How do you optimize HTTP APIs? Explain HTTP caching (Cache-Control, ETag, Last-Modified, 304), compression (gzip, Brotli), and CORS (simple vs preflight requests, credentials). What does HTTP/2 change compared with HTTP/1.1, and what is HTTP/3?

**Expected Answer:**
- **Cache-Control:** `max-age` (seconds fresh), `s-maxage` (CDN/shared caches), `public`/`private`, `no-cache` (store but revalidate every time), `no-store` (never store, for sensitive data), `immutable` (hashed static assets), `stale-while-revalidate`
- **Validation:** `ETag` (content hash) + `If-None-Match`, or `Last-Modified` + `If-Modified-Since` → server answers **304 Not Modified** with no body. Saves bandwidth, not the request. `Vary` (e.g. `Accept-Encoding`, `Authorization`) tells caches which headers change the response
- **Compression:** gzip is universal; Brotli compresses ~15–20% better for text. Negotiated via `Accept-Encoding`/`Content-Encoding`. Skip tiny responses and already-compressed formats (images). Better done at the proxy/CDN (Nginx) than in Node, since it uses CPU
- **CORS:** a browser rule. Cross-origin JS can read a response only if the server allows its origin (`Access-Control-Allow-Origin`)
    - **Simple requests** (GET/HEAD/POST with simple headers and form content types) go straight out
    - Otherwise the browser sends a **preflight** `OPTIONS` with `Access-Control-Request-Method/Headers`; server answers with allowed methods/headers and `Access-Control-Max-Age` to cache it
    - **Credentials** (cookies): needs `Access-Control-Allow-Credentials: true` and a specific origin, never `*`
    - CORS doesn't protect the server: curl ignores it. It's not authentication
- **HTTP/2:** binary framing, **multiplexing** many requests over one TCP connection (no more domain sharding / bundling for that reason), HPACK header compression, stream priorities. Server push is deprecated. Still has TCP head-of-line blocking on packet loss
- **HTTP/3:** runs on QUIC (UDP): no TCP head-of-line blocking, faster handshakes (0-RTT/1-RTT with TLS 1.3 built in), connection migration across networks
- Other optimizations: keep-alive, pagination, field selection, CDN, avoiding over-fetching, `Idempotency-Key` for retries

**Code Challenge:**
```javascript
// In Express:
// 1. Configure CORS for two allowed origins with credentials, without using '*'
// 2. Serve GET /products with Cache-Control and an ETag, and return 304 when it matches
// 3. Enable compression only for responses above 1 KB
// 4. Explain why a browser sends OPTIONS before your PUT request
```

**Expected Solution:**
```javascript
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const crypto = require('node:crypto');
const app = express();

// 1.
const allowed = new Set(['https://shop.example.com', 'https://admin.example.com']);
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowed.has(origin)) return cb(null, origin || false); // no Origin = same-origin / server-to-server
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600, // cache preflight 10 minutes
}));
// cors sets `Vary: Origin` so caches don't mix responses between origins

// 3.
app.use(compression({ threshold: 1024 }));

// 2.
app.get('/products', async (req, res) => {
  const products = await productsService.list();
  const body = JSON.stringify(products);
  const etag = `"${crypto.createHash('sha1').update(body).digest('base64')}"`;

  res.set({ 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300', ETag: etag });
  if (req.get('If-None-Match') === etag) return res.status(304).end();
  res.type('application/json').send(body);
});
// (Express already sends weak ETags and handles 304 via req.fresh; this shows the mechanics.)

// 4. PUT is not a "simple" method, and a JSON Content-Type / Authorization header isn't a simple header,
//    so the browser first asks the server (OPTIONS preflight) whether this origin may send it.
//    If the preflight response doesn't allow it, the real request is never sent.
```

**Evaluation Criteria:**
- Knows Cache-Control directives, ETag/304 flow and Vary
- Knows where to do compression and its CPU trade-off
- Explains simple vs preflighted requests and the credentials + `*` restriction; knows CORS isn't a server-side protection
- Clear HTTP/1.1 → HTTP/2 → HTTP/3 differences (multiplexing, HPACK, QUIC)

---

## 8.8 Databases (syllabus)

### Question 80: ETL & Data Warehousing
**Question:** What is the difference between OLTP and OLAP? What is a data warehouse, and how does it differ from a data lake? Explain ETL vs ELT, star and snowflake schemas, and fact vs dimension tables.

**Expected Answer:**
- **OLTP:** the app's operational DB: many small, fast reads/writes, normalized, row-oriented (PostgreSQL, MySQL). **OLAP:** analytics: few large scans and aggregations over history, denormalized, column-oriented (Redshift, BigQuery, Snowflake, ClickHouse)
- Don't run heavy reports on the production OLTP DB; use a read replica or a warehouse
- **Data warehouse:** structured, cleaned, modeled data for BI/reporting (schema-on-write). **Data lake:** raw files of any format in cheap object storage (S3), schema-on-read. **Lakehouse:** table formats (Iceberg, Delta) add warehouse features on top of a lake
- **ETL:** Extract → Transform (outside, e.g. in a Node/Spark job) → Load. **ELT:** load raw data first, transform inside the warehouse with SQL (dbt). ELT is the modern default because warehouses scale compute cheaply
- **Star schema:** a central **fact table** (measurable events: sales, with foreign keys + numeric measures like quantity, amount) surrounded by **dimension tables** (descriptive context: date, customer, product, store). **Snowflake schema:** dimensions normalized into sub-dimensions (fewer duplicates, more joins)
- **Slowly changing dimensions:** Type 1 overwrite, Type 2 add a new row with valid_from/valid_to to keep history
- **Pipelines:** batch (nightly) vs streaming/CDC (Debezium, Kafka, DMS); orchestrated with Airflow, Step Functions, etc. Jobs must be **incremental** (watermark on `updated_at` or CDC) and **idempotent** (upsert / MERGE, so reruns don't duplicate data)

**Code Challenge:**
```javascript
// 1. Design a star schema for e-commerce sales (fact_sales + dimensions)
// 2. Write a Node.js ETL job that streams orders from PostgreSQL, transforms them, and loads them in batches into the warehouse
// 3. Make the job incremental (only rows changed since the last run) and idempotent
```

**Expected Solution:**
```sql
-- 1.
CREATE TABLE dim_date     (date_key INT PRIMARY KEY, date DATE, month INT, quarter INT, year INT, is_weekend BOOLEAN);
CREATE TABLE dim_customer (customer_key SERIAL PRIMARY KEY, customer_id INT, country TEXT, segment TEXT,
                           valid_from TIMESTAMP, valid_to TIMESTAMP);            -- SCD type 2
CREATE TABLE dim_product  (product_key SERIAL PRIMARY KEY, product_id INT, name TEXT, category TEXT, brand TEXT);
CREATE TABLE fact_sales (
  order_item_id BIGINT PRIMARY KEY,           -- natural key → idempotent upserts
  date_key INT REFERENCES dim_date,
  customer_key INT REFERENCES dim_customer,
  product_key INT REFERENCES dim_product,
  quantity INT,
  unit_price NUMERIC(12,2),
  revenue NUMERIC(12,2)
);
```
```javascript
// 2 + 3.
const { Pool } = require('pg');
const QueryStream = require('pg-query-stream');
const { pipeline } = require('node:stream/promises');
const { Writable } = require('node:stream');

const source = new Pool({ connectionString: process.env.OLTP_URL });
const warehouse = new Pool({ connectionString: process.env.DWH_URL });

async function runEtl() {
  const { rows: [state] } = await warehouse.query(
    `SELECT last_synced_at FROM etl_state WHERE job = 'sales'`);
  const since = state?.last_synced_at ?? new Date(0);
  const runStartedAt = new Date();

  const client = await source.connect();
  try {
    const stream = client.query(new QueryStream(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price,
              o.customer_id, o.created_at
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
       WHERE o.updated_at > $1 AND o.updated_at <= $2
       ORDER BY o.updated_at`, [since, runStartedAt]));

    let batch = [];
    const flush = async () => {
      if (!batch.length) return;
      const values = [];
      const placeholders = batch.map((r, i) => {
        values.push(r.order_item_id, r.date_key, r.customer_id, r.product_id, r.quantity, r.unit_price, r.revenue);
        const b = i * 7;
        return `($${b + 1}, $${b + 2}, (SELECT customer_key FROM dim_customer WHERE customer_id = $${b + 3} AND valid_to IS NULL),
                 (SELECT product_key FROM dim_product WHERE product_id = $${b + 4}), $${b + 5}, $${b + 6}, $${b + 7})`;
      });
      await warehouse.query(
        `INSERT INTO fact_sales (order_item_id, date_key, customer_key, product_key, quantity, unit_price, revenue)
         VALUES ${placeholders.join(',')}
         ON CONFLICT (order_item_id) DO UPDATE
           SET quantity = EXCLUDED.quantity, unit_price = EXCLUDED.unit_price, revenue = EXCLUDED.revenue`,
        values);
      batch = [];
    };

    await pipeline(stream, new Writable({
      objectMode: true,
      async write(row, _enc, cb) {
        try {
          // Transform
          batch.push({
            order_item_id: row.id,
            date_key: Number(row.created_at.toISOString().slice(0, 10).replaceAll('-', '')), // 20261028
            customer_id: row.customer_id,
            product_id: row.product_id,
            quantity: row.quantity,
            unit_price: row.unit_price,
            revenue: row.quantity * Number(row.unit_price),
          });
          if (batch.length >= 1000) await flush();
          cb();
        } catch (err) { cb(err); }
      },
      async final(cb) {
        try { await flush(); cb(); } catch (err) { cb(err); }
      },
    }));

    // Move the watermark only after a successful load
    await warehouse.query(
      `INSERT INTO etl_state (job, last_synced_at) VALUES ('sales', $1)
       ON CONFLICT (job) DO UPDATE SET last_synced_at = EXCLUDED.last_synced_at`, [runStartedAt]);
  } finally {
    client.release();
  }
}
// Incremental: watermark on updated_at. Idempotent: upsert on the natural key, so a rerun of the
// same window overwrites instead of duplicating. Streaming + batches keeps memory flat.
```

**Evaluation Criteria:**
- Clear OLTP vs OLAP (row vs column storage, workload) distinction
- Knows warehouse vs lake, ETL vs ELT and why ELT is common now
- Correct star schema: facts with measures and FKs, descriptive dimensions; knows SCD type 2
- ETL job streams, batches, is incremental (watermark/CDC) and idempotent (upsert)

---

## 8.9 Docker & Kubernetes (syllabus)

### Question 81: Deployment Strategies & Load Balancing
**Question:** What are the options for deploying a Node.js app: a server behind Nginx, containers (Docker/Kubernetes), or serverless (FaaS)? What are the trade-offs? What does a reverse proxy do? Explain load-balancing algorithms, health checks, sticky sessions, and L4 vs L7 load balancers.

**Expected Answer:**
- **VM/server + Nginx + PM2/systemd:** full control, cheap at steady load, simple; but you patch the OS, scale by hand, and environments drift
- **Containers (Docker on ECS/Kubernetes):** same image everywhere, autoscaling, rolling deploys, good for long-running services and WebSockets; more platform complexity
- **Serverless/FaaS (Lambda, Cloud Functions):** no servers, scale to zero, pay per request; but cold starts, time limits (15 min), no persistent connections (DB connection pooling needs RDS Proxy), vendor lock-in, expensive at high steady load
- **Reverse proxy (Nginx, Envoy, Traefik, HAProxy):** sits in front of the app: TLS termination, load balancing, compression, caching, static files, rate limiting, request size limits, buffering slow clients so Node doesn't hold connections
- **Algorithms:** round robin, weighted round robin, least connections, IP hash, random/power-of-two choices, least response time
- **Health checks:** active (LB polls `/health`) and passive (mark a backend down after errors); remove unhealthy instances
- **Sticky sessions:** route a client to the same instance (cookie or IP hash). Needed for in-memory sessions or Socket.IO polling; better to make the app stateless (sessions in Redis) so any instance can serve any request
- **L4 vs L7:** L4 (TCP/UDP: AWS NLB) routes by IP/port, very fast, can't see HTTP. L7 (HTTP: ALB, Nginx) routes by host/path/headers, terminates TLS, does retries, can inspect content
- **Behind a proxy:** `app.set('trust proxy', 1)` so `req.ip`/`req.protocol` come from `X-Forwarded-*`; keep-alive timeouts in Node must be longer than the LB's idle timeout
- Deployment strategies: rolling, blue-green, canary (see Q47)

**Code Challenge:**
```nginx
# 1. Write an Nginx config that reverse-proxies to 3 Node.js instances (least_conn), sets X-Forwarded-* headers, and serves static files
# 2. Add TLS termination and gzip
# 3. Add WebSocket support
# 4. Explain what changes in the app when it sits behind a proxy (trust proxy, real client IP)
```

**Expected Solution:**
```nginx
# 1-3.
upstream api_backend {
    least_conn;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=10s;
    keepalive 32;
}

map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      '';
}

server {
    listen 80;
    server_name shop.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name shop.example.com;

    ssl_certificate     /etc/letsencrypt/live/shop.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/shop.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    gzip on;
    gzip_types application/json text/css application/javascript;
    gzip_min_length 1024;

    client_max_body_size 5m;

    location /static/ {
        root /var/www/shop;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # WebSocket upgrade (and keep-alive to upstream when not upgrading)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 60s;
    }
}
```
```javascript
// 4.
app.set('trust proxy', 1); // trust one hop: req.ip = real client, req.protocol = 'https', secure cookies work
// Without it: every request looks like it comes from 127.0.0.1 → rate limiting per IP breaks,
// and `secure` cookies aren't set because Express thinks the request is plain HTTP.
const server = app.listen(3001);
server.keepAliveTimeout = 65_000; // longer than the LB idle timeout (ALB default 60s) to avoid 502s
server.headersTimeout = 66_000;
```

**Evaluation Criteria:**
- Compares server, container and FaaS deployments with real trade-offs
- Knows what a reverse proxy offloads from Node
- Names LB algorithms, health checks, and prefers stateless apps over sticky sessions
- Clear L4 vs L7 distinction
- Working Nginx config incl. headers, TLS, WebSocket; knows `trust proxy` and keep-alive timeouts

---

## 8.10 CI/CD & Teamwork (syllabus)

### Question 82: Code Quality Gates & Code Review
**Question:** How do you enforce code quality in a team? Explain ESLint vs Prettier, pre-commit hooks (husky, lint-staged), coverage configuration and thresholds, and quality gates in CI. What do you look for in a code review, and how do you give good review feedback?

**Expected Answer:**
- **ESLint:** static analysis for bugs and code patterns (unused vars, no-floating-promises with typescript-eslint, security plugins). **Prettier:** formatting only. Let Prettier own formatting and turn off ESLint's style rules (`eslint-config-prettier`) so they don't fight. Biome is a newer all-in-one alternative
- ESLint 9 uses flat config (`eslint.config.js`)
- **Pre-commit hooks:** husky installs git hooks; lint-staged runs linters/formatters only on staged files (fast). Hooks can be skipped (`--no-verify`), so CI must run the same checks
- **Coverage:** Jest/Vitest/c8 collect line/branch/function/statement coverage; `coverageThreshold` fails the run below a target. Coverage shows what's *not* tested, not test quality; 100% isn't the goal. Thresholds stop regressions
- **CI quality gates** (required before merge): lint, type check (`tsc --noEmit`), tests + coverage, build, dependency audit (`npm audit`, Snyk/Dependabot), secret scanning, SAST (CodeQL, Sonar). Branch protection: required checks + required reviews
- **Code review, what to look for:** correctness and edge cases, security (injection, authz, secrets, validation), error handling, tests for the change, performance (N+1, unbounded queries), API/contract and migration safety, readability and naming, consistency with the codebase, observability (logs/metrics)
- **How:** small PRs with a clear description; review fast; separate blocking issues from suggestions/nits (prefix `nit:`); explain *why* and propose an alternative; ask questions instead of accusing; praise good work; automate style so humans review logic

**Code Challenge:**
```javascript
// 1. Write an eslint.config.js (flat config) for a Node.js + TypeScript project with Prettier
// 2. Set up husky + lint-staged so only staged files are linted and formatted on commit
// 3. Configure Jest coverage with an 80% threshold that fails CI
// 4. Review this PR snippet and write 3 review comments:
app.get('/user', async (req, res) => {
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.query.id}`);
  res.send(user);
});
```

**Expected Solution:**
```javascript
// 1. eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: { projectService: true },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'no-console': ['warn', { allow: ['error'] }],
    },
  },
  prettier, // last: turns off rules that conflict with Prettier
);

// 2. package.json
// "scripts": { "prepare": "husky" },
// "lint-staged": {
//   "*.{ts,js}": ["eslint --fix", "prettier --write"],
//   "*.{json,md,yml}": ["prettier --write"]
// }
// .husky/pre-commit:
//   npx lint-staged

// 3. jest.config.js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/index.ts'],
  coverageReporters: ['text-summary', 'lcov'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};
// CI: npm run lint && npx tsc --noEmit && npm test   (any failure blocks the merge)

// 4. Review comments:
// 🔴 Blocking (security): SQL injection. `req.query.id` goes straight into the query.
//    Use a parameterized query: db.query('SELECT ... WHERE id = $1', [id]).
// 🔴 Blocking: no validation or 404. Validate that id is a positive integer (400 otherwise),
//    and return 404 when no user is found. Also no error handling: wrap in try/catch or use the async error wrapper.
// 🟡 Suggestion: `SELECT *` returns password hashes and internal fields to the client.
//    Select explicit columns or map to a response DTO. Also, REST naming: GET /users/:id.
```

**Evaluation Criteria:**
- Knows ESLint vs Prettier roles and how to make them coexist
- Uses lint-staged + husky and still enforces checks in CI
- Sets coverage thresholds and understands the limits of coverage
- Lists sensible CI quality gates and branch protection
- Review comments catch the SQL injection, data exposure and validation issues, and are constructive and prioritized

---

### Question 83: Agile & Scrum
**Question:** What are the Agile values? Explain Scrum roles, events (sprint planning, daily, review, retrospective) and artifacts (product backlog, sprint backlog, increment). What is the Definition of Done? How does Kanban differ from Scrum? Which tools have you used (Jira, Linear, etc.)?

**Expected Answer:**
- **Agile Manifesto values:** individuals and interactions over processes and tools; working software over comprehensive documentation; customer collaboration over contract negotiation; responding to change over following a plan (the right side still has value). Deliver small increments often and adapt using feedback
- **Scrum roles (accountabilities):**
    - **Product Owner:** maximizes product value; owns and orders the product backlog
    - **Scrum Master:** coaches the team on Scrum, removes impediments, facilitates (servant leader, not a project manager)
    - **Developers:** the cross-functional team that builds the increment and owns the sprint plan
- **Events:** the **Sprint** (fixed 1–4 weeks) contains: **Sprint Planning** (why/what/how: sprint goal + selected items + plan), **Daily Scrum** (15 min, developers inspect progress toward the goal and adapt; not a status report to a manager), **Sprint Review** (demo the increment to stakeholders, adapt the backlog), **Retrospective** (improve how the team works). Backlog refinement is an ongoing activity
- **Artifacts + commitments:** Product Backlog (→ Product Goal), Sprint Backlog (→ Sprint Goal), Increment (→ Definition of Done)
- **Definition of Done:** shared quality checklist every item must meet to count as done (code reviewed, tests passing, coverage, deployed to staging, docs updated, acceptance criteria met). Different from acceptance criteria, which are per story
- **Estimation:** story points (relative effort, Fibonacci, planning poker), velocity for forecasting, not as a performance metric
- **Kanban:** continuous flow, no fixed sprints, no prescribed roles; visualize the board, **limit work in progress (WIP)**, measure lead/cycle time and throughput. Good for support/ops/unpredictable work. Scrumban mixes both
- **Tools:** Jira, Linear, Azure DevOps, GitHub Projects, Trello; link tickets to branches/PRs; dashboards for burndown/cycle time
- **Senior signal:** has real examples: how they split stories, dealt with scope creep mid-sprint, raised a blocker, or used a retro to fix a recurring problem

**Evaluation Criteria:**
- States the Agile values and the idea of short feedback loops
- Correct Scrum roles, events and artifacts, including what each event is for
- Knows the Definition of Done vs acceptance criteria
- Clear Scrum vs Kanban comparison (timeboxes vs flow, WIP limits)
- Uses concrete experience, not just textbook definitions

---

## 8.11 Design Patterns & Architecture

### Question 84: Creational Patterns & Dependency Injection
**Question:** Explain the Factory, Abstract Factory and Singleton patterns. How does Node's module cache act as a singleton, and what are the downsides of singletons? What is dependency injection, and how does it help testing (manual DI vs containers like NestJS, awilix, inversify)?

**Expected Answer:**
- **Factory (method/simple factory):** a function or method decides which concrete class to create based on input, so callers depend on an interface, not on `new ConcreteClass()`. Adding a type changes one place
- **Abstract Factory:** creates **families** of related objects that must be used together (e.g. AWS queue + AWS storage vs local queue + local storage) without naming concrete classes
- **Singleton:** exactly one instance with global access (config, connection pool, logger). In Node, a module's exports are cached after the first `require`/`import`, so `module.exports = new Pool()` is already a singleton per process (caveats: different resolved paths or duplicate package copies give separate instances; cluster/workers each have their own)
- **Singleton downsides:** hidden global state, hidden dependencies, hard to replace in tests, import-order/initialization problems, shared mutable state
- **Dependency Injection:** a class receives its dependencies (constructor/params) instead of creating them. Follows Dependency Inversion (depend on abstractions). Benefits: testability (inject fakes), swappable implementations, explicit dependencies, a single "composition root" that wires everything
- **Manual DI** (factory functions at startup) is often enough in Node. **Containers:** NestJS (built-in, decorators, scopes), awilix (no decorators, register + resolve), inversify (decorators + reflect-metadata, TS). Containers manage lifetimes (singleton, scoped per request, transient)
- **Builder** (step-by-step construction, e.g. query builders) and **Prototype** (`Object.create`, clone) are the other creational patterns

**Code Challenge:**
```javascript
// 1. Write a NotificationFactory that creates Email, SMS or Push senders from a type string
// 2. Write an Abstract Factory that creates a matching { queue, storage } pair for 'aws' or 'local'
// 3. Write a DB connection singleton two ways (module cache and class) and explain the testing problem
// 4. Refactor a UserService that does `new PostgresRepo()` internally to receive its repo by constructor injection, then test it with a fake
```

**Expected Solution:**
```javascript
// 1.
class EmailSender { send(to, msg) { /* SES/SMTP */ return `email to ${to}`; } }
class SmsSender   { send(to, msg) { /* Twilio */   return `sms to ${to}`; } }
class PushSender  { send(to, msg) { /* FCM */      return `push to ${to}`; } }

const senders = { email: EmailSender, sms: SmsSender, push: PushSender };
function createNotificationSender(type) {
  const Sender = senders[type];
  if (!Sender) throw new Error(`Unknown notification type: ${type}`);
  return new Sender();
}

// 2.
const awsFactory = {
  createQueue: () => new SqsQueue(process.env.QUEUE_URL),
  createStorage: () => new S3Storage(process.env.BUCKET),
};
const localFactory = {
  createQueue: () => new InMemoryQueue(),
  createStorage: () => new DiskStorage('./tmp'),
};
function createInfrastructure(env) {
  const factory = env === 'aws' ? awsFactory : localFactory;
  return { queue: factory.createQueue(), storage: factory.createStorage() }; // always a matching pair
}

// 3a. Module cache singleton (db.js)
const { Pool } = require('pg');
module.exports = new Pool({ connectionString: process.env.DATABASE_URL });

// 3b. Class singleton
class Database {
  static #instance;
  static getInstance() {
    if (!Database.#instance) Database.#instance = new Pool({ connectionString: process.env.DATABASE_URL });
    return Database.#instance;
  }
}
// Testing problem: any module that requires db.js gets the real pool; you need jest.mock or
// module patching to replace it, and state leaks between tests. DI avoids that.

// 4.
// Before
class UserServiceBefore {
  constructor() { this.repo = new PostgresRepo(); } // hard-wired, untestable without a DB
}

// After
class UserService {
  constructor({ userRepo, mailer }) {
    this.userRepo = userRepo;
    this.mailer = mailer;
  }
  async register(email) {
    if (await this.userRepo.findByEmail(email)) throw new Error('Email taken');
    const user = await this.userRepo.create({ email });
    await this.mailer.send(email, 'Welcome!');
    return user;
  }
}

// Composition root (app startup)
const userService = new UserService({ userRepo: new PostgresRepo(pool), mailer: new EmailSender() });

// Test with fakes
test('register rejects duplicate emails', async () => {
  const fakeRepo = { findByEmail: async () => ({ id: 1 }), create: jest.fn() };
  const service = new UserService({ userRepo: fakeRepo, mailer: { send: jest.fn() } });
  await expect(service.register('a@b.com')).rejects.toThrow('Email taken');
  expect(fakeRepo.create).not.toHaveBeenCalled();
});
```

**Evaluation Criteria:**
- Clear Factory vs Abstract Factory distinction (one product vs a family)
- Knows Node's module cache singleton and its caveats
- Explains singleton downsides, especially for testing
- Refactors to constructor injection and tests with fakes
- Knows when a DI container is worth it vs manual wiring

---

### Question 85: Structural Patterns
**Question:** Explain the Adapter, Decorator, Facade, Proxy and Module patterns. What is a mixin, and how does it compare to inheritance? Give a real Node.js example of each.

**Expected Answer:**
- **Adapter:** converts one interface into the one the client expects. Wrap a third-party/legacy API (callback SDK → promises, `util.promisify`, different payment providers behind one `PaymentGateway` interface). Lets you swap vendors
- **Decorator:** adds behavior to an object/function without changing it, by wrapping it with the same interface. Higher-order functions (`withRetry(fn)`), Express middleware, TS/NestJS decorators (`@UseGuards`). Stacks well
- **Facade:** one simple entry point over a complex subsystem (`orderFacade.placeOrder()` coordinating inventory, payments, email). Reduces coupling for callers
- **Proxy:** same interface as the real object, controls access to it: lazy loading, caching, access control, logging, validation. JS has a built-in `Proxy` object with traps (`get`, `set`, `apply`)
- **Adapter vs Decorator vs Proxy:** adapter changes the interface; decorator keeps it and adds behavior; proxy keeps it and controls access
- **Module pattern:** encapsulate private state and expose a public API: historically IIFE + closure, today ES/CommonJS modules (file scope is private, `export` is public)
- **Mixin:** copies a set of methods into a class/object (`Object.assign(Class.prototype, mixin)` or class-factory mixins `const Timestamped = (Base) => class extends Base {...}`). Shares behavior across unrelated classes without a deep hierarchy ("has-behavior" instead of "is-a"). Risks: name collisions, unclear origin of methods. Composition is usually preferred over both inheritance and mixins

**Code Challenge:**
```javascript
// 1. Adapter: wrap a legacy callback-based payment SDK so it fits a promise-based PaymentGateway interface
// 2. Decorator: add retry and logging to any async function without changing it (withRetry(withLogging(fn)))
// 3. Facade: an OrderFacade.placeOrder() that hides inventory, payment and email services
// 4. Proxy: a cache proxy around a slow repository using JS Proxy
// 5. Mixin: add Serializable and Timestamped behavior to a class
```

**Expected Solution:**
```javascript
// 1. Adapter
class LegacyPayAdapter {
  constructor(legacySdk) { this.sdk = legacySdk; }
  charge({ amount, currency, token }) {
    return new Promise((resolve, reject) => {
      // legacy: sdk.makePayment(cents, cur, card, (err, txId) => ...)
      this.sdk.makePayment(Math.round(amount * 100), currency, token, (err, txId) =>
        err ? reject(err) : resolve({ id: txId, status: 'succeeded' }));
    });
  }
}
// StripeAdapter, LegacyPayAdapter, ... all expose charge() → callers don't care which one

// 2. Decorators
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const withLogging = (fn, name = fn.name) => async (...args) => {
  const start = Date.now();
  try {
    const result = await fn(...args);
    console.log(`${name} ok in ${Date.now() - start}ms`);
    return result;
  } catch (err) {
    console.error(`${name} failed: ${err.message}`);
    throw err;
  }
};
const withRetry = (fn, { retries = 3, baseMs = 100 } = {}) => async (...args) => {
  for (let attempt = 0; ; attempt++) {
    try { return await fn(...args); } catch (err) {
      if (attempt >= retries) throw err;
      await sleep(baseMs * 2 ** attempt);
    }
  }
};
const fetchUser = withRetry(withLogging(async (id) => api.get(`/users/${id}`), 'fetchUser'));

// 3. Facade
class OrderFacade {
  constructor({ inventory, payments, mailer }) { Object.assign(this, { inventory, payments, mailer }); }
  async placeOrder({ userEmail, items, paymentToken }) {
    await this.inventory.reserve(items);
    try {
      const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
      const payment = await this.payments.charge({ amount: total, currency: 'USD', token: paymentToken });
      await this.mailer.send(userEmail, `Order confirmed: ${payment.id}`);
      return { paymentId: payment.id, total };
    } catch (err) {
      await this.inventory.release(items);
      throw err;
    }
  }
}

// 4. Proxy
function withCache(repo, ttlMs = 60_000) {
  const cache = new Map();
  return new Proxy(repo, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== 'function' || !String(prop).startsWith('find')) return value;
      return async (...args) => {
        const key = `${String(prop)}:${JSON.stringify(args)}`;
        const hit = cache.get(key);
        if (hit && hit.expires > Date.now()) return hit.value;
        const result = await value.apply(target, args);
        cache.set(key, { value: result, expires: Date.now() + ttlMs });
        return result;
      };
    },
  });
}
const productRepo = withCache(new ProductRepo(db));

// 5. Mixins (class-factory style)
const Serializable = (Base) => class extends Base {
  toJSON() { return { type: this.constructor.name, ...this }; }
};
const Timestamped = (Base) => class extends Base {
  constructor(...args) { super(...args); this.createdAt = new Date(); }
  touch() { this.updatedAt = new Date(); }
};
class Entity {}
class Product extends Serializable(Timestamped(Entity)) {
  constructor(name) { super(); this.name = name; }
}
```

**Evaluation Criteria:**
- Explains intent of each pattern and distinguishes adapter vs decorator vs proxy
- Gives real Node examples (promisify, middleware, JS Proxy)
- Working, composable function decorators
- Facade handles compensation on failure
- Knows mixin trade-offs and prefers composition

---

### Question 86: Behavioral Patterns
**Question:** Explain the Strategy, Observer, Mediator and Chain of Responsibility patterns. Where do you see them in Node.js (EventEmitter, Express middleware)? When does a pattern become over-engineering?

**Expected Answer:**
- **Strategy:** a family of interchangeable algorithms behind one interface, chosen at runtime (pricing rules, payment providers, auth strategies in Passport.js, compression algorithms). Replaces growing `switch`/`if` chains; follows open/closed
- **Observer:** subjects notify subscribed observers when something happens; one-to-many, loose coupling. Node: `EventEmitter`, streams, DOM events; across services it becomes pub/sub. Watch out for leaks (unremoved listeners) and hidden control flow
- **Mediator:** objects talk through a central mediator instead of to each other, turning many-to-many links into one-to-many. Chat rooms, UI form coordination, an in-process command bus (MediatR-style), air-traffic-control analogy. Risk: the mediator becomes a god object
- **Chain of Responsibility:** a request passes along a chain of handlers; each one handles it, passes it on, or stops it. Express/Koa middleware (`next()`), validation pipelines, approval workflows, logging levels
- **Observer vs Mediator:** observer broadcasts to anyone listening; mediator coordinates specific participants with knowledge of the interaction
- Others worth naming: Command (encapsulate a request: queues, undo), State (behavior changes with state: order status machine), Template Method, Iterator (JS iterators)
- **Over-engineering:** applying a pattern before there's variation to manage, layers of indirection with a single implementation, patterns used to look smart. Start simple and refactor to a pattern when the second or third case shows up (rule of three); in JS a plain function or object map is often the whole pattern

**Code Challenge:**
```javascript
// 1. Strategy: replace a big switch on shippingType with pluggable pricing strategies
// 2. Observer: an order system where inventory, email and analytics subscribe to 'order:placed'
// 3. Chain of Responsibility: an approval chain (manager < $1k, director < $10k, CEO otherwise)
// 4. Mediator: a chat room that routes messages between users without users knowing each other
```

**Expected Solution:**
```javascript
// 1. Strategy
const shippingStrategies = {
  standard: ({ weightKg }) => 5 + weightKg * 0.5,
  express:  ({ weightKg }) => 15 + weightKg * 1.2,
  pickup:   () => 0,
};
function shippingCost(type, order) {
  const strategy = shippingStrategies[type];
  if (!strategy) throw new Error(`Unsupported shipping type: ${type}`);
  return strategy(order);
}
// New type = new entry; shippingCost doesn't change (open/closed)

// 2. Observer
const { EventEmitter } = require('node:events');
const orderEvents = new EventEmitter();
orderEvents.on('order:placed', (order) => inventory.decrement(order.items));
orderEvents.on('order:placed', (order) => mailer.send(order.email, 'Thanks for your order'));
orderEvents.on('order:placed', (order) => analytics.track('purchase', { total: order.total }));
orderEvents.on('error', (err) => logger.error({ err }));

async function placeOrder(order) {
  const saved = await ordersRepo.save(order);
  orderEvents.emit('order:placed', saved); // the order service doesn't know who listens
  return saved;
}

// 3. Chain of Responsibility
class Approver {
  constructor(name, limit) { this.name = name; this.limit = limit; this.next = null; }
  setNext(approver) { this.next = approver; return approver; }
  approve(request) {
    if (request.amount < this.limit) return `${this.name} approved $${request.amount}`;
    if (this.next) return this.next.approve(request);
    throw new Error('No approver available');
  }
}
const manager = new Approver('Manager', 1_000);
manager.setNext(new Approver('Director', 10_000)).setNext(new Approver('CEO', Infinity));
manager.approve({ amount: 500 });    // Manager approved $500
manager.approve({ amount: 5_000 });  // Director approved $5000
manager.approve({ amount: 50_000 }); // CEO approved $50000

// 4. Mediator
class ChatRoom {
  #users = new Map();
  join(user) { this.#users.set(user.name, user); user.room = this; }
  send(message, from, toName) {
    if (toName) return this.#users.get(toName)?.receive(message, from.name);
    for (const [name, user] of this.#users) {
      if (name !== from.name) user.receive(message, from.name);
    }
  }
}
class User {
  constructor(name) { this.name = name; this.room = null; }
  send(message, to) { this.room.send(message, this, to); }
  receive(message, fromName) { console.log(`[${this.name}] ${fromName}: ${message}`); }
}
const room = new ChatRoom();
const ana = new User('Ana'); const luis = new User('Luis');
room.join(ana); room.join(luis);
ana.send('Hi all');          // Luis receives it
ana.send('Hi Luis', 'Luis'); // direct message through the mediator
```

**Evaluation Criteria:**
- Clear intent of each pattern and their Node equivalents (EventEmitter, middleware, Passport strategies)
- Distinguishes observer from mediator
- Idiomatic JS implementations (object maps and functions, not Java-style boilerplate)
- Can say when a pattern is overkill

---

### Question 87: Reactive Programming with RxJS
**Question:** What is reactive programming? Explain Observables, Observers, Subscriptions and Subjects, and how they compare to Promises and EventEmitter. What are hot vs cold observables? Explain the common operators (map, filter, debounceTime, switchMap, mergeMap, concatMap, retry). Where does React fit in the reactive model?

**Expected Answer:**
- **Reactive programming:** programming with asynchronous data streams; you declare how values flow and transform, and changes propagate automatically
- **Observable:** a lazy producer of 0..N values over time, then `complete` or `error`. **Observer:** `{ next, error, complete }`. **Subscription:** the result of `subscribe()`; `unsubscribe()` stops it and runs teardown (cancellation)
- **vs Promise:** a promise is eager, resolves once, and can't be cancelled; an observable is lazy, emits many values, and can be cancelled. **vs EventEmitter:** observables have composable operators, completion/error semantics and built-in teardown
- **Cold:** each subscriber gets its own execution from the start (an HTTP call per subscriber). **Hot:** shared source already producing, subscribers join mid-stream (mouse events, WebSocket). `share()`/`shareReplay()` make a cold observable hot
- **Subjects:** both observable and observer; multicast. `Subject` (no initial value), `BehaviorSubject` (current value, new subscribers get it immediately: state), `ReplaySubject` (replays the last N), `AsyncSubject`
- **Operators** (pure functions used in `pipe`): `map`, `filter`, `tap` (side effects), `debounceTime`, `throttleTime`, `distinctUntilChanged`, `scan` (running state), `catchError`, `retry({ count, delay })`, `takeUntil`, `combineLatest`, `merge`
- **Flattening:** `switchMap` cancels the previous inner observable (search-as-you-type); `mergeMap` runs all concurrently (parallel saves, with a concurrency limit); `concatMap` queues them in order (sequential writes); `exhaustMap` ignores new ones while busy (login button)
- **Where it's used:** Angular (HttpClient, forms), NestJS microservices/interceptors, complex event handling, WebSockets
- **React:** not RxJS-based, but its model is reactive: UI = f(state) and it re-renders when state changes. State libraries (MobX, signals, Redux + redux-observable) bring explicit reactivity. Always unsubscribe in `useEffect` cleanup

**Code Challenge:**
```javascript
// 1. Create an observable from an EventEmitter and from a Promise
// 2. Search-as-you-type: debounce input 300ms, ignore duplicates, cancel the previous request (switchMap)
// 3. Poll an endpoint every 5s, retry failed calls with backoff, stop after 10 tries
// 4. Explain the difference between switchMap, mergeMap and concatMap with an example
```

**Expected Solution:**
```javascript
const { fromEvent, from, interval, timer } = require('rxjs');
const {
  map, filter, debounceTime, distinctUntilChanged, switchMap, retry, take, catchError,
} = require('rxjs/operators');
const { EMPTY } = require('rxjs');

// 1.
const { EventEmitter } = require('node:events');
const emitter = new EventEmitter();
const orders$ = fromEvent(emitter, 'order');      // hot: shares the emitter's events
const user$ = from(fetchUser(1));                 // from a promise (already started: eager)
// lazy alternative: defer(() => fetchUser(1))

orders$.pipe(filter((o) => o.total > 100)).subscribe((o) => console.log('big order', o.id));

// 2. (browser)
// const input = document.querySelector('#search');
const results$ = fromEvent(input, 'input').pipe(
  map((e) => e.target.value.trim()),
  filter((q) => q.length >= 2),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((q) =>
    from(fetch(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.json())).pipe(
      catchError(() => EMPTY), // one failed search doesn't kill the stream
    )),
);
const sub = results$.subscribe(renderResults);
// later: sub.unsubscribe();

// 3.
const status$ = interval(5000).pipe(
  take(10),
  switchMap(() =>
    from(fetch('/api/job/42').then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })).pipe(
      retry({ count: 3, delay: (_err, attempt) => timer(2 ** attempt * 500) }), // 1s, 2s, 4s
    )),
);
status$.subscribe({
  next: (s) => console.log('status', s),
  error: (e) => console.error('gave up', e),
  complete: () => console.log('done polling'),
});

// 4. User clicks "save" 3 times quickly; each click triggers an HTTP request:
// switchMap → cancels earlier requests, only the last result is kept (good for search, bad for saves)
// mergeMap  → all 3 run in parallel, results arrive in any order
// concatMap → runs them one after another, in order (good for ordered writes)
```

**Evaluation Criteria:**
- Explains observables as lazy, multi-value, cancellable streams vs Promise/EventEmitter
- Knows hot vs cold and Subject variants (BehaviorSubject for state)
- Picks the right flattening operator and explains why
- Handles errors inside the inner observable and unsubscribes
- Can relate the reactive model to React

---

### Question 88: MVC, Layered & Flux Architectures
**Question:** Explain MVC and how it maps to a Node.js API (routes/controllers, services, repositories/models). What is layered/clean architecture? What is Flux, why did it appear (unidirectional data flow), and how does it relate to Redux?

**Expected Answer:**
- **MVC:** Model (data + business rules), View (presentation), Controller (handles input, calls the model, picks the view). Classic server-rendered frameworks (Rails, Sails, Express + templates)
- **In a JSON API** the "view" is the serialized response. Common Node layering:
    - **Routes/controllers:** HTTP only: parse/validate input, call a service, map the result/errors to status codes
    - **Services (use cases):** business logic and orchestration, transactions; no `req`/`res`
    - **Repositories/data access:** queries/ORM; return domain objects
    - Models/entities, DTOs, validation schemas
- **Why:** separation of concerns, testability (test services without HTTP), swap the DB or transport (REST → queue consumer) without rewriting logic. Fat controllers are the usual smell
- **Clean/Hexagonal (ports & adapters):** dependencies point inward: the domain doesn't depend on frameworks or the DB; outer layers (web, DB, messaging) are adapters implementing interfaces (ports) the core defines. More decoupling, more boilerplate; worth it for complex domains
- **Folder structure:** by feature/module (`users/`, `orders/` each with controller/service/repo) scales better than by layer (`controllers/`, `services/`)
- **Flux** (Facebook, 2014): MVC with two-way bindings in big UIs led to cascading updates that were hard to follow. Flux enforces **unidirectional data flow**: Action → Dispatcher → Store(s) → View → (user) new Action. State changes only through actions
- **Redux:** a simplified Flux: a single store, pure reducers `(state, action) => newState`, no dispatcher (the store dispatches), immutable updates, middleware for side effects (thunk/saga). Redux Toolkit is the modern way; for server data, React Query often replaces it
- Backend parallels: event sourcing and CQRS use the same idea (state = fold of events/actions)

**Code Challenge:**
```javascript
// 1. Refactor a route handler that validates, queries the DB and formats the response into controller → service → repository
// 2. Show the folder structure for the refactored feature
// 3. Implement a minimal Flux store: dispatch(action) → reducer → subscribers notified
```

**Expected Solution:**
```javascript
// 1. Before: everything in the route
app.post('/orders', async (req, res) => {
  if (!req.body.items?.length) return res.status(400).json({ error: 'items required' });
  const { rows } = await pool.query('INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *',
    [req.user.id, req.body.items.reduce((s, i) => s + i.price * i.qty, 0)]);
  res.status(201).json({ id: rows[0].id, total: Number(rows[0].total) });
});

// After
// orders/orders.repository.js
class OrdersRepository {
  constructor(pool) { this.pool = pool; }
  async create({ userId, total }) {
    const { rows } = await this.pool.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id, total', [userId, total]);
    return { id: rows[0].id, total: Number(rows[0].total) };
  }
}

// orders/orders.service.js
class ValidationError extends Error {}
class OrdersService {
  constructor({ ordersRepository }) { this.repo = ordersRepository; }
  async placeOrder(userId, items) {
    if (!items?.length) throw new ValidationError('items required');
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return this.repo.create({ userId, total });
  }
}

// orders/orders.controller.js
const makeOrdersController = (ordersService) => ({
  async create(req, res, next) {
    try {
      const order = await ordersService.placeOrder(req.user.id, req.body.items);
      res.status(201).json(order);
    } catch (err) { next(err); } // error middleware maps ValidationError → 400
  },
});

// orders/orders.routes.js
// router.post('/orders', authenticate, controller.create);

// 2.
/*
src/
  orders/
    orders.routes.js
    orders.controller.js
    orders.service.js
    orders.repository.js
    orders.schema.js        (validation)
    orders.service.test.js
  users/
    ...
  shared/
    errors.js
    db.js
  app.js                    (composition root: wires repo → service → controller → routes)
*/

// 3. Minimal Flux/Redux-style store
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);   // the only way to change state
      listeners.forEach((l) => l(state));
      return action;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'cart/add':    return { ...state, items: [...state.items, action.item] };
    case 'cart/remove': return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    default:            return state;
  }
};
const store = createStore(cartReducer, { items: [] });
const unsubscribe = store.subscribe((s) => console.log('items:', s.items.length));
store.dispatch({ type: 'cart/add', item: { id: 1, price: 10 } }); // items: 1
```

**Evaluation Criteria:**
- Explains MVC and maps it correctly to a JSON API's layers
- Keeps HTTP concerns out of services and SQL out of controllers
- Knows clean/hexagonal architecture and its trade-off
- Explains why Flux exists (unidirectional flow) and how Redux simplifies it
- Working layered refactor and minimal store

---

### Question 89: Microservices, SOA & Messaging
**Question:** Compare a monolith, a modular monolith, SOA and microservices. What problems do microservices introduce (data consistency, distributed transactions, observability)? Explain synchronous (REST/gRPC) vs asynchronous (queues, pub/sub) communication, the Saga and Outbox patterns, and idempotent consumers. When would you use RabbitMQ, Kafka, SQS/SNS or Redis Streams?

**Expected Answer:**
- **Monolith:** one deployable. Simple to develop, test, deploy and keep consistent (one DB transaction); scales as a unit; can become a big ball of mud
- **Modular monolith:** one deployable with strict internal module boundaries. Often the best starting point; modules can be extracted later
- **SOA:** enterprise services, often coarse-grained, sharing infrastructure and talking through an ESB (enterprise service bus) with heavyweight contracts (SOAP)
- **Microservices:** small services around business capabilities, each with its **own database**, deployed independently, "smart endpoints, dumb pipes". Benefits: independent deploys/scaling, team autonomy, fault isolation. Costs: distributed systems problems, operational overhead, network latency/failures, data consistency, harder testing and debugging. Need DevOps maturity (CI/CD, containers, observability)
- **Sync (REST/gRPC):** simple request/response, but temporal coupling: if B is down, A fails; latency adds up. Mitigate with timeouts, retries with backoff, circuit breakers, bulkheads
- **Async (messaging):** queues (point-to-point, one consumer processes each message: work distribution) and pub/sub (events fan out to many subscribers). Decoupled and resilient, but eventual consistency and harder flow tracing
- **No distributed transactions** (2PC doesn't scale) → **Saga:** a sequence of local transactions, each with a compensating action. **Choreography** (services react to events; no central brain; harder to follow) vs **orchestration** (a coordinator tells each step; easier to reason about)
- **Outbox pattern:** "save to DB, then publish" can lose the event if the process crashes in between (or publish an event for a rolled-back write). Instead write the event to an `outbox` table **in the same transaction**, and a relay (poller or CDC/Debezium) publishes it → at-least-once delivery
- **At-least-once** means duplicates → **idempotent consumers:** store processed message ids (unique constraint), or make the operation naturally idempotent (upsert, conditional update)
- **Brokers:**
    - **RabbitMQ:** classic broker, flexible routing (exchanges), acks, per-message work queues, RPC
    - **Kafka:** distributed append-only log, very high throughput, retention + replay, ordering per partition, consumer groups; event streaming, event sourcing, CDC
    - **SQS/SNS:** managed AWS; SQS queue (standard or FIFO, DLQs, visibility timeout) + SNS fan-out (SNS → many SQS); EventBridge for routing by rules
    - **Redis Streams/BullMQ:** lightweight, low latency, good for background jobs when Redis is already there; less durable than Kafka
- **Observability:** distributed tracing (OpenTelemetry, trace id propagated through HTTP headers and message metadata), centralized logs, per-service metrics; API gateway, service discovery, contract testing (Pact)

**Code Challenge:**
```javascript
// 1. Split an e-commerce monolith into services and draw which talk sync vs async
// 2. Publish an 'order.created' event and consume it in an inventory service (any broker)
// 3. Make the consumer idempotent so a redelivered message isn't processed twice
// 4. Implement an orchestrated saga for order → payment → inventory with compensation on failure
// 5. Explain the outbox pattern and why "write to DB, then publish" is unsafe
```

**Expected Solution:**
```javascript
// 1.
/*
  Client → API Gateway
     ├─(sync REST)→ Catalog service      (own DB: products)
     ├─(sync REST)→ Orders service       (own DB: orders, outbox)
     │                  └─(async: order.created)→ broker
     │                        ├→ Inventory service  (reserves stock)
     │                        ├→ Payments service   (charges card)
     │                        └→ Notifications      (emails)
     └─(sync REST)→ Users/Auth service
  Rule: sync for queries the user is waiting on; async for side effects and cross-service workflows.
*/

// 2. RabbitMQ (amqplib)
const amqp = require('amqplib');

async function publisher() {
  const conn = await amqp.connect(process.env.AMQP_URL);
  const ch = await conn.createConfirmChannel();
  await ch.assertExchange('orders', 'topic', { durable: true });
  return (event) => new Promise((resolve, reject) => {
    ch.publish('orders', 'order.created', Buffer.from(JSON.stringify(event)),
      { persistent: true, messageId: event.eventId, contentType: 'application/json' },
      (err) => (err ? reject(err) : resolve()));
  });
}

// 3. Idempotent consumer in the inventory service
async function startInventoryConsumer(pool) {
  const conn = await amqp.connect(process.env.AMQP_URL);
  const ch = await conn.createChannel();
  await ch.assertExchange('orders', 'topic', { durable: true });
  const { queue } = await ch.assertQueue('inventory.order-created', {
    durable: true, deadLetterExchange: 'orders.dlx',
  });
  await ch.bindQueue(queue, 'orders', 'order.created');
  await ch.prefetch(10);

  ch.consume(queue, async (msg) => {
    const event = JSON.parse(msg.content.toString());
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // unique constraint on processed_messages.message_id → duplicates are skipped
      const { rowCount } = await client.query(
        'INSERT INTO processed_messages (message_id) VALUES ($1) ON CONFLICT DO NOTHING',
        [event.eventId]);
      if (rowCount === 1) {
        for (const item of event.items) {
          await client.query(
            'UPDATE stock SET reserved = reserved + $1 WHERE product_id = $2',
            [item.qty, item.productId]);
        }
      }
      await client.query('COMMIT');
      ch.ack(msg);
    } catch (err) {
      await client.query('ROLLBACK');
      ch.nack(msg, false, false); // → dead-letter queue after failure
    } finally {
      client.release();
    }
  });
}

// 4. Orchestrated saga
async function placeOrderSaga({ orderId, userId, items, total }, deps) {
  const { orders, payments, inventory } = deps;
  const compensations = [];
  try {
    await orders.create({ orderId, userId, items, status: 'PENDING' });
    compensations.push(() => orders.updateStatus(orderId, 'CANCELLED'));

    const payment = await payments.charge({ orderId, userId, amount: total, idempotencyKey: `pay-${orderId}` });
    compensations.push(() => payments.refund({ paymentId: payment.id, idempotencyKey: `refund-${orderId}` }));

    await inventory.reserve({ orderId, items });
    compensations.push(() => inventory.release({ orderId }));

    await orders.updateStatus(orderId, 'CONFIRMED');
    return { orderId, status: 'CONFIRMED' };
  } catch (err) {
    for (const undo of compensations.reverse()) {
      try { await undo(); } catch (e) { logger.error({ e, orderId }, 'compensation failed, needs retry/manual fix'); }
    }
    throw err;
  }
}
// Production: persist saga state (or use Temporal/Step Functions) so it survives a crash mid-way.

// 5. Outbox
// Unsafe: await db.insert(order); await broker.publish(event);
//   crash between the two → order saved, event lost (other services never know);
//   or publish succeeds but the transaction rolls back → event for an order that doesn't exist.
// Outbox: one transaction writes both
//   BEGIN;
//   INSERT INTO orders ...;
//   INSERT INTO outbox (id, topic, payload) VALUES ($1, 'order.created', $2);
//   COMMIT;
// A relay polls the outbox (SELECT ... FOR UPDATE SKIP LOCKED), publishes, and marks rows as sent
// (or Debezium streams the outbox table via CDC). Delivery is at-least-once → consumers must be idempotent.
```

**Evaluation Criteria:**
- Balanced monolith vs microservices view; knows the modular monolith and SOA/ESB
- Knows sync vs async trade-offs and resilience patterns (timeouts, retries, circuit breakers)
- Explains Saga (orchestration vs choreography) with compensations
- Explains Outbox and why dual writes are unsafe
- Idempotent consumers with dedup; DLQs
- Picks the right broker for the use case

---

*End of Section 8: Added — 2026-10-28*
