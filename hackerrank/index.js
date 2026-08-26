/* function sockMerchant(n, ar) {

    let foundedSocks = [];

    // Write your code here
    ar.forEach(element => {
        // a funciton to remove duplicates

        removeDuplicates(ar);
        console.log(element);
    })

    return 1
} */

function removeDuplicates(arr) {

    let singleItems = [];

    for (let i = 0; i < arr.length; i++) {

        // skips if item is not a number
        if (typeof (arr[i]) !== "number") {
            continue;
        } else {
            if (singleItems.length === 0) {
                singleItems.push(arr[i]);
            } else {
                let flag = 0;
                for (let j = 0; j < singleItems.length; j++) {
                    const element = singleItems[j];
                    if (element === arr[i] || (isNaN(arr[i]) && isNaN(element))) {
                        flag = 0;
                        break
                    } else {
                        flag = 1;
                    }
                }
                if (flag == 1) {
                    singleItems.push(arr[i])
                }
            }
        }
    }
    return singleItems;
}

const arr = [10, NaN, NaN, 10, 10, 30, 50, 10, NaN];
const num = arr.length;

console.log("single array is: " + removeDuplicates(arr));
// console.log(sockMerchant(num, arr));
