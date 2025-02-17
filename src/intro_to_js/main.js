console.log('Hello, World!');
console.log('Welcome to CMPSC 421')

// single line comment

/*
multi-line comment
 */

// control structures
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}

// what are we working with this semester?
console.log("------------");
console.log("Data Types");

// "typeof" -> returns the type of the variable
// console.log(typeof 42); // number
// console.log(typeof 3.14); // number
console.log(`${42}, ${typeof 42}`); // number
console.log(`${3.13}, ${typeof 3.13}`); // number
console.log(typeof "ABC")   // string
console.log(typeof {name: 'foo'})   // object
console.log(typeof function () {
    return 1;
})  // function
console.log(typeof true)   // boolean
let myFunc = function (x) {
    return x + 1;
}
let res = myFunc(4);    // 5
console.log(typeof myFunc)  // function
console.log(typeof myFunc(3))   // number

// lambdas
const myFunc1 = function foo(x) {
    return x * 2;
}
const myFunc2 = (x) => x * 2;
const myFunc3 = (x) => {
    return x * 2;
}

//  make some types
let firstName;
console.log(firstName)  // undefined
console.log(typeof firstName) // undefined
firstName = "John";
console.log(firstName)  // John
console.log(typeof firstName) // string
firstName = null;
console.log(firstName)  // null
console.log(typeof firstName) // object

// object representation (not recommended)
let answer = new Number(42);
let fullName = new String("Foo Bar")
let response = new Boolean(true)
console.log(typeof answer)  //object
console.log(typeof fullName) //object
console.log(typeof response) //object
answer = parseInt("42");
console.log(typeof answer)  // number

// arithmetic ops
console.log("------------")
let value1 = 16 + 4;
console.log(typeof value1, value1)  // number 20
value1 = 16 + 4 + "Zoo"
console.log(typeof value1, value1)  // string, 20zoo

/*
    relational operators (8 of them)
 */
console.log("-------------")
console.log(5 === "5")  // false
console.log(5 == "5")   // true
console.log("E" == 5)   // false
console.log("5e0" == 5e0)   // true
console.log("5e0" === 5e0)   // false
console.log("5" == function() {
    return 5;
})  // false
// let myFuncThatRet5 = () => 5;
let myFuncThatRet5 = function() {
    return 5;
}
console.log("5" == myFuncThatRet5());   // true
console.log("5" === myFuncThatRet5());   // false

let r1 = "5" + "5"; // 55
let r2 = "5" + myFuncThatRet5();    // 55
console.log(r1 == r2)   //true
console.log(r1 === r2)  //true
console.log(r1 == 55);  //true
console.log(r1 === 55);  //false









