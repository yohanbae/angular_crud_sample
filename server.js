var express = require('express');
var router = express.Router();
var app = new express();


app.use(express.static(__dirname+ "/public"));



app.listen(3000);
console.log("Server running on pot 3000");
console.log("this one called");