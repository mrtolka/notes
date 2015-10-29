/**
 * Created by dsk6 on 27.10.2015.
 */

var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
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
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;

var db = new Db('tutor',
    new Server("localhost", 27017, {safe: true},
        {auto_reconnect: true}, {}));

db.open(function(){

    console.log("mongo db is opened :)");

    db.collection('users', function(error, users) {
        db.users = users;
    });

    db.collection('notes', function(error, notes) {
        db.notes = notes;
    });

    db.collection('sections', function(error, sections) {
        db.sections = sections;
    });
});


app.get("/notes", function(req, res) {
   db.notes.find(req.query).toArray(function(err, items) {
       res.send(items);
   });
});


app.post("/notes", function(req, res) {
    var currentdate = new Date();
    var currentNote = req.body;
    //currentNote.date = currentdate.getDate() + "." + (currentdate.getMonth()+1) + "." + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes();
    currentNote.date = currentdate;
    db.notes.insert(currentNote);
    res.end();
});


app.delete("/notes", function(req,res) {
    var id = new ObjectID(req.query.id);
    db.notes.remove({_id: id}, function(err) {
        if (err) {
            console.log(err);
            res.send("Shit Happens...");
        } else {
            res.send("Ok!");
        }
    })
});


app.get("/sections", function(req,res) {
    db.sections.find(req.query).toArray(function(err, items) {
        res.send(items);
    });
});


app.post("sections/replace", function(req,resp) {
    if (req.body.length==0) {resp.end()}
    db.sections.remove({}, function(err,res) {
        if (err) console.log(err);
        db.sections.insert(req.body, function(err, res) {
            if (err) console.log("err after insert: ", err);
            resp.end();
        });
    });
});


//*********************** Users **********************

app.get("/checkUser", function(req,res) {
    res.send(req.query.user.length > 2);
});

app.post("/users", function(req,res) {
    db.users.insert(req.body, function(resp) {
        req.session.userName = req.body.userName;
        res.end();
    });
});


//app.get("/notes", function(req,res) {
//    var notes = [
//        {text: "Note #1"},
//        {text: "Note #2"},
//        {text: "Note #3"}
//    ];
//    res.send(notes);
//});

//app.get("/notes", function(req,res) {
//    res.send(req.session.notes||[]);
//});


//app.post("/notes", function(req, res) {
//    if (!req.session.notes) {
//        req.session.notes = [];
//        req.session.last_note_id = 0;
//    }
//    var note = req.body;
//    note.id = req.session.last_note_id;
//    req.session.last_note_id++;
//    req.session.notes.push(note);
//    res.end();
//});

//app.get("/notes", function(req,res) {
//
//    if (!req.session.idCounter) {
//        req.session.idCounter = 0;
//    }
//
//    fs.readFile("notes.json", function(err, result) {
//        if (result) {
//            result = ""+result;
//            result = result.substring(0, result.length - 1);
//            result = "["+result+"]";
//            result = result.split("\n").join(",");
//            res.send(result);
//        } else {
//            res.end();
//        }
//    });
//});
//
//app.post("/notes", function(req, res) {
//    if (!req.session.idCounter) {
//        req.session.idCounter = 0;
//    }
//    var note = req.body;
//    note.id = req.session.idCounter;
//    req.session.idCounter++;
//    var noteText = JSON.stringify(note)+"\n";
//    fs.appendFile("notes.json", noteText, function() {
//        res.end();
//    });
//});


//app.delete("/notes", function(req,res) {
//
//    var id = req.query.id;
//    var notes = req.session.notes||[];
//    var updatedNotesList = [];
//
//    for (var i=0;i<notes.length;i++) {
//        if (notes[i].id != id) {
//            notes[i].id = newid;
//            newid++;
//            updatedNotesList.push(notes[i]);
//        }
//    }
//    //req.session.last_note_id = newid;
//    req.session.notes = updatedNotesList;
//    res.end();
//});


//-----------------------------------------------------
app.listen(3000);
