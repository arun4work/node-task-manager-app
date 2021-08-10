/*promise chaining is a concept of chain multiple async tasks in specified order.
This is great when one async task has to be performed after another
Promise chaining occurs when the then callback method returns a new promise, 
this allows you to chain on another then call which will run when the second promise is fulfilled.
*/

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b);
        }, 2000);
    });
};

add(1, 2)
    .then((result) => {
        return add(result, 4);
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
