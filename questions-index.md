# Interview Questions Index

# SECTION 1: JavaScript & TypeScript Fundamentals

## 1.1 ES6+ Features

### Question 1: Variable Declarations
**Question:** Explain the differences between `var`, `let`, and `const`. What is hoisting, and how does it affect each declaration type? How are function declarations hoisted compared to function expressions and arrow functions?
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


### Question 2: Destructuring & Spread/Rest Operators
**Question:** Explain destructuring assignment and the spread/rest operators. How do they differ, and when would you use each?
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


### Question 3: Template Literals & Tagged Templates
**Question:** What are template literals and tagged templates? Provide a practical use case for tagged templates.
**Code Challenge:**
```javascript
// Create a tagged template function that sanitizes HTML to prevent XSS
const userInput = '<script>alert("hacked")</script>';
const html = sanitize`<div>User said: ${userInput}</div>`;
// Should output: <div>User said: &lt;script&gt;alert("hacked")&lt;/script&gt;</div>
```


## 1.2 Arrays & Strings

### Question 4: Array Methods
**Question:** Explain the differences between `forEach()`, `map()`, `filter()`, `reduce()`, and `find()`. When would you use each one?
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


### Question 5: Array Manipulation
**Question:** What's the difference between mutating and non-mutating array methods? Give examples of each.
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


## 1.3 Object Manipulation

### Question 7: Object Methods & Iteration
**Question:** What are the different ways to iterate over object properties? Explain `Object.keys()`, `Object.values()`, `Object.entries()`, and `for...in`.
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


### Question 8: Object Descriptors & Immutability
**Question:** How can you make an object immutable in JavaScript? Explain `Object.freeze()`, `Object.seal()`, and property descriptors.
**Code Challenge:**
```javascript
// 1. Create a deep freeze function
// 2. Create an object with a read-only 'id' and hidden 'password' property
// 3. Create a getter/setter for a 'fullName' computed property
```


## 1.4 Classes & Prototypes

### Question 9: Classes & Inheritance
**Question:** Explain JavaScript classes, inheritance, and how they relate to prototypes. What's the difference between class syntax and prototypal inheritance? What are the four pillars of OOP (encapsulation, abstraction, inheritance, polymorphism) and how does each look in JavaScript?
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


### Question 10: Prototypes
**Question:** Explain the prototype chain. How does property lookup work? What's the difference between `__proto__` and `prototype`?
**Code Challenge:**
```javascript
// 1. Create object inheritance WITHOUT using class keyword
// 2. Demonstrate prototype chain lookup
// 3. Add a method to all arrays (monkey-patching)
// 4. Check if a property exists on object itself vs prototype
```


## 1.5 Closures & Scope

### Question 11: Closures
**Question:** What is a closure? How do closures work, and what are practical use cases?
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


### Question 12: Scope & Execution Context
**Question:** Explain lexical scope, execution context, and the call stack. What is the `this` keyword and how is it determined?
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


## 1.6 Promises & Async/Await

### Question 13: Promises Fundamentals
**Question:** Explain Promises. What are the three states? How do `.then()`, `.catch()`, and `.finally()` work?
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


### Question 14: Async/Await
**Question:** How does `async/await` work? What's the difference from `.then()`? Can you mix them?
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


### Question 15: Promise Static Methods
**Question:** Explain `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, and `Promise.any()`. When would you use each?
**Code Challenge:**
```javascript
// Implement:
// 1. Fetch from multiple APIs, fail if any fails (all or nothing)
// 2. Fetch from multiple APIs, get all results (successes and failures)
// 3. Fetch from multiple mirrors, use first successful response
// 4. Implement a timeout wrapper for any promise
// 5. Implement Promise.all polyfill
```


## 1.7 TypeScript Fundamentals

### Question 16: TypeScript Basics
**Question:** What are the benefits of TypeScript? Explain basic types, interfaces, and type aliases.
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


### Question 17: TypeScript Advanced Types
**Question:** Explain generics, utility types, and conditional types in TypeScript.
**Code Challenge:**
```typescript
// 1. Create a generic function that fetches and types API responses
// 2. Create a type that makes all nested properties optional (DeepPartial)
// 3. Create a type that extracts all function property names from an object type
// 4. Create a generic Result type for success/error handling
// 5. Use utility types to create DTO variations (Create, Update, Response)
```


### Question 18: TypeScript with Functions & Type Guards
**Question:** How do you type functions in TypeScript? What are type guards and how do you create custom ones?
**Code Challenge:**
```typescript
// 1. Create a function with multiple overload signatures for parsing input
// 2. Create type guards for a discriminated union of API responses
// 3. Create a type-safe event emitter with typed events
```


# SECTION 2: React Fundamentals

## 2.1 Components & JSX

### Question 19: Functional vs Class Components
**Question:** What are the differences between functional and class components in React? When would you use each?
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


### Question 20: Rendering Lists & Keys
**Question:** How do you render lists in React? Why are keys important, and what are the rules for using them?
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


## 2.2 State & Props

### Question 21: State Management Patterns
**Question:** Explain the difference between props and state. How do you lift state up, and when should you do it?
**Code Challenge:**
```jsx
// Create a temperature converter with two inputs (Celsius and Fahrenheit)
// When one input changes, the other should update automatically
// Use proper state lifting pattern
// Include validation (must be a number)
```


### Question 22: Controlled vs Uncontrolled Components
**Question:** What's the difference between controlled and uncontrolled components? When would you use each?
**Code Challenge:**
```jsx
// Create a form with:
// 1. Controlled text input with live character count (max 100 chars)
// 2. Controlled select dropdown
// 3. Uncontrolled file input
// 4. Submit handler that logs all values
// 5. Reset functionality
```


## 2.3 React Hooks

### Question 23: useState & useEffect
**Question:** Explain `useState` and `useEffect` hooks. What are the rules of hooks? What's the dependency array in useEffect?
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


### Question 24: useCallback, useMemo, useRef
**Question:** When should you use `useCallback`, `useMemo`, and `useRef`? What problems do they solve?
**Code Challenge:**
```jsx
// Create a component that:
// 1. Has an expensive filtered/sorted list
// 2. Passes stable callbacks to child components
// 3. Uses ref to focus an input
// 4. Tracks render count without causing re-renders
// 5. Child component should not re-render unnecessarily
```


## 2.4 Context API

### Question 25: Context API & State Management
**Question:** What is the Context API? When should you use it vs prop drilling vs external state management?
**Code Challenge:**
```jsx
// Create a theme and auth context system:
// 1. ThemeContext with light/dark toggle
// 2. AuthContext with user, login, logout
// 3. A component that uses both contexts
// 4. Custom hooks for consuming each context
// 5. Proper provider composition
```


## 2.5 React Router

### Question 26: Client-Side Routing
**Question:** How does React Router work? Explain nested routes, route parameters, and navigation guards.
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


## 2.6 Advanced Patterns

### Question 27: Custom Hooks
**Question:** What makes a good custom hook? What are the patterns for creating reusable hooks?
**Code Challenge:**
```jsx
// Create these custom hooks:
// 1. useLocalStorage - persist state to localStorage
// 2. useFetch - data fetching with loading/error states
// 3. useForm - form handling with validation
```


### Question 28: Error Boundaries & Performance
**Question:** What are Error Boundaries? How do you optimize React performance?
**Code Challenge:**
```jsx
// Create:
// 1. An Error Boundary component with fallback UI
// 2. A lazy-loaded component with Suspense
// 3. A virtualized list for 10,000 items
```


# SECTION 3: Node.js & Backend Fundamentals

## 3.1 Node.js Core Concepts

### Question 29: Event Loop & Asynchronous Programming
**Question:** Explain the Node.js event loop. How does Node.js handle asynchronous operations? What are the different phases of the event loop?
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


## 3.2 Core Modules & Streams

### Question 30: Streams & Buffers
**Question:** What are streams in Node.js? Explain the different types of streams and when to use them. What are buffers?
**Code Challenge:**
```javascript
// 1. Copy a large file using streams
// 2. Create a transform stream that converts text to uppercase
// 3. Compress a file using streams
// 4. Handle stream errors properly
// 5. Demonstrate backpressure handling
```


## 3.3 Express.js Server Setup

### Question 31: Express Server & Middleware
**Question:** How do you set up an Express server? What is middleware, and how does the middleware chain work?
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


## 3.4 RESTful API Design

### Question 32: REST Principles & Route Design
**Question:** What are REST principles? How do you design a RESTful API with proper HTTP methods, status codes, and resource naming?
**Code Challenge:**
```javascript
// Design a RESTful API for a blog system with:
// 1. CRUD operations for posts
// 2. Nested comments for posts
// 3. Proper status codes
// 4. Validation
// 5. Filtering and pagination
```


## 3.5 Authentication & Security

### Question 33: JWT Authentication
**Question:** How do you implement JWT authentication in Node.js? What are the security best practices?
**Code Challenge:**
```javascript
// Implement:
// 1. User registration with password hashing
// 2. Login endpoint with JWT generation
// 3. Protected route with JWT verification
// 4. Refresh token mechanism
// 5. Logout (token invalidation)
```


## 3.6 Error Handling & Validation

### Question 34: Comprehensive Error Handling
**Question:** How do you implement proper error handling in a Node.js application? What are best practices for error responses?
**Code Challenge:**
```javascript
// Create:
// 1. Custom error classes
// 2. Input validation middleware using Joi or custom validation
// 3. Centralized error handler
// 4. Async error wrapper
```


## 3.7 Environment & Configuration

### Question 35: Environment Variables & Configuration Management
**Question:** How do you manage environment-specific configuration in Node.js? What are the best practices for secrets and sensitive data?
**Code Challenge:**
```javascript
// Create:
// 1. Environment configuration system with validation
// 2. Different configs for different environments
// 3. Secrets management best practices
```


## 3.8 Package Management & Versioning

### Question 36: NPM & Semantic Versioning
**Question:** Explain semantic versioning (semver) in Node.js. How do `package.json` and `package-lock.json` work? What's the difference between `dependencies`, `devDependencies`, `peerDependencies` and `optionalDependencies`?
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


## 3.9 Testing in Node.js

### Question 37: Unit & Integration Testing
**Question:** How do you test Node.js applications? Explain unit tests, integration tests, and mocking.
**Code Challenge:**
```javascript
// Write tests for:
// 1. A utility function (unit test)
// 2. API endpoint (integration test)
// 3. Mock external API calls
// 4. Test error scenarios
```


# SECTION 4: Databases & Data Persistence

## 4.1 SQL vs NoSQL Fundamentals

### Question 38: Database Paradigm Selection
**Question:** What are the key differences between SQL and NoSQL databases? When would you choose one over the other? Explain ACID vs BASE properties.
**Code Challenge:**
```javascript
// Given this e-commerce scenario, design data models for both SQL and NoSQL:
// - Users with profiles
// - Products with categories
// - Orders with multiple items
// - Reviews for products
// Explain trade-offs of each approach
```


## 4.2 Schema Design & Data Modeling

### Question 39: Normalization vs Denormalization
**Question:** Explain database normalization (1NF, 2NF, 3NF). When should you denormalize data? How do you design schemas for optimal query performance?
**Code Challenge:**
```javascript
// Design schemas for a social media platform:
// 1. Users, Posts, Comments, Likes
// 2. Show normalized SQL design
// 3. Show denormalized NoSQL design
// 4. Explain when to update denormalized data
```


## 4.3 Indexing & Query Optimization

### Question 40: Database Indexing Strategies
**Question:** What are database indexes? How do they improve query performance? Explain different types of indexes and when to use them. What are the trade-offs?
**Code Challenge:**
```javascript
// Given these queries, design optimal indexes:
// 1. Find users by email
// 2. Find posts by user, ordered by date
// 3. Find products by category and price range
// 4. Full-text search on post content
// 5. Explain query plans and optimization
```


## 4.4 Complex Queries & Aggregations

### Question 41: Advanced Querying Techniques
**Question:** How do you write complex queries involving joins, subqueries, aggregations, and window functions? Explain MongoDB aggregation pipeline.
**Code Challenge:**
```javascript
// Write queries for:
// 1. Top 10 users by post count with total likes
// 2. Monthly revenue report with running total
// 3. Posts with more comments than average
// 4. Find users who never posted but commented
// 5. MongoDB aggregation equivalent
```


# SECTION 5: AWS Core Services & Deployment

## 5.1 AWS Lambda & Serverless

### Question 42: Lambda Functions & Event-Driven Architecture
**Question:** How do AWS Lambda functions work? Explain the execution model, cold starts, and best practices for serverless functions.
**Code Challenge:**
```javascript
// Create a Lambda function that:
// 1. Processes S3 file uploads
// 2. Handles API Gateway requests
// 3. Implements proper error handling
// 4. Uses AWS SDK v3
```


## 5.2 API Gateway

### Question 43: API Gateway Configuration
**Question:** How does AWS API Gateway work? Explain REST vs HTTP vs WebSocket APIs, and common integration patterns.
**Code Challenge:**
```javascript
// Configure API Gateway with:
// 1. Lambda integration
// 2. Custom authorizer
// 3. Request validation
// 4. CORS configuration
```


## 5.3 ECS/EKS Container Orchestration

### Question 44: Docker Containers on AWS
**Question:** What's the difference between ECS and EKS? When would you use each? Explain task definitions and services.
**Code Challenge:**
```yaml
# Create:
# 1. Dockerfile for Node.js app
# 2. ECS task definition
# 3. Service configuration
```


## 5.4 S3 Storage

### Question 45: S3 Best Practices
**Question:** How do you optimize S3 for performance, cost, and security? Explain storage classes and lifecycle policies.
**Code Challenge:**
```javascript
// Implement S3 operations:
// 1. Upload file with multipart
// 2. Generate presigned URL
// 3. List objects with pagination
```


## 5.5 CloudWatch & Monitoring

### Question 46: Observability with CloudWatch
**Question:** How do you monitor AWS applications? Explain CloudWatch Logs, Metrics, Alarms, and comparison with Datadog.
**Code Challenge:**
```javascript
// Implement:
// 1. Custom CloudWatch metrics
// 2. Structured logging
// 3. Error tracking with alarms
```


## 5.6 CI/CD Pipeline

### Question 47: Deployment Automation
**Question:** How do you set up a CI/CD pipeline for Node.js applications on AWS? Explain blue-green and canary deployments.
**Code Challenge:**
```yaml
# Create GitHub Actions workflow for:
# 1. Build and test
# 2. Deploy to Lambda
# 3. Run integration tests
```


## 5.7 Infrastructure as Code

### Question 48: IaC with CloudFormation/CDK/Terraform
**Question:** Compare AWS CloudFormation, CDK, and Terraform. When would you use each?
**Code Challenge:**
```typescript
// CDK example: Create Lambda + API Gateway + DynamoDB
```


## 5.8 Environment Management

### Question 49: Multi-Environment Setup
**Question:** How do you manage multiple environments (dev, staging, prod) in AWS? Explain account strategies and resource isolation.
**Code Challenge:**
```typescript
// CDK: Deploy same stack to multiple environments
```


## 5.9 Security & IAM

### Question 50: AWS Security Best Practices
**Question:** Explain AWS IAM roles, policies, and security best practices. How do you implement least privilege access?
**Code Challenge:**
```json
// Create IAM policy with least privilege for Lambda accessing DynamoDB and S3
```


## 5.10 Cost Optimization

### Question 51: AWS Cost Management
**Question:** How do you optimize AWS costs? Explain pricing models, cost monitoring, and optimization strategies.
**Code Challenge:**
```javascript
// Implement cost-aware resource management
```


# SECTION 6: AWS Advanced Strategies & Security

## 6.1 AWS Well-Architected Framework

### Question 52: Well-Architected Pillars & Best Practices
**Question:** Explain the five pillars of the AWS Well-Architected Framework. How do you apply these principles when designing a production system? Provide examples of trade-offs between pillars.
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


## 6.2 AWS Security Best Practices & Compliance

### Question 53: Advanced Security Strategies & Compliance
**Question:** Design a comprehensive security strategy for a financial services application on AWS. Cover identity management, data protection, network security, compliance requirements, and incident response. How do you implement defense-in-depth?
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

# SECTION 7: Databases — PostgreSQL, MySQL & Redis

## 7.1 Relational Engines

### Question 54: PostgreSQL vs MySQL
**Question:** Compare PostgreSQL and MySQL (InnoDB). How do they differ in MVCC, indexing options, JSON support, and replication? When would you pick each for a Node.js backend?
**Code Challenge:**
```javascript
// 1. Write an "upsert" for a users table (unique email) in both PostgreSQL and MySQL syntax
// 2. Query a JSON column (preferences.theme = 'dark') in both engines and index it
// 3. Return the inserted row id in both engines from Node.js (pg vs mysql2)
```

### Question 55: Transactions, Isolation Levels & Locking
**Question:** Explain transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) and the anomalies each prevents. What are the defaults in PostgreSQL and MySQL? Pessimistic vs optimistic locking?
**Code Challenge:**
```javascript
// Implement a money transfer between two accounts in Node.js (pg):
// 1. Wrap it in a transaction with proper rollback and client release
// 2. Prevent a race condition where two concurrent transfers overdraw the account
// 3. Avoid deadlocks when two transfers run in opposite directions (A→B and B→A)
// 4. Alternative: optimistic locking with a version column and retry
```

## 7.2 Redis

### Question 56: Redis Data Structures & Caching Patterns
**Question:** What is Redis and why is it fast? Explain its core data structures and when to use each. Compare cache-aside, write-through, and write-behind. How do you handle cache invalidation, stampedes, and eviction? Why is Redis a common session store, and how do you implement one?
**Code Challenge:**
```javascript
// Using ioredis or node-redis:
// 1. Cache-aside wrapper getOrSet(key, ttl, fetchFn) for a product lookup
// 2. Prevent a cache stampede when a hot key expires
// 3. Fixed-window rate limiter: max 100 requests per user per minute (INCR + EXPIRE)
// 4. Leaderboard: add scores and fetch the top 10 (sorted set)
// 5. Session store: create, read (with sliding expiration) and destroy a session
```

# SECTION 8: Added — 2026-10-28

## 8.1 JavaScript

### Question 57: Counting Vowels & Consonants
**Question:** Write a function that takes a string as its only argument and returns an object with the number of vowels and consonants. How do you handle case, accents, spaces, digits and punctuation? What's the complexity?
**Code Challenge:**
```javascript
// 1. count('gato') → { vowels: 2, consonants: 2 }
// 2. Make it case-insensitive and ignore spaces, digits and punctuation: count('Hola, Mundo 2024!')
// 3. Treat accented vowels as vowels: count('canción') → { vowels: 3, consonants: 4 }
// 4. Write a second version with reduce (or regex) and compare readability and complexity
```

### Question 58: Data Types, null vs undefined & Symbol
**Question:** What data types exist in JavaScript? Which are primitives and which are structural? What's the difference between `null` and `undefined`? What is `Symbol` used for?
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

### Question 59: Primitives vs References: Memory & Mutability
**Question:** How is memory managed for primitive values compared to objects/arrays (stack vs heap, copy by value vs by reference)? What is mutability, and why does it matter? Is JavaScript pass-by-value or pass-by-reference? How does garbage collection work?
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

### Question 60: Function Types, IIFE & call/apply/bind
**Question:** What kinds of functions exist in JavaScript (declarations, expressions, arrow, methods, constructors, async, generators)? What is an IIFE and why was it used? What do `call`, `apply` and `bind` do, and when would you use each?
**Code Challenge:**
```javascript
// 1. Write a counter module with an IIFE that exposes increment() and getCount() but hides the count
// 2. Borrow Array.prototype methods with call/apply on an array-like object ({ 0: 'a', 1: 'b', length: 2 })
// 3. Find the max of an array using Math.max with apply, then with spread
// 4. Fix the lost `this` in: setTimeout(user.greet, 100) using bind
// 5. Implement your own Function.prototype.myBind (with partial application)
```

### Question 61: Generators & Iterators
**Question:** What is a generator function? How does `yield` work, and how do generators relate to the iteration protocol? When would you use a generator in a real backend? What are async generators?
**Code Challenge:**
```javascript
// 1. Write an idGenerator() that yields 1, 2, 3, ... forever, and take the first 5 values
// 2. Write a range(start, end, step) generator usable in for...of
// 3. Write a lazy pipeline: take(filter(map(naturals(), x => x * 2), x => x % 3 === 0), 5)
// 4. Write an async generator that pages through an API (page 1, 2, ... until empty) and consume it with for await...of
```

## 8.2 Node.js

### Question 62: NPM Scripts, npx & Node Version Managers
**Question:** How do npm scripts work? When do you need `npm run` and when not (`npm start`, `npm test`)? What are `pre`/`post` scripts and lifecycle hooks? What is `npx` for? How do you force a transitive dependency version (`overrides`/`resolutions`)? What are nvm and `n`, and how do they differ?
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

### Question 63: EventEmitter
**Question:** What is the `EventEmitter` in Node.js? How do `on`, `once`, `emit`, `off` and `prependListener` work? Are listeners called synchronously or asynchronously? How are errors handled, and what is the max listeners warning?
**Code Challenge:**
```javascript
// 1. Create an OrderService class that extends EventEmitter and emits 'created' and 'paid' events
// 2. Register a one-time listener and a regular listener; show the order they run in
// 3. Handle the 'error' event correctly (what happens if nobody listens?)
// 4. Wait for an event with a timeout using events.once() and AbortSignal
// 5. Implement a minimal EventEmitter yourself (on, once, off, emit)
```

### Question 64: Core Modules & CommonJS vs ESM
**Question:** What are Node.js core modules, and which ones do you use most (fs, path, http, events, stream, crypto, os, util, url, child_process, worker_threads)? What are the differences between CommonJS and ECMAScript Modules (loading, syntax, `this`, `__dirname`, top-level await, interop)?
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

### Question 65: Child Processes, Cluster & Worker Threads
**Question:** Explain `spawn`, `exec`, `execFile` and `fork`. How does IPC work between parent and child? How do `cluster` and `worker_threads` differ, and when would you use each? What are C++ addons (N-API) for?
**Code Challenge:**
```javascript
// 1. Run `ls -la` with spawn and stream its output
// 2. Run a git command with execFile and explain why exec is dangerous with user input
// 3. fork a child process and exchange messages with it (IPC)
// 4. Move a CPU-heavy calculation (e.g. fib(40)) to a worker thread so the HTTP server stays responsive
// 5. Use cluster to run one HTTP server per CPU core and restart workers that crash
```

### Question 66: Debugging & Logging in Node.js
**Question:** How do you debug a Node.js application (`node --inspect`, `--inspect-brk`, Chrome DevTools, VS Code, ndb)? How do you debug a production issue? Which logging libraries do you use (winston, pino), and what makes good logging (levels, structured logs, correlation ids, redaction)?
**Code Challenge:**
```javascript
// 1. Show how to start the app with the inspector and stop on the first line
// 2. Create a pino (or winston) logger with levels set by env, JSON output in prod and pretty output in dev
// 3. Add a request-logging middleware that attaches a request id to every log line (AsyncLocalStorage)
// 4. Redact passwords and tokens from logs
```

### Question 67: HTTP Messages, Methods & Status Codes
**Question:** What are the parts of an HTTP request and of an HTTP response, and how do they differ? Explain the HTTP methods and which are safe and idempotent. Explain the status code classes (1xx–5xx) with the codes you use most.
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

### Question 68: Cookies, localStorage & Session vs Token Auth
**Question:** What is a JWT and what are cookies? How do cookies, localStorage and sessionStorage differ (size, sent with requests, XSS/CSRF exposure, lifetime)? Compare server-side sessions with JWT-based auth. Where should a token be stored in the browser?
**Code Challenge:**
```javascript
// 1. In Express, set an auth cookie with the right flags (HttpOnly, Secure, SameSite, maxAge, path)
// 2. Decode a JWT by hand (header.payload.signature) and explain why it isn't encrypted
// 3. Explain how you'd protect a cookie-based session from CSRF
// 4. Pick a storage option for: access token, refresh token, UI theme preference, shopping cart draft
```

## 8.3 Databases

### Question 69: Views, Stored Procedures & Triggers
**Question:** What are views, materialized views, stored procedures, functions and triggers? What are they good for, and what are the downsides of putting business logic in the database?
**Code Challenge:**
```sql
-- 1. Create a view of active users with their order count
-- 2. Create a materialized view for a monthly sales report and refresh it
-- 3. Write a stored procedure/function that transfers stock between warehouses in a transaction
-- 4. Write a trigger that keeps updated_at current and writes changes to an audit table
-- 5. Call the procedure from Node.js (pg)
```

### Question 70: ORM vs ODM
**Question:** What is an ORM and what is an ODM? Give examples (Prisma, TypeORM, Sequelize, Drizzle, Mongoose). What are the pros and cons compared with raw SQL or a query builder? What is the N+1 problem and how do you avoid it?
**Code Challenge:**
```javascript
// 1. Define a User has-many Post model with Sequelize or Prisma
// 2. Define the same with Mongoose (embedded vs referenced posts)
// 3. Show an N+1 query and fix it with eager loading / populate
// 4. Run a raw query from the ORM for a report the ORM can't express well
// 5. Run two writes in one transaction with the ORM
```

## 8.4 Docker & Kubernetes

### Question 71: Dockerfile vs Docker Compose
**Question:** What is the difference between a Dockerfile and Docker Compose? What are images, containers, layers and volumes? What are the best practices for a production Node.js Dockerfile?
**Code Challenge:**
```yaml
# 1. Write a multi-stage Dockerfile for a Node.js API (small image, non-root user, layer caching, .dockerignore)
# 2. Write a docker-compose.yml with the API, PostgreSQL and Redis:
#    - env vars, named volume for DB data, healthcheck, depends_on with condition
# 3. Explain the order of COPY package*.json and COPY . and why it matters
```

### Question 72: Kubernetes Core Objects
**Question:** What is Kubernetes and what problem does it solve? Explain Pods, Deployments, ReplicaSets, Services (ClusterIP, NodePort, LoadBalancer), Ingress, ConfigMaps, Secrets, liveness/readiness probes and the Horizontal Pod Autoscaler.
**Code Challenge:**
```yaml
# For the Node.js API from Q71, write:
# 1. A Deployment with 3 replicas, resource requests/limits, and liveness + readiness probes
# 2. A ConfigMap and a Secret, injected as environment variables
# 3. A ClusterIP Service and an Ingress exposing /api
# 4. An HPA that scales between 3 and 10 pods at 70% CPU
# 5. The kubectl commands to apply, check rollout status and roll back
```

## 8.5 CI/CD & Teamwork

### Question 73: Git: Merge vs Rebase
**Question:** What is the difference between `git merge` and `git rebase`? When do you use each, and what is the golden rule of rebasing? What are fast-forward and squash merges? How does Git (distributed) differ from SVN (centralized)?
**Code Challenge:**
```bash
# 1. Update your feature branch with the latest main, once with merge and once with rebase. Draw the history for each.
# 2. Clean up 4 messy commits into 1 before opening a PR
# 3. You rebased a branch that a teammate already pulled. What happens and how do you recover?
# 4. Resolve a conflict during a rebase and continue
# 5. Recover a commit you lost after a bad reset
```

### Question 74: Module Bundlers & Build Tools
**Question:** What is a module bundler (webpack, Rollup, esbuild, Vite) and what problems does it solve? Explain loaders/plugins, tree shaking, code splitting and source maps. What does Babel do? How do task runners (Grunt, Gulp) and preprocessors fit in, and do you need a bundler for a Node.js backend?
**Code Challenge:**
```javascript
// 1. Write a minimal webpack.config.js: entry, output, a babel-loader rule, a CSS loader rule, production mode
// 2. Configure Babel to target Node 20 and the last 2 browser versions
// 3. Explain why this import breaks tree shaking and fix it:
const _ = require('lodash');
_.debounce(fn, 300);
// 4. Bundle a Node.js Lambda handler with esbuild into a single file
```

## 8.6 JavaScript (syllabus)

### Question 75: Functional Programming in JS
**Question:** What is functional programming? Explain pure functions, side effects, immutability, first-class and higher-order functions, currying, partial application, composition and recursion. What are the trade-offs of recursion in JavaScript?
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

## 8.7 Node.js (syllabus)

### Question 76: Process Management & Graceful Shutdown
**Question:** How do you keep a Node.js process running in production (PM2, Forever, systemd, Docker restart policies, Kubernetes)? What does PM2 cluster mode do? How do you implement graceful shutdown? How should you handle `uncaughtException` and `unhandledRejection`?
**Code Challenge:**
```javascript
// 1. Write an ecosystem.config.js for PM2: cluster mode on all cores, max memory restart, env per environment
// 2. Implement graceful shutdown on SIGTERM/SIGINT:
//    stop accepting connections, finish in-flight requests, close DB/Redis, exit with a timeout fallback
// 3. Add uncaughtException / unhandledRejection handlers. What should they do and not do?
// 4. Make the readiness check fail during shutdown so the load balancer stops sending traffic
```

### Question 77: Event Loop Monitoring & Profiling
**Question:** How do you detect that the event loop is blocked? What is event loop lag/delay and utilization? Which tools do you use (perf_hooks, Clinic.js Doctor/Flame/Bubbleprof, N|Solid, `--prof`, heap snapshots)? How do you find a memory leak?
**Code Challenge:**
```javascript
// 1. Measure event loop delay with perf_hooks.monitorEventLoopDelay and log p50/p99 every 10s
// 2. Write an endpoint that blocks the loop (sync crypto or a big JSON.parse) and show how you'd find it in a flame graph
// 3. Return 503 when event loop lag is above a threshold (load shedding)
// 4. Take two heap snapshots and explain how to compare them to find a leak
```

### Question 78: Node.js Framework Landscape
**Question:** Compare Express, Fastify, Koa, Hapi, NestJS, Restify and Sails. Where do Next.js and Nuxt fit, and what about serverless frameworks (Serverless Framework, SST)? How do you choose a framework for a new backend service?
**Code Challenge:**
```javascript
// Implement GET /users/:id with JSON schema validation of the param in:
// 1. Express
// 2. Fastify (with a route schema)
// 3. NestJS (controller + service + DTO with class-validator)
// Then: explain middleware in Express vs Koa (onion model) vs Fastify hooks
```

### Question 79: HTTP Optimization, CORS & HTTP/2
**Question:** How do you optimize HTTP APIs? Explain HTTP caching (Cache-Control, ETag, Last-Modified, 304), compression (gzip, Brotli), and CORS (simple vs preflight requests, credentials). What does HTTP/2 change compared with HTTP/1.1, and what is HTTP/3?
**Code Challenge:**
```javascript
// In Express:
// 1. Configure CORS for two allowed origins with credentials, without using '*'
// 2. Serve GET /products with Cache-Control and an ETag, and return 304 when it matches
// 3. Enable compression only for responses above 1 KB
// 4. Explain why a browser sends OPTIONS before your PUT request
```

## 8.8 Databases (syllabus)

### Question 80: ETL & Data Warehousing
**Question:** What is the difference between OLTP and OLAP? What is a data warehouse, and how does it differ from a data lake? Explain ETL vs ELT, star and snowflake schemas, and fact vs dimension tables.
**Code Challenge:**
```javascript
// 1. Design a star schema for e-commerce sales (fact_sales + dimensions)
// 2. Write a Node.js ETL job that streams orders from PostgreSQL, transforms them, and loads them in batches into the warehouse
// 3. Make the job incremental (only rows changed since the last run) and idempotent
```

## 8.9 Docker & Kubernetes (syllabus)

### Question 81: Deployment Strategies & Load Balancing
**Question:** What are the options for deploying a Node.js app: a server behind Nginx, containers (Docker/Kubernetes), or serverless (FaaS)? What are the trade-offs? What does a reverse proxy do? Explain load-balancing algorithms, health checks, sticky sessions, and L4 vs L7 load balancers.
**Code Challenge:**
```nginx
# 1. Write an Nginx config that reverse-proxies to 3 Node.js instances (least_conn), sets X-Forwarded-* headers, and serves static files
# 2. Add TLS termination and gzip
# 3. Add WebSocket support
# 4. Explain what changes in the app when it sits behind a proxy (trust proxy, real client IP)
```

## 8.10 CI/CD & Teamwork (syllabus)

### Question 82: Code Quality Gates & Code Review
**Question:** How do you enforce code quality in a team? Explain ESLint vs Prettier, pre-commit hooks (husky, lint-staged), coverage configuration and thresholds, and quality gates in CI. What do you look for in a code review, and how do you give good review feedback?
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

### Question 83: Agile & Scrum
**Question:** What are the Agile values? Explain Scrum roles, events (sprint planning, daily, review, retrospective) and artifacts (product backlog, sprint backlog, increment). What is the Definition of Done? How does Kanban differ from Scrum? Which tools have you used (Jira, Linear, etc.)?

## 8.11 Design Patterns & Architecture

### Question 84: Creational Patterns & Dependency Injection
**Question:** Explain the Factory, Abstract Factory and Singleton patterns. How does Node's module cache act as a singleton, and what are the downsides of singletons? What is dependency injection, and how does it help testing (manual DI vs containers like NestJS, awilix, inversify)?
**Code Challenge:**
```javascript
// 1. Write a NotificationFactory that creates Email, SMS or Push senders from a type string
// 2. Write an Abstract Factory that creates a matching { queue, storage } pair for 'aws' or 'local'
// 3. Write a DB connection singleton two ways (module cache and class) and explain the testing problem
// 4. Refactor a UserService that does `new PostgresRepo()` internally to receive its repo by constructor injection, then test it with a fake
```

### Question 85: Structural Patterns
**Question:** Explain the Adapter, Decorator, Facade, Proxy and Module patterns. What is a mixin, and how does it compare to inheritance? Give a real Node.js example of each.
**Code Challenge:**
```javascript
// 1. Adapter: wrap a legacy callback-based payment SDK so it fits a promise-based PaymentGateway interface
// 2. Decorator: add retry and logging to any async function without changing it (withRetry(withLogging(fn)))
// 3. Facade: an OrderFacade.placeOrder() that hides inventory, payment and email services
// 4. Proxy: a cache proxy around a slow repository using JS Proxy
// 5. Mixin: add Serializable and Timestamped behavior to a class
```

### Question 86: Behavioral Patterns
**Question:** Explain the Strategy, Observer, Mediator and Chain of Responsibility patterns. Where do you see them in Node.js (EventEmitter, Express middleware)? When does a pattern become over-engineering?
**Code Challenge:**
```javascript
// 1. Strategy: replace a big switch on shippingType with pluggable pricing strategies
// 2. Observer: an order system where inventory, email and analytics subscribe to 'order:placed'
// 3. Chain of Responsibility: an approval chain (manager < $1k, director < $10k, CEO otherwise)
// 4. Mediator: a chat room that routes messages between users without users knowing each other
```

### Question 87: Reactive Programming with RxJS
**Question:** What is reactive programming? Explain Observables, Observers, Subscriptions and Subjects, and how they compare to Promises and EventEmitter. What are hot vs cold observables? Explain the common operators (map, filter, debounceTime, switchMap, mergeMap, concatMap, retry). Where does React fit in the reactive model?
**Code Challenge:**
```javascript
// 1. Create an observable from an EventEmitter and from a Promise
// 2. Search-as-you-type: debounce input 300ms, ignore duplicates, cancel the previous request (switchMap)
// 3. Poll an endpoint every 5s, retry failed calls with backoff, stop after 10 tries
// 4. Explain the difference between switchMap, mergeMap and concatMap with an example
```

### Question 88: MVC, Layered & Flux Architectures
**Question:** Explain MVC and how it maps to a Node.js API (routes/controllers, services, repositories/models). What is layered/clean architecture? What is Flux, why did it appear (unidirectional data flow), and how does it relate to Redux?
**Code Challenge:**
```javascript
// 1. Refactor a route handler that validates, queries the DB and formats the response into controller → service → repository
// 2. Show the folder structure for the refactored feature
// 3. Implement a minimal Flux store: dispatch(action) → reducer → subscribers notified
```

### Question 89: Microservices, SOA & Messaging
**Question:** Compare a monolith, a modular monolith, SOA and microservices. What problems do microservices introduce (data consistency, distributed transactions, observability)? Explain synchronous (REST/gRPC) vs asynchronous (queues, pub/sub) communication, the Saga and Outbox patterns, and idempotent consumers. When would you use RabbitMQ, Kafka, SQS/SNS or Redis Streams?
**Code Challenge:**
```javascript
// 1. Split an e-commerce monolith into services and draw which talk sync vs async
// 2. Publish an 'order.created' event and consume it in an inventory service (any broker)
// 3. Make the consumer idempotent so a redelivered message isn't processed twice
// 4. Implement an orchestrated saga for order → payment → inventory with compensation on failure
// 5. Explain the outbox pattern and why "write to DB, then publish" is unsafe
```
