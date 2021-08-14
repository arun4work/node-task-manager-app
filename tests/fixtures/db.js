const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Arun Bahal',
    email: 'abahal@gmail.com',
    password: 'node123',
    tokens: [{token: jwt.sign({_id: userOneId.toString()}, process.env.JWT_SECRET, {expiresIn: '7 days'})}],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Arun Afixi',
    email: 'afixi.arun@gmail.com',
    password: 'node123',
    tokens: [{token: jwt.sign({_id: userTwoId.toString()}, process.env.JWT_SECRET, {expiresIn: '7 days'})}],
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Complete taseOne',
    owner: userOneId,
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Complete taskTwo',
    owner: userOneId,
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Complete taskThree',
    owner: userTwoId,
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    setupDatabase,
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
};
