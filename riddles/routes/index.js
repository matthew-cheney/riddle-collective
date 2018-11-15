var express = require('express');
var router = express.Router();

/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/riddleDB', { useNewUrlParser: true }); //Connects to a mongo database called "riddleDB"


var riddleSchema = mongoose.Schema({ //Defines the Schema for this database
    Riddle: String,
    Answer: String,
    DateCreated: Number,
    Correct: Number,
    Wrong: Number,
    UserAnswer: String,
    DisplayAnswer: Number,
    Percentage: Number
});

riddleSchema.methods.correct = function(cb) {
    this.Correct += 1;
    this.save(cb);
};

riddleSchema.methods.wrong = function(cb) {
    this.Wrong += 1;
    this.save(cb);
};

riddleSchema.methods.skip = function(cb) {
    this.Wrong += .7;
    this.save(cb);
};

var Riddle = mongoose.model('Riddle', riddleSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});


router.get('/riddles', function(req, res, next) {
    console.log("in GET /riddles with ", req.body);
    Riddle.find(function(err, riddle) {
        if (err) { return next(err); }
        console.log("sending back ", riddle);
        res.json(riddle);
    });
});

router.post('/riddles', function(req, res, next) {
    console.log("in POST /riddles with ", req.body);
    var riddle = new Riddle(req.body);
    riddle.save(function(err, riddle) {
        if (err) { return next(err); }
        console.log("sending back ", riddle);
        res.json(riddle);
    });
});

router.param('riddle', function(req, res, next, id) {
    Riddle.findById(id, function(err, riddle) {
        if (err) { return next(err); }
        if (!riddle) { return next(new Error("can't find riddle")); }
        req.riddle = riddle;
        return next();
    });
});

router.get('/riddles/:riddle', function(req, res) {
    res.json(req.riddle);
});

router.put('/riddles/:riddle/correct', function(req, res, next) {
    req.riddle.correct(function(err, riddle) {
        if (err) { return next(err); }
        res.json(riddle);
    });
});

router.put('/riddles/:riddle/wrong', function(req, res, next) {
    req.riddle.wrong(function(err, riddle) {
        if (err) { return next(err); }
        res.json(riddle);
    });
});

router.put('/riddles/:riddle/skip', function(req, res, next) {
    req.riddle.skip(function(err, riddle) {
        if (err) { return next(err); }
        res.json(riddle);
    });
});

router.delete('/riddles/:riddle', function(req, res) {
    console.log("in Delete");
    req.riddle.remove();
    Riddle.find(function(err, riddle) {
        if (err) { return next(err); }
        console.log("sending back ", riddle);
        res.json(riddle);
    });
});



module.exports = router;
