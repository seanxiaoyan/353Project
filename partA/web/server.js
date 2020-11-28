'use strict';


const express = require('express');
const bodyParser = require("body-parser");


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



var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get('/', (req, res) => {
  console.log("From Home Page")
  res.sendFile(PATH + '/html/'+'customer.html');
});
app.get('/employee', (req, res) => {

  res.sendFile(PATH + '/html/'+'employee.html');
  
});
app.get('/customer', (req, res) => {

  res.sendFile(PATH + '/html/'+'customer.html');

});
app.get('/login', (req, res) => {

  res.sendFile(PATH + '/html/'+'login.html');

});





app.post('/newItem', urlencodedParser, function (req, res) {
  var Item = req.body.item;
  var Price = req.body.price;

  var sql = "INSERT INTO menu (Item, Price) VALUES ('"+Item+"', '"+Price+"')";
  con.query(sql, function (err, result) {
  if (err){
    console.log(err.message);
    res.sendStatus(500);
  }
  else{
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
    if(result.affectedRows>0){ res.status(200).send("delete ok");}
    else{
      res.status(200).send("Item not exist");
    }
    });
});

app.post('/newOrder', urlencodedParser, function (req, res) {
  var items = req.body.items;
  var total = parseFloat(req.body.total);
  var customer_name = req.body.username;
  var sql = "INSERT INTO orders (customer_name,items, total) VALUES ('"+customer_name+"','"+items+"', '"+total+"')";
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
  var sql = 'SELECT * FROM orders ORDER BY order_time ASC';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });  
});
app.get('/getOrder_customer', (req, res) => {
  var data;
  var sql = 'SELECT * FROM orders';
  con.query(sql,function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });  
});

app.post('/auth', urlencodedParser,function(req, res) {
	var username = req.body.uname;
  var password = req.body.upassword;
  var role = req.body.role;
  var sql = `SELECT * FROM ${role} WHERE username = ? AND password = ?`;
	if (username && password) {
      con.query(sql,[username, password], function(err, results, fields) {
      if (err) throw err;
      if (results.length > 0) {
        res.redirect('/employee');
			} else {
				res.status(401).send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
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


app.post('/cancelOrder', urlencodedParser,function(req, res) {
	var order_id = req.body.order_id;

  

  var sql = 'DELETE FROM orders WHERE order_id = ?';
   
  con.query(sql,[order_id], function(err, results) {
    if (err) throw err;
    if(results.affectedRows>0){ res.status(200).send("cancel ok");}
    else{
      res.status(200).send("order not exist");
    }
  });
    
});

app.post('/updateOrder', urlencodedParser,function(req, res) {
	var order_id = req.body.order_id;
  var order_status = req.body.order_status;

  var sql = "UPDATE orders SET order_status=? WHERE order_id = ?";
   
  con.query(sql,[order_status,order_id], function(err, results) {
    if (err) throw err;
    if(results.affectedRows>0){ res.status(200).send("update ok");}
    else{
      res.status(200).send("order not exist");
    }
  });
    
});


app.get('/logout', (req, res) => {
  res.send("you have logout");
});

app.get('/select', (req, res) => {


  var sql = 'SELECT * FROM orders';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.json(result);
            

    });
  

});

app.use('/', express.static('html'));
app.listen(PORT, HOST);

console.log('up and running');
