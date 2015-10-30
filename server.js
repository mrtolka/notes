



var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser')
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
	secret: 'angular_tutorial',
	resave: true,
    saveUninitialized: true
}));

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;

var db = new Db('tutor', new Server("localhost", 27017, {safe: true},
	{auto_reconnect: true}, {}));

		db.open(function(){
		console.log("mongo db is opened!");
		
		db.collection('notes', function(error, notes) {
			db.notes = notes;
		});

		db.collection('sections', function(error, sections) {
			db.sections = sections;
		});

		db.collection('users', function(error, users) {
			db.users = users;
		});
});

function setUser(req, query) {
	query.userName = req.session.userName || "demo";
	return query;
}

app.post("/login", function(req,res) {
	db.users.find(
		{userName:req.body.login, password:req.body.password})
		.toArray(function(err, items) {
			res.send(items.length>0);
		});
});

app.get("/logout", function(req, res) {
	req.session.userName = null;
	res.end();
});


app.get("/notes", function(req,res) {
	var query = setUser(req, req.query);
	db.notes.find(query).toArray(function(err, items) {
		res.send(items);
	});
});

app.post("/notes", function(req,res) {
	var note = setUser(req, req.body);
	db.notes.insert(note);
	res.end();
});

app.get("/sections", function(req,res) {
	var userName = req.session.userName || "demo";
	db.users.find({userName:userName}).toArray(function(err, items) {
		var user = items[0];
		console.log(user);
		res.send(user.sections || []);
	});
});

app.post("/sections/replace", function(req,res) {
	var userName = req.session.userName || "demo";
	db.users.update({userName:userName}, 
			{$set:{sections:req.body}}, 
	function() {
		res.end();
	});
});

app.get("/checkUser", function(req,res) {
	if (req.query.user.length>2) {
		res.send(true);
	} else {
		res.send(false);
	}
});

app.post("/users", function(req,res) {
	db.users.insert(req.body, function(resp) {
		req.session.userName = req.body.userName; 
		res.end();
	});
});

app.listen(3000);
