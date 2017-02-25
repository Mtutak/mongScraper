// Dependencies:
var express = require("express");
var exphbs = require("express-handlebars");
// HTML FROM URL
var request = require("request");
// TRAVERSES DOM OF WEBPAGE
var cheerio = require("cheerio");
var bodyParser = require ("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//Require models modules
//used to send formated and validated data to  mongoDB collection fitting the schema
var Message = require("./models/message.js");
var Article = require("./models/article.js");

// Initialize Express
var app = express();
var PATH = process.env.PORT || 3000;

var Promise = require("bluebird");

mongoose.Promise = Promise;
//use morgan logger
app.use(logger("dev"));
//bodyParser to format data 
app.use(bodyParser.urlencoded({
  extended: false
}));
//connect to handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Set up a static folder (public) for our web app
app.use(express.static("public"));

//
// MONGOOSE CONNECTION WITH MONGODB DATABASE
//
mongoose.connect("mongodb://localhost/mongScraper");

var db = mongoose.connection;
//error with mongoose and connection
db.on("error", function (error){
  console.log("Mongoose Error: ", error);
});

//Once connected through mongoose
db.once("open", function() {
  console.log("Mongoose connection successful.");
});
var articles = [{
    title: "TEST",
    link: "http://test.com",
    summary: "Test Text Here"
}, {
    title: "cat",
    link: true,
    summary: 10
}];


app.get("/scrape", function (req, res) {

            // First, tell the console what server.js is doing
            console.log("\n***********************************\n" +
                        "Grabbing every thread name and link\n" +
                        "from New York Times News:" +
                        "\n***********************************\n");


            // Making a request call. The page's HTML is saved as the callback's third argument, html
            request("http://www.nytimes.com/pages/business/index.html", function(error, response, html) {

              // Load the HTML into cheerio and save it to a variable
              // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
              var $ = cheerio.load(html);


                      // Using cheerio, find each div.story 
                      // (i: iterator. element: the current element)
                      $("div.story").each(function(i, element) {
                          // storing data from webpage
                          var result = {};
                        var test = $(element).children('h3').text();
                        if (test) {
                          // Save the text of the element (this) h3 in a "title" variable
                          result.title = $(element).children('h3').text();

                          // In the currently selected element, look at its child's child elements (i.e., its a-tags),
                          // then save the values for any "href" attributes that the child elements may have
                          result.link = $(element).children('h3').children().attr("href");
                          

                          result.summary = $(element).children('p.summary').text();

                          console.log(result);
                            if (result.title && result.link && result.summary) { 
                                // Log the result once cheerio analyzes each of its selected elements
                                // console.log(result);
                                var scrapeArticle = new Article(result);
                                //save these results to mongodb
                                scrapeArticle.save({
                                      result
                                    },
                                    function(error, saved) {
                                      // If there's an error during this query
                                      if (error) {
                                        // Log the error
                                        console.log(error);
                                      }
                                      // Otherwise,
                                      else {
                                        // Log the saved data
                                        console.log(saved);
                                      }
                                  });
                            } else {
                              console.log("That ain't no article!");
                            }
                          }
                      });
              
              });
});//get scrape/
// res.render('index', {title: url, data: })

//
// Routes
// 1. At the root path, render default handlebars template
app.get("/", function(req, res) {
  res.render("index", articles);
});

// 2. At the "/all" path, display every entry in the article collection
app.get("/all", function(req, res) {
  // Query: In our database, go to the article collection, then "find" everything
  Article.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      // res.json(found);
      res.render("index", found);
    }
  });
});

// Get an article by the ObjectId generated by Mongoose
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db.
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

//Create a user message
app.post("/articles/:id", function(req, res) {
  // Create a new message and pass the req.body to the entry
  var userPost = new Message(req.body);

  // And save the new note the db
  userPost.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

// Set the app to listen on port 3000
app.listen(PATH, function() {
  console.log("App running on port" + PATH + "!");
});

//disconnect on sign out
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});