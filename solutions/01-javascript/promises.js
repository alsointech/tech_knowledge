/* the states of a promise are pending, fullfilled and rejected.

Promise.all() handle multiple promises and waits until all of them are fullfilled, if one is rejected, immedidtely rejects with that error
Promise.race() handle multiple promises but it returns the first one that is fullfilled or rejected 
Promise.allSettled() will return all promises no matter if they are fullfilled or rejected
Promise.any() handle also mulriple promises but  returns the first fullfilled promise otherwise an agregateerror is thrown with saying all promises rejected */

const userIds = [1, 2, 3, 4, 5];

async function fetchAllUsers(userIds) {
    try {
        const promises = userIds.map(id => fetchUser(id));

        const users = await Promise.allSettled(promises);

        const successfulUsers = users
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value)

        const failedUsers = users
            .filter(result => result.status === 'rejected')
            .map(result => result.value)

        return { successfulUsers, failedUsers };

    } catch (error) {
        throw new Error(error);

    }
}

//  when the scenario belongs to a bussines case where all data must be present, or the entire operation should fail, I would use Promise.all() instead of Promise.allSettled() for example:

async function fetchAllData(userIds) {
    try {
        const users = await fetchUsers(userIds);

        const historicalData = await Promise.all(
            (users.map(user => fetchHistoricalData(user.id))));

        return { historicalData };

    } catch (error) {
        throw new Error(error);
    }
}


/* 
What does an async function always return, even if you don't explicitly return a Promise?
What happens if you await a non-Promise value?
Code Challenge: Refactor this code to run requests in parallel instead of sequential:
*/
async function getData() {
    try {
        const [user, posts, comments] = await Promise.all([
            fetchUser(1),
            fetchPosts(1),
            fetchComments(1)
        ])
        return { user, posts, comments }
    } catch (error) {
        console.error(error);
    }
}

(async function() {
    console.log('hello ' + await mockFunction());
})();

async function mockFunction() {
    return 'world'
}
