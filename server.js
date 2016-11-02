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

// Database config
var mongojs = require('mongojs');
var databaseUrl = 'npr';
var collections = ['titles'];

// Save my database as the db variable
var db = mongojs(databaseUrl, collections);

// Log any errors
db.on('error', function(err) {
	console.log('DB Error:', err);
});

// Routes =====================================================

// Display hello world at the main route
app.get('/', function(req, res) {
	res.send('Hello World');
});

// Get data fromthe DB
app.get('/all', function(req, res) {
	db.titles.find({}, function(err, found) {
		if(err) {
			console.log(err);
		} else {
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
			var title = $(element).text();

			if(title) {
				db.titles.save({
					title: title
				},
				function(err, saved) {
					if(err) {
						console.log(err);
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

app.listen(3000, function() {
  console.log('App running on port 3000!');
});