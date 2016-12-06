var express = require('express')
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

//(Focus on This Variable)
var url = process.env.MONGOLAB_URI;      
//(Focus on This Variable)

var app = express()

app.get('/', function (req, res) {
    // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established successfully');

    // do some work here with the database.

    //Close connection
    db.close();
  }
});
  res.send('Hello World!')
})

app.listen((process.env.PORT || 8080), function () {
  console.log('We have a connection')
})


