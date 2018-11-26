var express = require('express');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

Kui express on installitud, siis lisame index.js faili koodijupi: 

//require the just installed express app
var express = require('express');
//then we call express
var app = express();

//takes us to the root(/) URL
app.get('/', function (req, res) {
//when we visit the root URL express will respond with 'Hello World'
  res.send('Hello World!');
});

//the server is listening on port 3000 for connections
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

Nüüd saame testida, kas server töötab. Selleks kirjutame commandi:

node index.js

URLi kirjutades localhost:3000, peaksilmuma „Hello world!“

View setup:

Kuna me tahame, et URLile minnes ei oleks lihtsalt „Hello world“, siis me kasutame EJS-i (Embedded JavaScript), et luua erinevaid buttoneid ja teeme formi, et saaks lisada new taske. 

EJSi installimiseks tuleb sisestada command:

npm install ejs --save

Nüüd paneme püsti template engine, sisetades sellise rea require statementide alla:

app.set('view engine', 'ejs');

EJSi võetakse by default views directoryst. Looge uus folder nimega views oma directorysse. Viewsi folderisse lisage fail nimega index.ejs ja lisage järgnev koodijupp:

<html>
  <head>
    <title> ToDo App </title>
    <link href="https://fonts.googleapis.com/css?family=Lato:100"     rel="stylesheet">
    <link href="/styles.css" rel="stylesheet">
  </head>
<body>
  <div class="container">
     <h2> A Simple ToDo List App </h2>
<form action ="/addtask" method="POST">
       <input type="text" name="newtask" placeholder="add new task">        <button> Add Task </button>
    <h2> Added Task </h2>
<button formaction="/removetask" type="submit"> Remove </button>
</form>
    <h2> Completed task </h2>
</div>
</body>
</html>

Nüüd vahetame app.get koodi index.js failis ära sellise koodijupiga:

app.get('/', function(req, res){
   res.render('index');
});

Nüüd kui server käima lüüa, siis peaks lehele kuvatama index.ejs faili sisu.

Task Setup: 

Meil on preagu üks route olemas, kui me tahame, et app töötaks, peab lisama ka post route. Vaadates index.ejs faili, siis me näeme, et meie form submitib post requesti /addtask route:

<form action="/addtask" method="POST">

Nüüd kui me teame, kuhu meie form postib, siis saame üles seada route: 

app.post('/addtask', function (req, res) {
   res.render('index')
});

Lisame Express Middleware. Middleware on funktsioon, millel on ligipääs req ja res bodidele, et saaks teha keerukamaid taske. Me hakkame kasutame body-parser middleware. See lubab meil kasutada key-value paare req-body objektis. Praegusel juhul on meil võimalik ligipääseda newtaskile, mille kirjutab sisse kasutaja kliendi poole peal ja seivib arrayina serveri poole peal.

Body-parseri installimiseks:

npm install body-parser --save

Kui installitud, siis lisame index.js faili rea: 

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

Lõpuks me saame updateda meie post requesti, et ta salvestaks newtaski value arraysse ja samal ajal lisab loopi index.ejs faili, et displayiks listi kõikide taskidega. 
Index.js file: 

//the task array with initial placeholders for added task
var task = ["buy socks", "practise with nodejs"];
//post route for adding new task
app.post('/addtask', function (req, res) {
    var newTask = req.body.newtask;
//add the new task from the post route into the array
    task.push(newTask);
//after adding to the array go back to the root route
    res.redirect("/");
});
//render the ejs and display added task, task(index.ejs) = task(array)
app.get("/", function(req, res) {
    res.render("index", { task: task});
});

index.ejs file:

<h2> Added Task </h2>
   <% for( var i = 0; i < task.length; i++){ %>
<li><input type="checkbox" name="check" value="<%= task[i] %>" /> <%= task[i] %> </li>
<% } %>

Testime appi: node index.js ja peaks saama lisada taski.

Delete Task Setup:

Peale uue taski lisamist, peabo lema võimalus ka kustutada seda. Selleks, et saaks checkida completed taski, kasutame remove buttonit meie EJS failis.

<button formaction="/removetask" type="submit"> Remove </button>

Index.js file:

//the completed task array with initial placeholders for removed task
var complete = ["finish jquery"];
app.post("/removetask", function(req, res) {
     var completeTask = req.body.check;
//check for the "typeof" the different completed task, then add into the complete task
if (typeof completeTask === "string") {
     complete.push(completeTask);
//check if the completed task already exist in the task when checked, then remove using the array splice method
  task.splice(task.indexOf(completeTask), 1);
  } else if (typeof completeTask === "object") {
    for (var i = 0; i < completeTask.length; i++) {     complete.push(completeTask[i]);
    task.splice(task.indexOf(completeTask[i]), 1);
}
}
   res.redirect("/");
});

App.get-i peab ka lisama selle:

app.get("/", function(req, res) {
    res.render("index", { task: task, complete: complete });
});

Index.ejs file:
<h2> Completed task </h2>
    <% for(var i = 0; i < complete.length; i++){ %>
      <li><input type="checkbox" checked><%= complete[i] %> </li>
<% } %>




