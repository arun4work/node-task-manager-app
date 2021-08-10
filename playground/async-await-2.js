require('../src/db/mongoose');
const Task = require('../src/model/task');

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
        throw new Error('No document matching with id');
    }
    const count = await Task.countDocuments({completed: true});
    return count;
};

deleteTaskAndCount('610e875233db8463680574c1')
    .then((count) => {
        console.log(count);
    })
    .catch((err) => {
        console.log(err);
    });
