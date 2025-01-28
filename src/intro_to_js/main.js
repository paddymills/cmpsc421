console.log('Hello World');
console.log('Welcome to CMPSC 421')

// single line

/*
multi line
*/

// control structures
for (let i = 0; i < 5; i++) {
	console.log(i);
}

let val = 16 + 4 + "Zoo"
console.log(typeof val, val);
console.log(42 == "42");
console.log(42 === "42");

// ---- Arrays ----
let values = [1, 3.14, "top", () => console.log('Hello')];

let nums = [2, 4, 6, 8, 10];
console.log(nums);
nums.forEach((num, i) => console.log(`${i} -> ${num}`));
console.log("squared:", nums.map((num) => num ** 2));
console.log("multiples of 4", nums.filter((num) => num % 4 == 0));
console.log("sum", nums.reduce((acc, num) => acc + num, 0));

let ages = [17, 19, 21, 25, 30];
console.log("all over 21", ages.every((age) => age >= 21));
console.log("any over 21", ages.some((age) => age >= 21));