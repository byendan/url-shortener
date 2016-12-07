var express = require('express')
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

// My database url
var dburl = process.env.MONGOLAB_URI;      


var app = express()

app.get('/', function (req, res) {
    // Use connect method to connect to the Server
  MongoClient.connect(dburl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established successfully');

    // do some work here with the database.

    //Close connection
    db.close();
  }
});


  res.send('Hello World! You should send me an address to shorten, or maybe you already did?')
})

// Request with a shortened url will either find it or return error
app.get('/:short_url', function(req, res) {
    var inputUrl = req.params.short_url
    
})

// Someone wants to shorten a new url
app.post('/new/:url', function(req, res) {
    var inputUrl = req.params.url
    if(validUrl(inputUrl)) {
        
    }
})

app.listen((process.env.PORT || 8080), function () {
  console.log('We have a connection')
})

function validUrl(testUrl) {
    // first verify hypertext prefix
    var prefix = testUrl.split(":")[0]
    if(prefix != "http" || prefix != "https") {
        return false
    }
    // check it has a valid ending
    var suffix = testUrl.split(".")
    suffix = suffix[suffix.length - 1]
    
    // check valid port format
    if(suffix.split("").includes(":")) {
        if(suffix.split(":").length != 2) {
            return false
        }
        
        // Make sure a port is either 2 or 4 numbers long
        if(suffix.split(":")[1].length != 2 || suffix.split(":")[1].length != 4) {
            return false
        }
    }
    return true
}


