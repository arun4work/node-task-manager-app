// //Goal is to create a promise chaining to
// 1. to load mongoose and task model
// 2. Remove a given task by id
// 3. get the total number of completed task after Deletion

require('../src/db/mongoose');
const Task = require('../src/model/task');

Task.findByIdAndDelete('610d4e53fd1a8352a02c5db9')
    .then((task) => {
        console.log(task);
        return Task.find({completed: true});
    })
    .then((tasks) => {
        console.log(tasks.length);
    })
    .catch((err) => {
        console.log(err);
    });
