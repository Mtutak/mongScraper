// Model for Mongoose to use on Articles Pulled from web scrape and stored
var mongoose = require('mongoose');


var Schema = mongoose.Schema;

//create a new schema from constructor to create new article object
//the new article object shows how the data must look for mongoose to accept it
var rules = {
  title: {
    type: String,
    required: "String is Required"
  },
  summary: {
    type: String,
    trim: true
  },
  link: {
    type: String
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: "Message"
  }
} 


var articleSchema = new Schema (rules);

//Create model from the provided schema, use model method
//first argument is the name of the collection model is for
//Second argument make a copy of schema definitions
var Article = mongoose.model("Article", articleSchema);

module.exports = Article;

// mongoose.connect('mongodb://localhost/test');
// var db = mongoose.connection;

// var Cat = mongoose.model('Cat', { name: String });

// var kitty = new Cat({ name: 'Zildjian' });
// kitty.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('meow');
//   }
// });

//Each Schema maps to a collection and defines the documents within the collection
// var Schema = mongoose.Schema;

// var blogSchema = new Schema({
//   title:  String,
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// });

//Model of schema ....

// Construct Document from models

// Schema.Types.ObjectId,
// NOTE: the MongoDB _id was created automatically. 
// This id is specific for each doc in the collection.
// DbRef class a special class that lets you include a reference in a document pointing to another object