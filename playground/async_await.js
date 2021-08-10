/**Async and await proive an improved syntax to work with promises. Using this,
 * you will be able to write complex asynchronous code that looks like syncronous code.
 * await operator can be used inside a async function. async keyword is added before
 * befor the function defination to make it async function.
 * The await operator allows you to work with promises in a way that looks like synchronous code.
 * If the promise is fulfilled, the fulfilled value can be accessed as the return value from the function
 * If the promise is rejected, it would be as though the function threw an error. await will pause the function
 * execution until the promise is either fulfilled or rejected.
 *
 */

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b);
            //reject('There is error occurred');
        }, 2000);
    });
};

const doWork = async () => {
    const sum1 = await add(1, 2);
    const sum2 = await add(sum1, 3);
    return sum2;
};
doWork()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });
