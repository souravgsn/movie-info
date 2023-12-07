const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({

	username: {
    type: String,
    required: true,
  },

  bookId: {
    type: String,
    required: true,
  },

  bookName : {
	type : String,
	required : true,
  },

});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;	
