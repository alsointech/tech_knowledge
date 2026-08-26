console.log(a); // will output undefined
console.log(b); // will output a reference error, let is not in the global scope yet
var a = 1;
let b = 2;

for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
} // this will output: 3, 3, 3 this is hoisted and the increment of the variable occurs sincronously

for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 100);
} // this will output: 0, 1, 2 this log refers to each invocation of the variable so this is the right way


/**
 * @description teorical response (in chat)
 * 
 * var, is function scoped, hoisted and initialized as undefined, can be redeclared.
 * let, is block scoped, hoisted, but not initialized (remains in TDZ), cannot be redeclares, can be reassigned.
 * const, is block scoped, hoisted, but no initialized (TDZ), can not be redeclared and can not be reassigned for primitive values, but array/objects elements or properties can be mutated
*/

/**
 * @description hoisting explanation #1
 * @output reference error "x is not defined"
 */
x = 5;
console.log(x);

/**
 * @description hoisting explanation #1 
 * @output 5 
 */
y = 5;
console.log(y);
var y;

/**
 * @description hoisting explanation #1
 * @output reference error "z is not defined"
 */
z = 5;
console.log(z);
function name() {
    var z;
}
