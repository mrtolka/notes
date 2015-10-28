/**
 * Created by dsk6 on 27.10.2015.
 */

var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//app.get("/notes", function(req,res) {
//    var notes = [
//        {text: "Note #1"},
//        {text: "Note #2"},
//        {text: "Note #3"}
//    ];
//    res.send(notes);
//});


app.use(session({
    secret: 'angular_tutorial',
    resave: true,
    saveUninitialized: true
}));


app.get("/notes", function(req,res) {
    res.send(req.session.notes||[]);
});


app.post("/notes", function(req, res) {
    if (!req.session.notes) {
        req.session.notes = [];
        req.session.last_note_id = 0;
    }
    var note = req.body;
    note.id = req.session.last_note_id;
    req.session.last_note_id++;
    req.session.notes.push(note);
    res.end();
});


app.delete("/notes", function(req,res) {
    var id = req.query.id;
    var notes = req.session.notes||[];
    var updatedNotesList = [];
    var newid = 0;
    for (var i=0;i<notes.length;i++) {
        if (notes[i].id != id) {
            updatedNotesList.push(notes[i]);
        }
    }
    req.session.notes = updatedNotesList;
    res.end();
});


//-----------------------------------------------------
app.listen(3000);
