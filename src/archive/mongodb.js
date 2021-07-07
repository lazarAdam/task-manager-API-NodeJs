const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connection = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()

console.log(id.id)
console.log(id.getTimestamp())
console.log(id.toHexString().length)

// connect to Mongodb local server
MongoClient.connect(
    connection,
    {useUnifiedTopology: true, useNewUrlParser: true},
    (error, client) => {
        if (error) {
            return console.log('Unable to connect to database!')
        }

        console.log('connected')

        //use client.db with the name of database which will either create a database if it does not exist or
        // use the existing one
        const db = client.db(databaseName)

        // use the db to insert to a collection with the name users and insert some data
        // also provide our own created id using  mongodb ObjectID
        // the collection is created if none existing in db

        // callback functions are used here as an argument to insertOne


        // db.collection('users').insertOne({
        //     _id:id,
        //     name: 'lazar',
        //     age: 28
        //
        // },(error,result)=>{
        //     if (error){
        //         return console.log('Unable to insert')
        //     }
        //
        //     console.log(result.ops)
        // })


        // db.collection('users').insertMany(
        //     [
        //         {
        //             name:'jen',
        //             age:28
        //         },
        //         {
        //             name:'max',
        //             age:30
        //         }
        //     ],
        //     (error,result)=>{
        //
        //         if (error){
        //             return console.log('unable to insert')
        //         }
        //
        //         console.log(result)
        //
        //     }
        // )

        // db.collection('tasks').insertMany(
        //     [
        //         {desc:'shopping',completed:false},
        //         {desc:'gym',completed:true},
        //         {desc:'study',completed:true}
        //     ],
        //     (error,res)=>{
        //         if (error){
        //             return  console.log('unable to insert!')
        //         }
        //
        //         console.log(res.ops)
        //     }
        // )

        // db.collection('users').findOne({_id: new ObjectID("60db9ec06a794b46f0db5387")},(error,res)=>{
        //
        //     if (error){
        //         return console.log('unable to fetch')
        //     }
        //
        //     console.log(res)
        // })
        //
        // db.collection('users').find({age:28}).toArray((error,users)=>{
        //     console.log(users)
        // })
        //
        // db.collection('users').find({age:28}).count((error,count)=>{
        //     console.log(count)
        // })
        //
        //
        //
        // db.collection('tasks').findOne({_id: new ObjectID("60dba0f062168a46784443f7")},
        //     (error, res) => {
        //
        //     if (error) {
        //         return console.log('unable to fetch')
        //     }
        //
        //     console.log(res)
        // })

        //
        // db.collection('tasks').find({completed:false}).toArray((error,users)=>{
        //     console.log(users)
        // })


        // promise with then and catch  as replacement for callbacks are being used in the examples down bellow

        // db.collection('users').updateOne({
        //         _id: new ObjectID("60db96c38807714bcc95aa5f")
        //     },
        //     {
        //         // $set: {
        //         //     name: 'debake'
        //         // }
        //         $inc: {
        //             age: 1
        //         }
        //     }
        // ).then((res) => {
        //
        //     console.log(res)
        // }).catch((error) => {
        //     console.log(error)
        // })
        //
        //
        // db.collection('tasks').updateMany(
        //     {
        //         completed: false
        //     },
        //     {
        //         $set: {
        //             completed: true
        //         }
        //     }
        // ).then((res) => {
        //
        //     console.log(res.modifiedCount)
        // }).catch((error) => {
        //     console.log(error)
        // })

        db.collection('users').deleteMany({
            age: 30
        }).then(res => {

            console.log(res)

        }).catch(error => {
            console.log(error)
        })
    }
)
