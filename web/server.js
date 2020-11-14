'use strict';


const express = require('express');
const bodyParser = require("body-parser");
const session = require('express-session')



const PORT = 80;
const HOST = '0.0.0.0';
const app = express();
const PATH = __dirname;

var mysql = require('mysql');
var con = mysql.createConnection({
  host            : process.env.DATABASE_HOST,
  port            : process.env.MYSQL_PORT,
  user            : process.env.MYSQL_USER,
  password        : process.env.MYSQL_PASSWORD,
  database        : process.env.MYSQL_DATABASE
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get('/', (req, res) => {
  console.log("From Home Page")
  res.sendFile(PATH + '/html/'+'index.html');
});
app.get('/employee', (req, res) => {
  if(req.session.loggedin && req.session.name == "employees"){
    console.log("From employee Page")
    res.sendFile(PATH + '/html/'+'employee.html');
  }
  else{
    res.send('Please login to view this page');
  }
});
app.get('/customer', (req, res) => {
  console.log(req.session.name);
  if(req.session.loggedin&& req.session.name == "customers"){
    console.log(`session id: ${req.session.name}`)
    res.sendFile(PATH + '/html/'+'customer.html');
  }
  else{
    res.send('Please login to view this page');
  }
});
app.get('/login', function(req, res) {
  console.log("From login page")
  res.sendFile(PATH + '/html/'+'login.html');
});



app.post('/newItem', urlencodedParser, function (req, res) {
  var Item = req.body.item;
  var Price = req.body.price;

  // var date = (new Date()).toISOString();
  // var timestamp = date.substring(0,10)+ ' '+date.substring(11,19);
  var sql = "INSERT INTO menu (Item, Price) VALUES ('"+Item+"', '"+Price+"')";
  con.query(sql, function (err, result) {
  if (err){
    console.log(err.message);
    res.sendStatus(500);
  }
  else{
    console.log("INSERT OK");
    res.sendStatus(200);
  }
  });
});

app.delete('/deleteItem', urlencodedParser, function (req, res) {
  var Item = req.body.item;
  var sql = "DELETE FROM menu WHERE Item='"+Item+"'";
  con.query(sql, function (err, result) {
  if (err){
    console.log(err.message);
    res.sendStatus(500);
  }
  else{
    console.log("DELETE OK");
    res.sendStatus(200);
  }
  });
});

app.post('/newOrder', urlencodedParser, function (req, res) {
  var Item = req.body.item;
  var Price = req.body.price;

  var sql = "INSERT INTO orders (Item, Price) VALUES ('"+Item+"', '"+Price+"')";
  con.query(sql, function (err, result) {
  if (err){
    console.log(err.message);
    res.sendStatus(500);
  }
  else{
    console.log("INSERT OK");
    res.sendStatus(200);
  }
  });
});


app.get('/clearMenu', (req, res) => {
  console.log("from clear");
  var sql = 'DELETE FROM menu';
  con.query(sql,(err,result)=>{
    if (err) throw err;
    res.sendStatus(200);
  })
});


app.get('/getMenu', (req, res) => {

  var sql = 'SELECT * FROM menu ORDER BY Item ASC';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });  
});
app.get('/getOrders', (req, res) => {
  var data;
  var sql = 'SELECT * FROM orders ORDER BY OrderTime ASC';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });  
});

app.post('/auth', urlencodedParser,function(req, res) {
	var username = req.body.uname;
  var password = req.body.upassword;
  var role = req.body.role+='s';
  var sql = `SELECT * FROM ${role} WHERE username = ? AND password = ?`;
	if (username && password) {
    if(role=="customers"){
      con.query(sql,[username, password], function(err, results, fields) {
        if (err) throw err;
        if (results.length > 0) {
				  req.session.loggedin = true;
          req.session.username = username;
          req.session.name = role;
          res.redirect('/customer');
        } 
        else {
				  res.status(401).send('Incorrect Username and/or Password!');
			  }			
			  res.end();
		  });
    }
    else{
      con.query(sql,[username, password], function(err, results, fields) {
      if (err) throw err;
      if (results.length > 0) {
				req.session.loggedin = true;
        req.session.username = username;
        req.session.name = role;
        res.redirect('/employee');
			} else {
				res.status(401).send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
    }
  } 
  else {
		res.status(500).send("Please Enter username/password")
	}
});

app.post('/register', urlencodedParser,function(req, res) {
	var username = req.body.uname;
  var password = req.body.upassword;
  var role = req.body.role+='s';
  var sql = `INSERT INTO ${role} (username, password) VALUES (?, ?)`;
	if (username && password) {
    if(role=="customers"){
      con.query(sql,[username, password], function(err, results, fields) {
        if (err) throw err;
			  res.status(200).send("register sucuess");
		  });
    }
    else{
      con.query(sql,[username, password], function(err, results, fields) {
        if (err) throw err;
			  res.status(200).send("register sucuess");
		});
    }
  } 
  else {
		res.status(500).send("Please Enter username/password")
	}
});
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.send("you have logout");
});
app.get('/select', (req, res) => {


  var sql = 'SELECT * FROM customers';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.json(result);
            

    });
  

});
app.use('/', express.static('html'));
app.listen(PORT, HOST);

console.log('up and running');
