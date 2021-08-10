const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

//create express application
const app = express();

//define port
const port = process.env.PORT;

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

//setup for express app to run the server with given port. Once server is up and running, handler will be executed.
app.listen(port, () => {
    console.log('Server is up and running on port:' + port);
});
