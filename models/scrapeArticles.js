// Model for Mongoose to use on Articles Pulled from web scrape and stored
var mongoose = require('mongoose');


var Schema = mongoose.Schema;

//create a new schema from constructor to create new article object
//the new article object shows how the data must look for mongoose to accept it
var rules = {
  title: {
    type: String,
    required: "String is Required",
    unique: true
  },
  summary: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    unique: true
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: "Message"
  }
} 


var scrapeArticlesSchema = new Schema (rules);

//Create model from the provided schema, use model method
//first argument is the name of the collection model is for
//Second argument make a copy of schema definitions
// Instances of these models represent documents which can be saved and retrieved
// Mongoose by default produces a collection name by passing the model name to the utils.toCollectionName method. This method pluralizes the name. Set this option if you need a different name for your collection.
var scrapeArticles = mongoose.model("scrapeArticles", scrapeArticlesSchema);

module.exports = scrapeArticles;