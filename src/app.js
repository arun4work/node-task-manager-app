const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

//create express application
const app = express();

/**
 * with middleware: new request -> run route handler
 * without middleware: new request -> run route handler
 * creating custom express middleware for site under maintenance
 */

// app.use((req, res, next) => {
//     console.log('Site is under maintainance.Please try after sometime!');
//     res.status(505).send('Site is under maintainance.Please try after sometime!');
// });

//express.json() setup is required to convert incoming JSON query string to javascript object to access through req.body
app.use(express.json());

//register routers
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
