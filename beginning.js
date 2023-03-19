const express = require("express");
const bodyParser = require("body-parser");
const sanitizeHtml = require('sanitize-html');

const app = express(); 
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", function(req, res) {
  res.sendFile("E:/VIT/SEMESTER-3/PROJECT/BCI3001/testproj.html");
});

app.post("/", function(req, res) {
  res.sendFile("E:/VIT/SEMESTER-3/PROJECT/BCI3001/details.html");
});
app.post("/check", function(req, res)
{
  var a = String(req.body.valu);
  var b = String(req.body.about);
  console.log(a);
  console.log(b);
  //a = a.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  //b = sanitizeHtml(b);
  res.send("So your name is "+a+" and this is what you told about yourself "+b);
});
app.use(function (req,res,next){
	res.status(404).send('Unable to find the requested resource!');
});
app.listen(8080, function(){
  console.log("server is running on port 8080");
})