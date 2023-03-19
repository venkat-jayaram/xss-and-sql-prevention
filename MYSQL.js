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