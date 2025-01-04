// This function calculates the sum of all numbers from 1 to n using an array and reduce method.
var sum_to_n_a = function(n) {
    return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
};

// This function calculates the sum of all numbers from 1 to n using the arithmetic series formula.
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

// This function calculates the sum of all numbers from 1 to n using recursion.
var sum_to_n_c = function(n) {
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1); // Fixed the function call to sum_to_n_c
};

// Test the functions
console.log(sum_to_n_a(5)); // 15
console.log(sum_to_n_b(5)); // 15
console.log(sum_to_n_c(5)); // 15


