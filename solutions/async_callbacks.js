
/* leme do it again, a callback is the function that is passed as an argument to another function, to be executed later (usually after an async operation completes), it is fundamental to javascript async nature because js is single-threaded, and callbacks allow non-blocking I/O operations, other wise they will be blocking

Callback hell is the definition of a nested callbacks that became unreadable, and hard to mantain 

error-first  callback convention, ensures error handling by having the first parameter refering to the error, this belongs to the guard clause programm pattern */

// callbacks example
fs.readFile('file.txt', (err, data) => {
    console.log(data);
})

// or this would be the same like
fs.readFile('file.txt', myCallbackfunction)

function myCallbackfunction(err, data) {
    console.log(data);
}

// next we have the callback hell
getUser(userId, (err, user) => {
    getOrders(user.id, (err, orders) => {
        getOrderDetails(orders[0].id, (err, details) => {
            getShipping(details.id, (err, shipping) => {
                // pyramyd of doom
            })
        })
    })
})

// solution 1 to callback hell
getUser(userId)
.then(user => getOrders(user.id))
.then(orders => getOrderDetails(orders[0].id))
.then(details => getShipping(details.id))
.then(shipping => {
    // handle shipping
    })
    .catch(err => console.error(err))

// solution 2 to callback hell
// callback hell example using async/await
async function processOrder(userId) {
    try {
        const orders = await getOrders(userId);
        const orderDetails = await getOrderDetails(orders[0].id);
        const shipping = await getShipping(orderDetails.id)
    } catch (error) {
        throw new Error(error);        
    }
}

async function processOrder(userId) {
    try {
        const user = await getUser(userId);
        const orders = await getOrders(user.id);
        const details = await getOrderDetails(orders[0].id);
        const shipping = await getShipping(details.id);
        // handle shipping
        return shipping;
    } catch (err) {
        console.error(err);
    }
}


// solution 3 using async/await - modularization with named functions
// Solution 3 is over-engineered for this use case — one async function (Solution 2) is cleaner
async function handleShipping(detailsId) {
    const shipping = await getShipping(detailsId);
    // handle shipping
    return shipping;
}

async function handleDetails(orderId) {
    const details = await getOrderDetails(orderId);
    return handleShipping(details.id);
}

async function handleOrders(userId) {
    const orders = await getOrders(userId);
    return handleDetails(orders[0].id);
}

async function handleUser(userId) {
    const user = await getUser(userId);
    return handleOrders(user.id);
}

// Usage
handleUser(userId).catch(err => console.error(err));

// finally we have the error-first callback convention
function callback(err, result) {
    if (err) console.error(err);
    // rest of the code    
}
