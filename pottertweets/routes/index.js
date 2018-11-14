var express = require('express');
var router = express.Router();

/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/potterDB', { useNewUrlParser: true }); //Connects to a mongo database called "commentDB"

var commentSchema = mongoose.Schema({ //Defines the Schema for this database
    Name: String,
    Comment: String,
    URL: String,
    Likes: Number,
    DateCreated: Number
});

var Comment = mongoose.model('Comment', commentSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});




router.post('/comment', function(req, res, next) {
    console.log("in POST /comment route");
    console.log(req.body);
    var newcomment = new Comment(req.body);
    console.log(newcomment);
    newcomment.save(function(err, post) {
        if (err) return console.error(err);
        else {
            console.log(post);
            res.sendStatus(200);
        }
    });
});

/* GET comments from database */
router.get('/comment', function(req, res, next) {
    console.log("In the GET route");
    Comment.find(function(err, list) {
        if (err) console.log(err);
        else {
            console.log(list);
            res.json(list);
        }
    });
});

router.get('/search', function(req, res, next) {
    console.log(req.query.q);
    Comment.find({ Name: req.query.q }, function(err, list) {
        if (err) console.log(err);
        else {
            res.json(list);
        }
    });
});

router.post('/addlikes', function(req, res, next) {
    console.log("in POST addlikes route");
    var myQuery = { _id: mongoose.Types.ObjectId(req.body.postID) };
    console.log("liking element: ", myQuery);

    Comment.findOneAndUpdate(myQuery, { $inc: { 'Likes': 1 } }, function(err) {
        if (err) throw err;
        else {
            res.sendStatus(200);
        }
    });

});

router.delete('/deletecomment', function(req, res, next) {
    console.log("in delete comments route");
    var myQuery = { _id: mongoose.Types.ObjectId(req.body.postID) };
    console.log("deleting element: ", myQuery);
    Comment.deleteOne(myQuery, function(err) {
        if (err) throw err;
        else {
            res.sendStatus(200);
        }
    });

    //db.dropDatabase(function(err) {
    //    if (err) console.log(err);
    //    res.send(200);
    //});
});

module.exports = router;
