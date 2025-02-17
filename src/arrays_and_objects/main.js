console.log('lol')

// arrays
let values = [1, 3.14, "tom", function () {
    console.log("function works")
    return "foo"
}];
for (let i = 0; i < values.length; i++) {
    const item = values[i];
    console.log(`${i} -> ${item}`)

    // call the function?
    if (typeof item === 'function') {
        console.log(item())
    }
}

// difference between '' and ""
let s1 = 'my string on \n multiple lines'
let s2 = "another string \n on multiple lines"
console.log(s1)
console.log(s2)

// escape it
let s3 = "another string \\n on multiple lines"
console.log(s3)

/*
    objects in javascript
 */
let empty = {};
let person = {
    'firstName': 'Travis',
    'lastName': 'Kelce',
    'fullName': function () {
        // return `${this.firstName} ${this.lastName}`;
        return this.firstName + ' ' + this.lastName;
    }
}
console.log(typeof person) // object
console.log(typeof person.firstName)    // string
// this also works!
console.log(typeof person['lastName'])  // "associative arrays"
console.log(person.fullName())  // t kelce

/*
    arrays
 */
console.log('------------------------')
let myData = [2, 4, 6, 8, 10]

//  array object
//  "forEach" -> apply a function to each element in the array
myData.forEach(function (value) {
    console.log(value)
})
myData.forEach(function (value, index) {
    console.log(`${index} -> ${value}`)
})
myData.forEach((value, index) => console.log(`${index} -> ${value}`));

//  "map" -> apply a function to each element in the array and return a new array
const myDataDoubled = myData.map((value) => value * 2);
console.log(myDataDoubled)  // [4, 8, 12, 16, 20]
console.log(typeof myDataDoubled)  // object

//  "filter" -> apply a function to each element in the array and return a new array with only the elements that pass the test
let newData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let evenData = newData.filter((value) => value % 2 === 0);
let oddData = newData.filter((value) => value % 2 !== 0);
console.log(oddData)  // [1, 3, 5, 7, 9]
console.log(evenData)  // [2, 4, 6, 8, 10]
evenData.push(12);
console.log(evenData)  // [2, 4, 6, 8, 10, 12]
evenData.unshift(-1)
console.log(evenData)  // [-1, 2, 4, 6, 8, 10, 12]

// "reduce" -> apply a function to each element in the array and return a single value
let myData2 = [13, 45, 55, 61, 69];
//  LEFT TO RIGHT
let sum = myData2.reduce((accumulator, value) => accumulator + value, 0);
console.log(sum)  // 243
let myData3 = [10, 20, 30, 40, 50];
let res = myData3.reduce(function(acc, currentValue) {
    console.log(`adding ${currentValue} to acc ${acc}`)
    return acc + currentValue;
}, 0)
// right to left
res = myData3.reduceRight(function(acc, currentValue) {
    console.log(`adding ${currentValue} to acc ${acc}`)
    return acc + currentValue;
}, 0)

// every/some
//  every -> all elements have to match a condition
//  some -> at least 1 has to match a condition

// every -> all elements have to match a condition
// some -> at least 1 has to match a condition
let ages = [17, 21, 18, 19]
let allOver21 = ages.every((val) => val >= 21) // false
console.log(allOver21)  // false
let anyOddAges = ages.some((val) => val % 2 !== 0) // true
console.log(anyOddAges)  // true







