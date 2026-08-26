console.log('1'); // sync

setTimeout(() => console.log('2'), 0); // macro

Promise.resolve().then(() => console.log('3')); //micro 

process.nextTick(() => console.log('4')); // micro*

console.log('5'); // sync

/* 
What is the output order?
Explain the difference between: callback queue, microtask queue, and process.nextTick()
Why does setTimeout(..., 0) not execute immediately?


Responses:
output: 1, 5, 4, 3, 2

callback queue, is the queue responsible for macro tasks, linke timeouts, I/O operations, and is the one that has lower priority, exexcutes after all microtasks are done

microtask queue, has a higher priority. Executes immediately after current script, before any macrotasks.

process.nextTick() (nodejs only), Highest priority. Executes before microtasks and macrotasks.

conclusion: event loop priority order:

Call Stack (synchronous code)
process.nextTick() queue (Node.js only)
Microtask Queue (Promises, queueMicrotask)
Macrotask/Callback Queue (setTimeout, setInterval, I/O)
question 4: setTimeout(..., 0) is placed in the macrotask queue, which only runs after the current synchronous code and all microtasks complete no matter if the time is set to 0 seconds. */