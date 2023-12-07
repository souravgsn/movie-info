"use strict";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var searchText = document.querySelector("#searchText").value;
    getMovies(searchText);
  });
  document.querySelector("#navBar").addEventListener("click", function (e) {
    if (e.target.tagName === 'A' && e.target.textContent === 'Logout') {
      logoutUser();
    }
  });
}); // Get function

function get(url) {
  return fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    return data;
  })["catch"](function (error) {
    console.log(error);
  });
}

function getMovies(searchText) {
  //make request to api using axios
  // Make a request for a user with a given ID
  get("https://api.themoviedb.org/3/search/movie?api_key=98325a9d3ed3ec225e41ccc4d360c817&language=en-US&query=" + searchText).then(function (response) {
    var movies = response.results; //   console.log(movies);

    var output = "";
    movies.forEach(function (movie) {
      output += "\n          <div class=\"col-md-3\">\n            <div class=\"well text-center\">\n              <img src=\"https://image.tmdb.org/t/p/w500".concat(movie.poster_path, "\">\n              <h5>").concat(movie.title, "</h5>\n              <a onclick=\"movieSelected('").concat(movie.id, "')\" class=\"btn btn-primary\" >Movie Details</a>\n            </div>\n          </div>\n        ");
    });
    document.querySelector("#movies").innerHTML = output;
  })["catch"](function (error) {
    console.log(error);
  });
}

function movieSelected(id) {
  $.post("/getMovieId", {
    data: id,
    name: "movie"
  }, function (data, status) {
    console.log(data);
  });
  window.location = "movie.html?movieId=" + id;
  return false;
}

function getMovie() {
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var movieId = urlParams.get("movieId"); // Make a request for a user with a given ID

  get("https://api.themoviedb.org/3/movie/" + movieId + "?api_key=98325a9d3ed3ec225e41ccc4d360c817").then(function (response) {
    var movie = response;
    console.log(movie);
    var output = "\n        <div class=\"row\">\n          <div class=\"col-md-4\">\n            <img src=\"https://image.tmdb.org/t/p/w500".concat(movie.poster_path, "\" class=\"thumbnail\">\n          </div>\n          <div class=\"col-md-8\">\n            <h2>").concat(movie.title, "</h2>\n            <ul class=\"list-group\">\n              <li class=\"list-group-item\"><strong>Genre:</strong> ").concat(movie.genres[0].name, ", ").concat(movie.genres[1].name, "</li>\n              <li class=\"list-group-item\"><strong>Released:</strong> ").concat(movie.release_date, "</li>\n              <li class=\"list-group-item\"><strong>Rated:</strong> ").concat(movie.vote_average, "</li>\n              <li class=\"list-group-item\"><strong>Runtime:</strong> ").concat(movie.runtime, " min.</li>\n              <li class=\"list-group-item\"><strong>Production Companies:</strong> ").concat(movie.production_companies[0].name, " min.</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"well\">\n            <h3>Plot</h3>\n            ").concat(movie.overview, "\n            <hr>\n            <a href=\"http://imdb.com/title/").concat(movie.imdb_id, "\" target=\"_blank\" class=\"btn btn-primary\">View IMDB</a>\n            <a href=\"/\" class=\"btn btn-default\">Go Back To Search</a>\n\t\t\t<button class=\"btn btn-primary\" id= \"bookmarkButton\" onclick=\"bookmarkMovie('").concat(movie.id, "')\">Bookmark</button>\n\t\t\t\n          </div>\n        </div>\n    ");
    document.querySelector("#movie").innerHTML = output;
  })["catch"](function (error) {
    console.log(error);
  });
}

function bookmarkMovie(movieTitle) {
  $.post("/bookmark", {
    id: movieTitle
  }, function (data, status) {
    console.log(data);
  });

  try {
    // Assuming this is where you make the API request and handle the bookmark logic
    // ... (Your bookmark logic here)
    // Change the button color after a successful bookmark
    bookmarkButton.style.backgroundColor = "green";
    bookmarkButton.innerHTML = "Bookmarked";
  } catch (error) {
    console.error(error);
    alert("An error occurred");
  }
}

function logoutUser() {
  // Make an HTTP request to log out the user
  fetch('/logout', {
    method: 'POST'
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log('Logout successful:', data); // Redirect to the login page after successful logout

    window.location.href = '/login';
  })["catch"](function (error) {
    console.error('Error during logout:', error);
  });
}