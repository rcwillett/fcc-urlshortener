// server.js

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://Big_Willy:Fedora20@ds028310.mlab.com:28310/url_shortener';
var baseShortenerUrl = "https://fcc-urlshortenerservice.glitch.me/";

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:urlToShorten(*)", function (request, response) {
  var urlToShorten = request.params.urlToShorten;
  if(!/\D/.test(urlToShorten)){
    MongoClient.connect(dbUrl, function (err, db) {
      if (err) {
        sendError(err)
      }
      else {
    
        var shortenedUrlCollection = db.collection("shortened_urls");
        var urlShortenInt = parseInt(urlToShorten);
        shortenedUrls = shortenedUrlCollection.findOne({shortenedUrl : urlShortenInt});
        shortenedUrls.then(function(queryResult){
            if(queryResult){
              response.redirect(queryResult.url);
              db.close();
            }
            else{
              sendError(response, "shortenedUrl entry not found! Please try again.")
            }
        });
      }
    });
  }
  else if(/^https?:\/\/(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}$/.test(urlToShorten)){
    var result = {
      originalUrl: urlToShorten,
      shortenedUrl: ""
    };
    var shortenedUrls;
    MongoClient.connect(dbUrl, function (err, db) {
      if (err) {
        sendError(err)
      }
      else {    
        var shortenedUrlCollection = db.collection("shortened_urls");
        shortenedUrls = shortenedUrlCollection.findOne({url : urlToShorten});
        shortenedUrls.then(function(queryResult){
            handleEntryResults(db, shortenedUrlCollection, queryResult, response, result, urlToShorten);
        });
      }
    });
    
  }
  else{
    sendError(response, "Invalid Url");
  }
});

var listener = app.listen(process.env.PORT, function () {
  //console.log('Your app is listening on port ' + listener.address().port);
});

function handleEntryResults(db, shortenedUrlCollection, shortenedUrls, response, result, urlToShorten){
  if(!shortenedUrls){
    addEntryToDB(db, shortenedUrlCollection, response, result, urlToShorten);
  }
  else{
    result.shortenedUrl = baseShortenerUrl + shortenedUrls.shortenedUrl;
    response.send(result);
    db.close();
  }
}

function addEntryToDB(db, shortenedUrlCollection, response, result, urlToShorten, newId){
    shortenedUrlCollection.count({}).then(function(lastId){
    var newId = lastId++;
    shortenedUrlCollection.insert(new shortenedUrlEntry(urlToShorten, newId), function(err, docsInserted){
      if(!err){
        result.shortenedUrl = baseShortenerUrl + newId;
        response.send(result);
      }
      else{
        sendError(response, "Error Occured Adding Entry to DB");
      }
      db.close();
    });
    });
}


function sendError(response, errorText){
  response.send({Error: errorText});
}

function shortenedUrlEntry(url, id){
  this.url = url;
  this.shortenedUrl = id;
}