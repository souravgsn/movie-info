const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const path = require('path')
var userIsLoggedIn = false;
var nameofuser = null;
// const Bookmark = require('./models/bookmark'); 
// const expuser;
app.use(express.static(path.join(path.resolve(), 'public')));
const mongoURI = "mongodb://0.0.0.0:27017/tempdb";



// Use the express-session middleware
app.use(session({
  secret: 'admin', // Change this to a secret key for session encryption
  resave: false,
  saveUninitialized: true
}));


// Connect to MongoDB


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//movie schema

const movieSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model("movie", movieSchema);

//bookmarkschema

const bookmarkSchema = new mongoose.Schema({

	username: {
    type: String,
    required: true,
  },

  movieId: {
    type: String,
    required: true,
  },

  movieName : {
	type : String,
	required : true,
  },

});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);





app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes


app.get("/", (req, res) => {
	if(userIsLoggedIn){
		console.log("user is logged in");
		const name = req.session.username;
		res.render('index',{userIsLoggedIn , username : name});
	}else{
		res.render("index",{userIsLoggedIn , username : null});
	}
});

app.post("/", async (req, res) => {
    // var mn = req.body;
	console.log(req.body);
});

app.get("/send", (req, res) => {
    res.render("send");
});


//signup page


app.get("/signup", (req, res) => {
    if(!userIsLoggedIn){
		res.render('signup',{userIsLoggedIn});
	}
    else{
		res.render('/',{userIsLoggedIn , username : name});
	}
});

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();
		// alert("sign up successful")
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.send("Error creating user");
    }
});


//login page


app.get("/login", (req, res) => {
	if(!userIsLoggedIn){
		res.render('login',{userIsLoggedIn});
	}
    else{
		res.render('/',{userIsLoggedIn , username : name});
	}
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
			userIsLoggedIn = true;
			req.session.username = username; // Replace with the actual username
 		 	res.redirect('/'); // Redirect to the home page or another page
        } else {
            res.send("Invalid login credentials");
        }
    } catch (err) {
        console.error(err);
        res.send("Error during login");
    }
});


app.post("/getMovieId", (req, res) => {
	
	const id = req.body.data;
	console.log("the id of the movie is " + id);

}) 


//bookmark.js

app.get('/bookmarks', async (req, res) => {
  // Check if the user is logged in (replace with actual implementation)
//   const userIsLoggedIn = /* Check if user is logged in */ true;

  if (userIsLoggedIn) {
    // Fetch user's bookmarks from the database (replace with actual implementation)
	const name = req.session.username;
	const userBookmarks = await Bookmark.find({ "username" : name });
	console.log(userBookmarks);
	
    res.render('bookmarks', { userIsLoggedIn, userBookmarks , username : name });

  } else {
    res.render('bookmarks', { userIsLoggedIn });
  }
});

app.post('/bookmark', async (req, res) => {
  try {
    const movieId = req.body.id;
    const username = req.session.username;

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({ username, movieId });

    if (existingBookmark) {
      console.log('Bookmark already exists:', existingBookmark);
      return res.status(409).json({ error: 'Bookmark already exists' });
    }

    // Make an asynchronous API request to get movie details
    const movieData = await get(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "?api_key=98325a9d3ed3ec225e41ccc4d360c817"
    );

    const movieName = movieData.title;
    console.log(movieName);

    // Create a new bookmark using the Bookmark schema
    const newBookmark = new Bookmark({ username, movieId, movieName });

    // Save the bookmark to the database
    await newBookmark.save();

    console.log('Bookmark added:', newBookmark);
    res.status(201).json(newBookmark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

  
});


async function get(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

app.post('/logout', (req, res) => {
  // Clear the session to log out the user
  userIsLoggedIn = false;
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ message: 'Error during logout' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});

app.delete('/bookmark/:id', async (req, res) => {
  try {
    const username = req.session.username;
    const movieId = req.params.id;

    // Find and remove the bookmark for the user and movieId
    const deletedBookmark = await Bookmark.findOneAndDelete({ username, movieId });

    if (!deletedBookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    console.log('Bookmark deleted:', deletedBookmark);
    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

