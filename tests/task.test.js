const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {userOne, userOneId, setupDatabase, taskOne, taskTwo, taskThree} = require('./fixtures/db');

/** beforeEach is called before each test case is run,
 * setupDatabase is wiping out the DB and inserting few dummy
 * user and task documents to User and Task collection
 */
beforeEach(() => {
    return setupDatabase();
});

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'My  test task',
        })
        .expect(201);

    const task = await Task.findById(response.body._id);

    //Assertion of new task saved in DB successfully
    expect(task).not.toBeNull();

    //Assertion of completed field is false by default
    expect(task.completed).toEqual(false);
});

test('Should fetch all of your own tasks', async () => {
    const response = await request(app).get('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200);

    //Assertion of number of task by userOne is 2
    expect(response.body.length).toEqual(2);
});

test('Should fetch one of your own task', async () => {
    const response = await request(app).get(`/tasks/${taskOne._id}`).set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200);

    //Assertion of task fetched successfully
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
});

test('Should not fetch other users task', async () => {
    const response = await request(app).get(`/tasks/${taskThree._id}`).set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(404);

    //Assertion of fetched task is empty
    expect(response.body).toEqual({});
});

test('Should update one of your own task', async () => {
    const response = await request(app).patch(`/tasks/${taskOne._id}`).set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({completed: true}).expect(200);

    //Assertion of value updated correctly in DB
    const task = await Task.findById(taskOne._id);
    expect(task.completed).toEqual(true);
});

test('Should not udpate other users task', async () => {
    const response = await request(app).patch(`/tasks/${taskThree._id}`).set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({completed: true}).expect(404);

    //Assertion of task is not updated
    const task = await Task.findById(taskThree._id);
    expect(task.completed).not.toEqual(true);
});

test('Should delete one of your own task', async () => {
    const response = await request(app).delete(`/tasks/${taskTwo._id}`).set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200);

    //Assertion of task is deleted succesfully from DB
    const task = await Task.findById(response.body._id);
    expect(task).toBeNull();
});

test('Should not delete other users task', async () => {
    const response = await request(app).delete(`/tasks/${taskThree._id}`).set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(404);

    //Assertion of task not deleted from DB
    const task = Task.findById(taskThree._id);
    expect(task).not.toBeNull();
});

/** Other task api test ideas
 * Should not create task with invalid description/complete
 * Should not update task with invalid description/complete
 * Should fetch only completed tasks
 * Should fetch only incomplete tasks
 * Should sort tasks by description/completed/createdAt/updatedAt
 * Should fetch page wise tasks
 */
