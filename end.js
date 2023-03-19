const express = require("express");
const bodyParser = require("body-parser");
const sanitizeHtml = require('sanitize-html');
const ejs = require('ejs');
	
var requestIp = require('request-ip');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "newuser",
  password: "newpassword",
  database: "xss"
});

con.connect(function(err) {
  if (err) console.log(err);
  console.log("Connected!");
});

const app = express();
app.set ("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.get("/", function(req, res){
    res.render("prime");
    
    
  });

var x = [];
var potentialsql = ["'","''",'-- or # ','" OR "" = "',"OR 1=1","AND 1=1","--"];
var potentialxss = ["script","<",">","href","src","image"];
function checksql(a)
{
  var i;
  var j;
  for(i=0;i<potentialsql.length;i++)
  {
    j =new RegExp(potentialsql[i], "g");
    if(j.test(a))
    {
        return 1;
    }
  }
  return 0;
}
function checkxss(a)
{
  var i;
  var j;
  for(i=0;i<potentialxss.length;i++)
  {
    j =new RegExp(potentialxss[i], "g");
    if(j.test(a))
    {
        return 1;
    }
  }
  return 0;
}
app.post("/front",function(req, res)
{
    res.render("mantle");
});

app.post("/response",function(req,res)
{
    res.render("search");
});

app.post("/response2",function(req,res)
{
    var a = req.body.search1;
    var b = req.body.search2;
    var y = checksql(a);
    var z = checksql(b);
    console.log(y);
    console.log(z);
    console.log(a);
    console.log(b);
    var time =  new Date();
    var clientIp = requestIp.getClientIp(req);
    if(y==1||z==1)
    {
      console.log("error spotted");
      res.redirect("/");
      var sql = "INSERT INTO potsql values('"+clientIp+"','/response2','"+time+"')";
      con.query(sql, function (err) {  
          if (err) console.log(err); 
          console.log("Inserted potsql");
      });
    }
    else
    {
      var sql = "select * from info where name = '"+a+"' and ID = '"+b+"'";
      con.query(sql,function (err, result)
      {
        if(err) console.log(err);
        else if(result.length==0 )
        {
          res.redirect("/");
        }
        else
        {
          console.log("fetched");
          console.log(result);
          res.render("output",{x:result});
        }

      });
    }

});
app.post("/page-1",function(req,res)
{
    var a = req.body.valu;
    var b = req.body.about;
    var c = req.body.phone;
    var n = req.body.address;
    var ind = req.body.age;
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(n);
    console.log(ind);
    var time =  new Date();
    var clientIp = requestIp.getClientIp(req);
    if(checkxss(a)==1||checkxss(b)==1||checkxss(c)==1||checkxss(n)==1)
    {
      console.log("error spotted");
      var sql = "INSERT INTO potxss values('"+clientIp+"','/page-1','"+time+"')";
      con.query(sql, function (err) {  
          if (err) console.log(err); 
          console.log("Inserted potxss");
      });
    }
    a = sanitizeHtml(a);
    b = sanitizeHtml(b);
    c = sanitizeHtml(c);
    n = sanitizeHtml(n);
    ind = sanitizeHtml(ind);
    var sql = "INSERT INTO info VALUES ('"+ a +"','"+ b +"','"+c+"','"+n+"',"+ind+")";
    con.query(sql, function (err) {  
        if (err) console.log(err); 
        console.log("Inserted");
    }); 
    res.redirect("/");
});

app.listen(8080, function(){
    console.log("server is running on port 8080");
  })