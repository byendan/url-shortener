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
    
    MongoClient.connect(dburl, function(err, db) {
        var inputUrl = req.params.short_url
        console.log("the input url was: " + inputUrl)

        if(err) throw err 
        var collection = db.collection('urls')
        var dbQuery = {"short": parseInt(inputUrl)}
        console.log(JSON.stringify(dbQuery))
        collection.findOne(dbQuery, function(err, addressObject) {
            if (err) throw err 
            
            console.log("I got this from the db: " + addressObject.original)
            var redirectUrl = addressObject.original
            console.log("Trying to redirect you to " + redirectUrl)
            db.close()
            res.redirect(redirectUrl);
            
        })
    })
})


// Someone wants to shorten a new url
app.get('/new/*', function(req, res) {
    var fullUrl = req.originalUrl.split("/")
    console.log(fullUrl[2] + '//' + fullUrl[4])
    var inputUrl = fullUrl[2] + '//' + fullUrl[4]
    if(validUrl(inputUrl)) {
        var shortenedUrl = convertUrl(inputUrl)
        MongoClient.connect(dburl, function(err, db) {
            if(err) throw err
            var collection = db.collection('urls')
            collection.insertOne({"short": shortenedUrl, "original": inputUrl}, function(err, result) {
                if(err) throw err 
                res.send(JSON.stringify({"Original_url": inputUrl, "Shortened_url": shortenedUrl}))
                db.close()
            })
        })
    } else {
        res.send("Invalid url was provided")
    }
})

app.listen((process.env.PORT || 8080), function () {
  console.log('We have a connection')
})

function validUrl(testUrl) {
    // first verify hypertext prefix
    var prefix = testUrl.split(":")[0]
    if(prefix != "http" && prefix != "https") {
        return false
    }
    // check it has a valid ending
    var suffix = testUrl.split(".")
    suffix = suffix[suffix.length - 1]
    
    // check valid port format
    if(suffix.indexOf(":") > -1) {
        if(suffix.split(":").length != 2) {
            return false
        }
        
        // Make sure a port is either 2 or 4 numbers long
        if(suffix.split(":")[1].length != 2 && suffix.split(":")[1].length != 4) {
            return false
        }
    }
    return true
}

function convertUrl(original) {
    var fullHash = require('crypto').createHash('md5').update(original).digest("hex")
    var hashDec = Math.floor(parseInt(fullHash, 16) / Math.pow(10, 32) )
    return hashDec
}

