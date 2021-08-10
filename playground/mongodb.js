//CRUD operation using Node and Mongo

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

//connection url and database name to connect to a database
const connectionURL = `mongodb://127.0.0.1:27017`;
const databaseName = `task-manager-db`;
// const id = new mongodb.ObjectId();
// console.log(id);

mongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        console.log('Unable to connect the data base');
    }
    const db = client.db(databaseName);
    //From here, start interacting with Database

    //Insert one document to Users collection
    //db.collection('Users').insertOne({name: 'Arun', age: 35});

    // Inesrt many documents to Task collection
    // db.collection('Tasks').insertMany([
    //     {_id: new mongodb.ObjectId(), description: 'Pay the bill', completed: false},
    //     {_id: new mongodb.ObjectId(), description: 'Go for training', completed: false},
    // ]);

    //find one matching document
    // db.collection('Tasks').findOne({_id: new mongodb.ObjectId('610933f54fa345f12d4926af')}, (error, task) => {
    //     console.log(task);
    // });

    //find all documents which are not completed yet
    // db.collection('Tasks')
    //     .find({completed: false})
    //     .toArray((error, tasks) => {
    //         console.log(tasks);
    //     });

    //update one document in a collection
    // db.collection('Users')
    //     .updateOne({_id: new mongodb.ObjectId('610930e334488b780c48bfff')}, {$inc: {age: -5}})
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((error) => {
    //         console.log('Error : ', error);
    //     });

    //update all Tasks to completed if not completed
    // db.collection('Tasks')
    //     .updateMany(
    //         {completed: false},
    //         {
    //             $set: {
    //                 completed: true,
    //             },
    //         }
    //     )
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    //delete one document from the User collection
    // db.collection('Users')
    //     .deleteOne({_id: new mongodb.ObjectId('610930e334488b780c48bfff')})
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    //delete all the documents which is completed
    // db.collection('Tasks')
    //     .deleteMany({completed: true})
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
});
