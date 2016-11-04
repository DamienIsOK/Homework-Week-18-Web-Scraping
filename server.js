// mongodb://heroku_hm2zsx40:cj36muhcccf47p6n1ve65vi1kj@ds141697.mlab.com:41697/heroku_hm2zsx40

// Setup =====================================================

// Starting Express
var express = require('express');
var app = express();

// Dependencies
var request = require('request');
var cheerio = require('cheerio');
var exhb = require('express-handlebars');
var mongoose = require('mongoose')
var bp = require('body-parser');

// Change render engine
app.engine('handlebars', exhb({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
// Database config
var mongojs = require('mongojs');
// Create a new db names 'npr' and save it to a variable
var databaseUrl = 'npr';
// create a new collection named 'titles' and save it to a variable
var collections = ['titles'];

// Save my database as the db variable
var db = mongojs(databaseUrl, collections);

// Log any errors
db.on('error', function(err) {
	console.log('DB Error:', err);
});

var damien = [{
	firstName: 'Damien'
}, {
	lastName: 'Wright'
}];

// Routes =====================================================

// Display text at the main route
app.get('/test', function(req, res) {
	// res.send('Hello World');
	res.render('index', damien[0]);
});

// Get data from the db at the route /all
app.get('/all', function(req, res) {
	// find everything in the db. Initiate a callback function
	db.titles.find({}, function(err, found) {
		if(err) {
			console.log(err);
		} else {
			// if everything's cool, then write everything to the page
			res.json(found);
		}
	});
});

// Scrape data from one site and place it into the mongodb db
app.get('/scrape', function(req, res) {
	request('http://www.npr.org/', function(error, response, html) {
		// load the html body request into cheerio
		var $ = cheerio.load(html);
		// get each element with the title class
		$('.title').each(function(i, element) {
			// using jQuery, get the text of each title
			var title = $(element).text();
			// var link = $(element)children('a').attr('href');
			// If there is a title, then save it to the db
			if(title) {
				db.titles.save({
					title: title
				},
				function(err, saved) {
					if(err) {
						console.log(err);
					// write everything you saved to the db to the console	
					} else {
						console.log(saved);
					}
				});
			}
		});
	});
	// Write a message to the browser
	res.send('Scrape complete');
});
// Start listening at the port ========================================
app.listen(3000, function() {
  console.log('App running on port 3000!');
});