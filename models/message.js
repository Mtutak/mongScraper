// Model for Mongoose to use on Articles Pulled from web scrape and stored
var mongoose = require('mongoose');


var Schema = mongoose.Schema;

//create a new schema from constructor to create new message object
//the new message object shows how the data must look for mongoose to accept it
var rules = {
  message: {
    type: String,
    trim: true
  },
  articleId: {
    type: Number,
    unique: true,
    required: true
  },
  dateWritten: {
  type: Date,
  default: Date.now
    }
} 


var messageSchema = new Schema (rules);

//Create model from the provided schema, use model method
//first argument is the name of the collection model is for
//Second argument make a copy of schema definitions
var Message = mongoose.model("Message", messageSchema);

module.exports = Message;