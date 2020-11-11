'use strict';


const express = require('express');
const bodyParser = require("body-parser");




const PORT = 8080;
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

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {
  console.log("From Home Page")
  res.sendFile(PATH + '/html/'+'posting.html');
});

app.post('/newItem', urlencodedParser, function (req, res) {
  var Item = req.body.item;
  var Price = req.body.price;
  console.log("Item and price: ");
  console.log(Item);
  console.log(Price);

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


app.get('/clearMenu', (req, res) => {
  console.log("from clear");
  var sql = 'DELETE FROM menu';
  con.query(sql,(err,result)=>{
    if (err) throw err;
    res.sendStatus(200);
  })
});


app.get('/getMenu', (req, res) => {
  var data;
  var sql = 'SELECT * FROM menu ORDER BY Item ASC';
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });  
});

app.use('/', express.static('html'));
app.listen(PORT, HOST);

console.log('up and running');
