const express = require('express');
const Task = require('../model/task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

//Create new task for loggedIn user
router.post('/tasks', authMiddleware, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});

/** Read all tasks for a loggedIn user
 * /tasks?completed=[true/false]&limit=[number]&skip=[number]&sortBy=[sort field]:[asc/desc]
 * completed=true : fetch  all completed tasks
 * completed=false : fetch all not completed tasks
 * No completed query parameter || completed= : fetch all tasks
 * limit: fetch only limited record
 * skip: skip intial skipped records
 * sortField:asc/desc : will sort on the sortField and order based on asc/desc
 */
router.get('/tasks', authMiddleware, async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }
    try {
        //const tasks = await Task.find({owner: req.user._id}); //approach-1
        //await req.user.populate('tasks').execPopulate(); //approach-2
        await req.user
            .populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort,
                },
            })
            .execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
});

//Get a specific task for a loggedIn user
router.get('/tasks/:id', authMiddleware, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id: _id, owner: req.user._id});
        if (!task) {
            return res.status(404).send(task);
        }
        res.send(task);
    } catch (e) {
        res.status(500).send({error: e.message});
    }
});

//Update a specific task for a loggedIn user
router.patch('/tasks/:id', authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidFieldtoUpdate = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidFieldtoUpdate) {
        return res.status(400).send({error: 'Invalid updates!'});
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});

//delete a task for a loggedIn user
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
