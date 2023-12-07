"use strict";

var mongoose = require('mongoose');

var bookmarkSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  bookName: {
    type: String,
    required: true
  }
});
var Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;