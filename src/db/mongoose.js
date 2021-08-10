const mongoose = require('mongoose');
//connect database
mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
