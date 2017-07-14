// server.js

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://Big_Willy:Fedora20@ds028310.mlab.com:28310/url_shortener';   

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:urlToShorten", function (request, response) {
  var urlToShorten = request.params.urlToShorten;
  var entryResult = checkIfEntryExists(urlToShorten);
  var result = {
    originalUrl: urlToShorten,
    shortenedUrl: ""
  };
  if(!entryResult){
    addEntryToDB();
  }
  else{
    result.shortenedUrl = entryResult;
  }
  response.send(result);
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


function checkIfEntryExists(urlToShorten){
MongoClient.connect(dbUrl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  }
  else {
    console.log('Connection established to', dbUrl);
    
    var shortenedUrlCollection = db.getCollection("shortened_urls");
    var shortenedUrls = shortenedUrlCollection.find({url: urlToShorten});
    
    db.close();
    
    return shortenedUrls;
  }
});
}

function addEntryToDB(){
  
}

function getMongoDbData(){

}

function shortenedUrlEntry(id, url){
  this.id = id;
  this.url = url;
}