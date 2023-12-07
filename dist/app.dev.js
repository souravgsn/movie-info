"use strict";

var express = require("express");

var session = require('express-session');

var mongoose = require("mongoose");

var bodyParser = require("body-parser");

var app = express();
var port = 3000;

var path = require('path');

var userIsLoggedIn = false;
var nameofuser = null; // const Bookmark = require('./models/bookmark'); 
// const expuser;

app.use(express["static"](path.join(path.resolve(), 'public')));
var mongoURI = "mongodb://0.0.0.0:27017/tempdb"; // Use the express-session middleware

app.use(session({
  secret: 'admin',
  // Change this to a secret key for session encryption
  resave: false,
  saveUninitialized: true
})); // Connect to MongoDB

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //movie schema

var movieSchema = new mongoose.Schema({
  username: String,
  password: String
});
var User = mongoose.model("movie", movieSchema); //bookmarkschema

var bookmarkSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  movieId: {
    type: String,
    required: true
  },
  movieName: {
    type: String,
    required: true
  }
});
var Bookmark = mongoose.model('Bookmark', bookmarkSchema);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express["static"]("public")); // Routes

app.get("/", function (req, res) {
  if (userIsLoggedIn) {
    console.log("user is logged in");
    var _name = req.session.username;
    res.render('index', {
      userIsLoggedIn: userIsLoggedIn,
      username: _name
    });
  } else {
    res.render("index", {
      userIsLoggedIn: userIsLoggedIn,
      username: null
    });
  }
});
app.post("/", function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // var mn = req.body;
          console.log(req.body);

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.get("/send", function (req, res) {
  res.render("send");
}); //signup page

app.get("/signup", function (req, res) {
  if (!userIsLoggedIn) {
    res.render('signup', {
      userIsLoggedIn: userIsLoggedIn
    });
  } else {
    res.render('/', {
      userIsLoggedIn: userIsLoggedIn,
      username: name
    });
  }
});
app.post("/signup", function _callee2(req, res) {
  var _req$body, username, password, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password;
          _context2.prev = 1;
          user = new User({
            username: username,
            password: password
          });
          _context2.next = 5;
          return regeneratorRuntime.awrap(user.save());

        case 5:
          // alert("sign up successful")
          res.redirect("/login");
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          console.error(_context2.t0);
          res.send("Error creating user");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); //login page

app.get("/login", function (req, res) {
  if (!userIsLoggedIn) {
    res.render('login', {
      userIsLoggedIn: userIsLoggedIn
    });
  } else {
    res.render('/', {
      userIsLoggedIn: userIsLoggedIn,
      username: name
    });
  }
});
app.post("/login", function _callee3(req, res) {
  var _req$body2, username, password, user;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            username: username,
            password: password
          }));

        case 4:
          user = _context3.sent;

          if (user) {
            userIsLoggedIn = true;
            req.session.username = username; // Replace with the actual username

            res.redirect('/'); // Redirect to the home page or another page
          } else {
            res.send("Invalid login credentials");
          }

          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          console.error(_context3.t0);
          res.send("Error during login");

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
app.post("/getMovieId", function (req, res) {
  var id = req.body.data;
  console.log("the id of the movie is " + id);
}); //bookmark.js

app.get('/bookmarks', function _callee4(req, res) {
  var _name2, userBookmarks;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!userIsLoggedIn) {
            _context4.next = 9;
            break;
          }

          // Fetch user's bookmarks from the database (replace with actual implementation)
          _name2 = req.session.username;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Bookmark.find({
            "username": _name2
          }));

        case 4:
          userBookmarks = _context4.sent;
          console.log(userBookmarks);
          res.render('bookmarks', {
            userIsLoggedIn: userIsLoggedIn,
            userBookmarks: userBookmarks,
            username: _name2
          });
          _context4.next = 10;
          break;

        case 9:
          res.render('bookmarks', {
            userIsLoggedIn: userIsLoggedIn
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
});
app.post('/bookmark', function _callee5(req, res) {
  var movieId, username, existingBookmark, movieData, movieName, newBookmark;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          movieId = req.body.id;
          username = req.session.username; // Check if the bookmark already exists

          _context5.next = 5;
          return regeneratorRuntime.awrap(Bookmark.findOne({
            username: username,
            movieId: movieId
          }));

        case 5:
          existingBookmark = _context5.sent;

          if (!existingBookmark) {
            _context5.next = 9;
            break;
          }

          console.log('Bookmark already exists:', existingBookmark);
          return _context5.abrupt("return", res.status(409).json({
            error: 'Bookmark already exists'
          }));

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(get("https://api.themoviedb.org/3/movie/" + movieId + "?api_key=98325a9d3ed3ec225e41ccc4d360c817"));

        case 11:
          movieData = _context5.sent;
          movieName = movieData.title;
          console.log(movieName); // Create a new bookmark using the Bookmark schema

          newBookmark = new Bookmark({
            username: username,
            movieId: movieId,
            movieName: movieName
          }); // Save the bookmark to the database

          _context5.next = 17;
          return regeneratorRuntime.awrap(newBookmark.save());

        case 17:
          console.log('Bookmark added:', newBookmark);
          res.status(201).json(newBookmark);
          _context5.next = 25;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 21]]);
});

function get(url) {
  var response, data;
  return regeneratorRuntime.async(function get$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(fetch(url));

        case 3:
          response = _context6.sent;

          if (response.ok) {
            _context6.next = 6;
            break;
          }

          throw new Error('Network response was not ok');

        case 6:
          _context6.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context6.sent;
          return _context6.abrupt("return", data);

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          throw _context6.t0;

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

app.post('/logout', function (req, res) {
  // Clear the session to log out the user
  userIsLoggedIn = false;
  req.session.destroy(function (err) {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({
        message: 'Error during logout'
      });
    } else {
      res.json({
        message: 'Logout successful'
      });
    }
  });
});
app["delete"]('/bookmark/:id', function _callee6(req, res) {
  var username, movieId, deletedBookmark;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          username = req.session.username;
          movieId = req.params.id; // Find and remove the bookmark for the user and movieId

          _context7.next = 5;
          return regeneratorRuntime.awrap(Bookmark.findOneAndDelete({
            username: username,
            movieId: movieId
          }));

        case 5:
          deletedBookmark = _context7.sent;

          if (deletedBookmark) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'Bookmark not found'
          }));

        case 8:
          console.log('Bookmark deleted:', deletedBookmark);
          res.status(200).json({
            message: 'Bookmark deleted successfully'
          });
          _context7.next = 16;
          break;

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});