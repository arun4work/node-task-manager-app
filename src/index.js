const app = require('./app');

//define port
const port = process.env.PORT;

//setup for express app to run the server with given port. Once server is up and running, handler will be executed.
app.listen(port, () => {
    console.log('Server is up and running on port:' + port);
});
