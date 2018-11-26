var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//mongodb connection
mongoose.connect("mongodb://localhost/tasksList");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


//mogoose schema
var tasksSchema = new mongoose.Schema({
  name: String
});

var task = mongoose.model("Task", tasksSchema);


// var task = ["buy socks", "practise with nodejs"];

app.post('/addtask', function (req, res) {

  console.log(req.body.item);
  var newTodo = new task({
    name: req.body.newtask
  });

  task.create(newTodo, function (err, task) {
    if (err) console.log(err);
    else {
      console.log("Insert: " + newTodo);
    }
  });
  res.redirect("/");
});


//var complete = ["finish jquery"];


app.post('/removetask/:id', function (req, res) {
  var itemToDelete = req.params.id;
  task.remove({'_id': itemToDelete}, function (err) {
    res.redirect("/");
  });
});


app.get("/", function (req, res) {
  task.find({}, function (err, tasks) {
    if (err) console.log(err);
    else {
      res.render("index.ejs", {taskList: tasks});
    }
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

