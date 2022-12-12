// Server to manage restaurant data including orders
const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const url = require("url");
const qs = require("querystring");
const port = process.env.PORT || 3000;
const {createWriteStream} = require("fs");
const methods = Object.create(null);
const {writeFile} = require("fs");
const {appendFile} = require("fs");
const session = {};
// create error flag for calls
let restStatus = "";

// Cookie Parser
const parseCookies = (cookie = '') => 
	cookie
		.split(";")
		.map(v => v.split('='))
		.map(([k, ...vs]) => [k, vs.join('=')])
		.reduce((acc, [k, v]) => {
			acc[k.trim()] = decodeURIComponent(v);
			return acc;
		}, {});

// Configure bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Configure Parameterization
app.param('id', function(req, res, next, id) {
	const modified = id.toUpperCase();
	req.id = modified;
	next();
  });

app.route('/') 
  .get(function(req,res,next) {
	  			//Handle the base url request and send the home page
			fs.readFile("home.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});
  });

  app.route('/login')
  .get(function(req,res,next) {
    
    const pg = require("pg")
    const R = require("ramda")
    const dotenv = require("dotenv")
    dotenv.config()
	
	// Get the cookies
	const cookies = parseCookies(req.headers.cookie);

    // Query for the user
	let query = "select * from customer where username='" + cookies.username +
                "' and password='" + cookies.password + "'";

	console.log(query);
    const client = new pg.Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    })
        console.log(query);
    client.connect()
    client.query(query).then(ress => {

        // process the results of the query
        const qdata = ress.rows
        let result =""
        let isowner = false
        qdata.forEach(row => {
            console.log(`Id: ${row.userid} UName: ${row.username} Pwd: ${row.password}`);
            result = row.password
            isowner = row.isowner
        })

        if(result==cookies.password) {

            if (isowner) {
                
                console.log("we got an owner")

                       //Handle the user registration url request and send the order form page
                       fs.readFile("inventory.html", function(err, data){
                        if(err){
                            res.statusCode = 500;
                            res.write("Server error.");
                            res.end();
                            return;
                        }
            
                        res.statusCode = 201;
                        res.setHeader("Content-Type", "text/html");
                        res.write(data);
                        res.end();
                    });

            } else {

                      //Handle the user registration url request and send the order form page
                      fs.readFile("bookstore.html", function(err, data){
                        if(err){
                            res.statusCode = 500;
                            res.write("Server error.");
                            res.end();
                            return;
                        }
            
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        res.write(data);
                        res.end();
                    });

            }

        } else {

					res.statusCode = 404;
					res.setHeader("Content-Type", "text/html");
					res.end();

        }


    }).finally(() => client.end())
            

  });

  app.route('/logout')
  .get(function(req,res,next) {
	  		// Get the cookies

			fs.readFile('logout.html', (err,data) => {
					if (err) {
						throw err;
					}
					res.end(data);
			});

  });


 // Route for individual user profiles
 app.route('/checkout')
 .get(function(req,res,next) {

	let datalinks = "<table id='books'>";
	datalinks = datalinks + "<tr><th>Order ID</th><th>Item ID</th><th>ISBN</th></th><th>Order Date</th><th>Tracking No</th><th>Total Cost</th><th>Status</th></tr>"

	const pg = require("pg")
	const R = require("ramda")
	const dotenv = require("dotenv")
	dotenv.config()
	
	// Get the cookies
	const cookies = parseCookies(req.headers.cookie);

	// Query for the user
	let query = "select * from customer_order where customer_order.user_id=(select distinct userid from customer where status='CART' and username='"+
				 cookies.username + "')";
	console.log(query);
	const client = new pg.Client({
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: process.env.PGPORT
	})

	client.connect()
	client.query(query).then(ress => {

		// process the results of the query
		const qdata = ress.rows
		qdata.forEach(row => {
			console.log(`Id: ${row.orderid} UName: ${row.status} Pwd: ${row.ordertotal}`);
			datalinks = datalinks + "<tr><td><a href='bookdetail/"
			+ row.isbn + "' style='color:black; background-color:white;' target='_blank'>" 
			+ row.orderid + "</a></td><td>" + row.item_id + "</td><td>" 
			+ row.isbn + "</td><td>"
			+ row.order_date + "</td><td>"
			+ row.track_no + "</td><td>" 
			+ parseFloat(row.ordertotal) 
		datalinks = datalinks + "</td><td><a href='remove/' style='color:black; background-color:white;' target='_blank'>Remove From Cart</td></tr>"
	

		})
		datalinks = datalinks + "</table><h1>Checkout Form</h1>" +
			"<p>Enter your Credit Card information and address below to complete your order.</p>" +
			"<form action='registerUser()'></form>" +
			"<input type='text' placeholder='Card#' id='card'>" +
			"<input type='text' placeholder='CCV' id='ccv'>" +
			"<p>Billing Address: </p>" +
			'<input type="text" placeholder="Street" id="street"></br>' +
			'<input type="text" placeholder="Unit" id="unit"></br>' +
			'<input type="text" placeholder="City" id="city"></br>' +
			'<input type="text" placeholder="State/Province" id="state"></br>' +
			'<input type="text" placeholder="ZIP/Postal Code" id="zip"></br>' +
			'<input type="text" placeholder="Country" id="country"></br></br>' +
			'<input type="checkbox" id="same">' +
			'<label for="name"> Shipping Address is same as Billing Address</label></br>' +
			'<p>Shipping Address: </p>' +
			'<input type="text" placeholder="Street" id="street2"></br>' +
			'<input type="text" placeholder="Unit" id="unit2"></br>' +
			'<input type="text" placeholder="City" id="city2"></br>' +
			'<input type="text" placeholder="State/Province" id="state2"></br>' +
			'<input type="text" placeholder="ZIP/Postal Code" id="zip2"></br>' +
			'<input type="text" placeholder="Country" id="country2"></br></br>' +
			'<button id="checkout">Checkout</button>' +
			'</div><script src="checkout.js"> </script>'

		const result = R.head(R.values(R.head(ress.rows)))
		console.log(result)
		console.log(datalinks)

		// Write response
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html");
		res.write(datalinks);
		res.end();	

	})
 
  });
 

  // Route for individual user profiles
app.route('/myorders')
.get(function(req,res,next) {
 
	let datalinks = "<table id='books'>";
	datalinks = datalinks + "<tr><th>Order ID</th><th>Item ID</th><th>ISBN</th></th><th>Order Date</th><th>Tracking No</th><th>Total Cost</th><th>Status</th></tr>"

	const pg = require("pg")
	const R = require("ramda")
	const dotenv = require("dotenv")
	dotenv.config()
	
	// Get the cookies
	const cookies = parseCookies(req.headers.cookie);

	// Query for the user
	let query = "select * from customer_order where customer_order.user_id=(select distinct userid from customer where username='"+
				 cookies.username + "')";
	console.log(query);
	const client = new pg.Client({
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: process.env.PGPORT
	})

	client.connect()
	client.query(query).then(ress => {

		// process the results of the query
		const qdata = ress.rows
		qdata.forEach(row => {
			console.log(`Id: ${row.orderid} UName: ${row.status} Pwd: ${row.ordertotal}`);
			datalinks = datalinks + "<tr><td><a href='bookdetail/"
			+ row.isbn + "' style='color:black; background-color:white;' target='_blank'>" 
			+ row.orderid + "</a></td><td>" + row.item_id + "</td><td>" 
			+ row.isbn + "</td><td>"
			+ row.order_date + "</td><td>"
			+ row.track_no + "</td><td>" 
			+ parseFloat(row.ordertotal) + "</td>" 
		if(row.status=='CART') datalinks = datalinks + "<td><a href='checkout/' style='color:black; background-color:white;' target='_blank'>" + row.status + "</a></td></tr>"
	    if(!row.status=='CART') datalinks = datalinks + "<td>" + row.status + "</td></tr>"

		})
		datalinks = datalinks + "</table>"

		const result = R.head(R.values(R.head(ress.rows)))
		console.log(result)
		console.log(datalinks)

		// Write response
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html");
		res.write(datalinks);
		res.end();	

	})
 
  });
 
// Route for annual publisher cost report
app.route('/annualpubcosts.html')
	.get(function(req,res,next) {
   
	  		//Handle the base url request and send the home page
			// Create variable to hold the html page
			var datalinks ="<!DOCTYPE html><html><head>" +
					"<style>.hover-menu {float: left; color: #f2f2f2; text-align: center; padding: 14px;text-decoration: none;font-size: 17px;}  .hover-menu:hover {background-color: #ddd;color: black;}</style></head>" +
					"<body style='margin: 0; font-family: Arial, Helvetica, sans-serif;'>" +
					"<div class='topnav' style='overflow: hidden; background-color: #333;'>" +
					"<a href='../home.html'><div class='hover-menu'>Home</div></a>" +
					"<a href='../reports.html'><div class='hover-menu'>Reports</div></a>" +
					"<a href='../inventory.html'><div class='hover-menu'>Inventory</div></a>" +
                    "<a href='../logout.html'><div class='hover-menu'>Logout</div></a></div>" +
					"<div class='listing'>" +
					"<h1>Annual Publication Cost for LOOK INNA BOOK</h1></br><table id='books'>";
		datalinks = datalinks + "<tr><th>Order ID</th><th>Item ID</th><th>ISBN</th></th><th>Order Date</th><th>Tracking No</th><th>Total Cost</th><th>Status</th></tr>"
	
		const pg = require("pg")
		const R = require("ramda")
		const dotenv = require("dotenv")
		dotenv.config()
		
		// Get the cookies
		const cookies = parseCookies(req.headers.cookie);
	
		// Query for the user
		let query = "select * from customer_order where NOT status='CART'"
					 cookies.username + "')";
		console.log(query);
		const client = new pg.Client({
			user: process.env.PGUSER,
			host: process.env.PGHOST,
			database: process.env.PGDATABASE,
			password: process.env.PGPASSWORD,
			port: process.env.PGPORT
		})
	
		client.connect()
		client.query(query).then(ress => {
	
			// process the results of the query
			const qdata = ress.rows
			qdata.forEach(row => {
				console.log(`Id: ${row.orderid} UName: ${row.status} Pwd: ${row.ordertotal}`);
				datalinks = datalinks + "<tr><td><a href='bookdetail/"
				+ row.isbn + "' style='color:black; background-color:white;' target='_blank'>" 
				+ row.orderid + "</a></td><td>" + row.item_id + "</td><td>" 
				+ row.isbn + "</td><td>"
				+ row.order_date + "</td><td>"
				+ row.track_no + "</td><td>" 
				+ parseFloat(row.ordertotal) 
			if(row.status=='CART') datalinks = datalinks + "</td><td><a href='checkout/' style='color:black; background-color:white;' target='_blank'>" + row.status + "</td></tr>"
			if(!row.status=='CART') datalinks = datalinks + "</td><td>" + row.status + "</td></tr>"
	
			})
			datalinks = datalinks + "</table>"
	
			const result = R.head(R.values(R.head(ress.rows)))
			console.log(result)
			console.log(datalinks)
	
			// Write response
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.write(datalinks);
			res.end();	
	
		})
   
	});

// Route for annual sales report
app.route('/annualsales.html')
	.get(function(req,res,next) {
   
	  		//Handle the base url request and send the home page
			// Create variable to hold the html page
			var datalinks ="<!DOCTYPE html><html><head>" +
					"<style>.hover-menu {float: left; color: #f2f2f2; text-align: center; padding: 14px;text-decoration: none;font-size: 17px;}  .hover-menu:hover {background-color: #ddd;color: black;}</style></head>" +
					"<body style='margin: 0; font-family: Arial, Helvetica, sans-serif;'>" +
					"<div class='topnav' style='overflow: hidden; background-color: #333;'>" +
					"<a href='../home.html'><div class='hover-menu'>Home</div></a>" +
					"<a href='../reports.html'><div class='hover-menu'>Reports</div></a>" +
					"<a href='../inventory.html'><div class='hover-menu'>Inventory</div></a>" +
                    "<a href='../logout.html'><div class='hover-menu'>Logout</div></a></div>" +
					"<div class='listing'>" +
					"<h1>Annual Sales for LOOK INNA BOOK</h1></br><table id='books'>";
		datalinks = datalinks + "<tr><th>Order ID</th><th>Item ID</th><th>ISBN</th></th><th>Order Date</th><th>Tracking No</th><th>Total Cost</th><th>Status</th></tr>"
	
		const pg = require("pg")
		const R = require("ramda")
		const dotenv = require("dotenv")
		dotenv.config()
		
		// Get the cookies
		const cookies = parseCookies(req.headers.cookie);
	
		// Query for the user
		let query = "select * from customer_order where NOT status='CART'"
					 cookies.username + "')";
		console.log(query);
		const client = new pg.Client({
			user: process.env.PGUSER,
			host: process.env.PGHOST,
			database: process.env.PGDATABASE,
			password: process.env.PGPASSWORD,
			port: process.env.PGPORT
		})
	
		client.connect()
		client.query(query).then(ress => {
	
			// process the results of the query
			const qdata = ress.rows
			qdata.forEach(row => {
				console.log(`Id: ${row.orderid} UName: ${row.status} Pwd: ${row.ordertotal}`);
				datalinks = datalinks + "<tr><td><a href='bookdetail/"
				+ row.isbn + "' style='color:black; background-color:white;' target='_blank'>" 
				+ row.orderid + "</a></td><td>" + row.item_id + "</td><td>" 
				+ row.isbn + "</td><td>"
				+ row.order_date + "</td><td>"
				+ row.track_no + "</td><td>" 
				+ parseFloat(row.ordertotal) 
			if(row.status=='CART') datalinks = datalinks + "</td><td><a href='checkout/' style='color:black; background-color:white;' target='_blank'>" + row.status + "</td></tr>"
			if(!row.status=='CART') datalinks = datalinks + "</td><td>" + row.status + "</td></tr>"
	
			})
			datalinks = datalinks + "</table>"
	
			const result = R.head(R.values(R.head(ress.rows)))
			console.log(result)
			console.log(datalinks)
	
			// Write response
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.write(datalinks);
			res.end();	
	
		})
   
	});

  app.route('/register')
  .post(function(req,res,next) {

	// Initializations

	let datalinks = "<table id='userlinks'>";

    const pg = require("pg")
    const R = require("ramda")
    const dotenv = require("dotenv")
    dotenv.config()
	
	// Get the cookies
	const cookies = parseCookies(req.headers.cookie);

    // Query for the user
	let query = "select * from customer where username='" + cookies.username + "'";
	console.log(query);
    const client = new pg.Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    })

    client.connect()
    client.query(query).then(ress => {

        // process the results of the query
        const qdata = ress.rows
        qdata.forEach(row => {
            console.log(`Id: ${row.userid} UName: ${row.username} Pwd: ${row.password}`);
        })
        const result = R.head(R.values(R.head(ress.rows)))
        console.log(result)
        if(result==undefined) {

 				// Create the new username with privacy=false
                 const q2 = "insert into customer (username,password) values ('"+ cookies.username + "','" + cookies.password + "')"
                console.log(q2)
                client.query(q2).then(res2 => {
                    
                    console.log(q2)

                
                }).catch(err => {
                    console.log(err.stack);
                })
 
                 res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                 res.end("Welcome " + cookies.username);

        } else {

                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'});
                res.end("Duplicate Username " + cookies.username);

        }

    })

  });

  app.route('/addtocart')
  .post(function(req,res,next) {

	// Initializations

	let datalinks = "<table id='userlinks'>";

    const pg = require("pg")
    const R = require("ramda")
    const dotenv = require("dotenv")
    dotenv.config()
	
	// Get the cookies
	const cookies = parseCookies(req.headers.cookie);

    // Query for the user
	let query = "select * from customer where username='" + cookies.username + "'";
	console.log(query);
    const client = new pg.Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    })

    client.connect()
    client.query(query).then(ress => {

        // process the results of the query
        const qdata = ress.rows
		var q2 = ""
        qdata.forEach(row => {
            console.log(`Id: ${row.userid} UName: ${row.username} Pwd: ${row.password}`);
			q2 = "insert into customer_order (user_id,item_id, isbn,quantity,track_no,ordertotal,status) " +
			"values ('"+ row.userid + "','1','" + cookies.isbn +  "','1','1','" + cookies.price + "','CART')"
        })
        const result = R.head(R.values(R.head(ress.rows)))
        console.log(result)
        if(!result=="") {

               client.query(q2).then(res2 => {

					res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
					res.end("Successfully added book with the following isbn to cart " + cookies.isbn);
                
                }).catch(err => {
                    console.log(err.stack);
					res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'});
					res.end("Query failed to add item " + cookies.isbn);
                })
    

        } else {

                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'});
                res.end("You must be logged in to add to cart ");

        }

    })

  });

  app.route('/addbooks')
  .post(function(req,res,next) {

	// Initializations

	let datalinks = "<table id='userlinks'>";

    const pg = require("pg")
    const R = require("ramda")
    const dotenv = require("dotenv")
    dotenv.config()
	
	// Get the cookies
	const cookies = parseCookies(req.headers.cookie);

    // Query for the user
	let query = "select * from book where title='" + cookies.in_tit + "'";
	console.log(query);
    const client = new pg.Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    })

    client.connect()
    client.query(query).then(ress => {

        // process the results of the query
        const qdata = ress.rows
        qdata.forEach(row => {
            console.log(`Id: ${row.userid} UName: ${row.username} Pwd: ${row.password}`);
        })
        const result = R.head(R.values(R.head(ress.rows)))
        console.log(result)
        if(result==undefined) {

 				// Create the new username with privacy=false
                 const q2 = "insert into book (isbn, title, pubid, author, pages, price, quantity, genres) values ('"
				 + cookies.in_isbn + "','" 
				 + cookies.in_tit + "','"
				 + cookies.in_pub + "','" 
				 + cookies.in_aut + "','"	 
				 + cookies.in_pgs + "','" 
				 + cookies.in_pr + "','"	 
				 + cookies.in_qty + "','"   
				 + cookies.in_gen + "')"
                console.log(q2)
                client.query(q2).then(res2 => {
                    
                    console.log(q2)

                
                }).catch(err => {
                    console.log(err.stack);
                })
 
                 res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                 res.end("Successfully Added " + cookies.iin_tit);

        } else {

                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'});
                res.end("Duplicate Title " + cookies.username);

        }

    })


  });

  app.route('/registration.html')
  .get(function(req,res,next) {
	  		//Handle the user registration url request and send the registratin page
			fs.readFile("registration.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});

  });


  app.route('/bookstore.html')
  .get(function(req,res,next) {
	  		//Handle the user registration url request and send the registratin page
			fs.readFile("bookstore.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});

  });

  app.route('/inventory.html')
  .get(function(req,res,next) {
	  		//Handle the user registration url request and send the registratin page
			fs.readFile("inventory.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});

  });

  app.route('/reports.html')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("reports.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});
  });

  app.route('/home.html')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("home.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});
  });

  app.route('/login.html')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("login.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});
  });

  app.route('/orders.html')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("orders.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});
  });

  app.route('/logout.html')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("logout.html", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});
  });

  app.route('/styles.css')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("styles.css", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.write(data);
				res.end();
			});
  });

  app.route('/search')
  .get(function(req,res,next) {

            let datalinks = "<table id='books'>";
            datalinks = datalinks + "<tr><th>Title</th><th>Author</th><th>Genre</th></tr>"
        
            const pg = require("pg")
            const R = require("ramda")
            const dotenv = require("dotenv")
            dotenv.config()
            
            // Get the cookies
            const cookies = parseCookies(req.headers.cookie);
			let query = "select * from book";
			console.log(cookies.searchtype)
			if(cookies.searchtype=="Normal") {
				// Query for the user
				if (!cookies.searcht=="" || !cookies.searchg=="" || !cookies.searcha=="") query = query + " where "
				if (!cookies.searcht=="") query = query + " title='" + cookies.searcht + "'" 
				if (cookies.searcht=="" && !cookies.searcha=="")  query = query + " author='" + cookies.searcha + "'" 
				if (!cookies.searcht=="" && !cookies.searcha=="")  query = query + " and author='" + cookies.searcha + "'" 
				if (cookies.searcht=="" && cookies.searcha=="" && !cookies.searchg=="")  query = query + " genres='" + cookies.searchg + "'" 
				if ((!cookies.searcht=="" || !cookies.searcha=="") && !cookies.searchg=="")  query = query + " and genres='" + cookies.searchg + "'" 
			} else {
				if (!cookies.searcht=="" || !cookies.searchg=="" || !cookies.searcha=="") query = query + " where "
				if (!cookies.searcht=="") query = query + " title like'%" + cookies.searcht + "%'" 
				if (cookies.searcht=="" && !cookies.searcha=="")  query = query + " author like '%" + cookies.searcha + "%'" 
				if (!cookies.searcht=="" && !cookies.searcha=="")  query = query + " and author like '%" + cookies.searcha + "%'" 
				if (cookies.searcht=="" && cookies.searcha=="" && !cookies.searchg=="")  query = query + " genres like'%" + cookies.searchg + "%'" 
				if ((!cookies.searcht=="" || !cookies.searcha=="") && !cookies.searchg=="")  query = query + " and genres like '%" + cookies.searchg + "%'" 

			}
            console.log(query);
            const client = new pg.Client({
                user: process.env.PGUSER,
                host: process.env.PGHOST,
                database: process.env.PGDATABASE,
                password: process.env.PGPASSWORD,
                port: process.env.PGPORT
            })
        
            client.connect()
            client.query(query).then(ress => {
        
                // process the results of the query
                const qdata = ress.rows
                qdata.forEach(row => {
                    console.log(`Id: ${row.title} UName: ${row.author} Pwd: ${row.genres}`);
                    datalinks = datalinks + "<tr><td><a href='bookdetail/"+ row.isbn + "' style='color:black; background-color:white;' target='_blank'>" + row.title + "</a></td><td>" + row.author + "</td><td>" + row.genres + "</td></tr>"
                })
                datalinks = datalinks + "</table>"
                const result = R.head(R.values(R.head(ress.rows)))
                console.log(result)
                console.log(datalinks)

                // Write response
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/html");
                res.write(datalinks);
                res.end();	

            })

		
  });

  
app.route('/bookdetail/:id')
.get(function(req, res) {

	  		//Handle the base url request and send the home page
			// Create variable to hold the html page
			var datalinks ="<!DOCTYPE html><html><head>" +
					"<style>.hover-menu {float: left; color: #f2f2f2; text-align: center; padding: 14px;text-decoration: none;font-size: 17px;}  .hover-menu:hover {background-color: #ddd;color: black;}</style></head>" +
					"<body style='margin: 0; font-family: Arial, Helvetica, sans-serif;'>" +
					"<div class='topnav' style='overflow: hidden; background-color: #333;'>" +
					"<a href='../home.html'><div class='hover-menu'>Home</div></a>" +
					"<a href='../orders.html'><div class='hover-menu'>My Orders</div></a>" +
					"<a href='../bookstore.html'><div class='hover-menu'>Bookstore</div></a>" +
					"<a href='../register.html'><div class='hover-menu'>Registration</div></a>" +
                    "<a href='../logout.html'><div class='hover-menu'>Logout</div></a></div>" +
					"<div class='listing'>" +
					"<h1>Book Detail</h1>" +
					"<p>Click on the button to add this selection to your cart:</p><div>";
			//
            datalinks = datalinks + "<table id='bookdetail'>";
        
            const pg = require("pg")
            const dotenv = require("dotenv")
            dotenv.config()
            
            // Get the cookies
            const cookies = parseCookies(req.headers.cookie);
        
            // Query for the user
            let query = "select * from book where isbn='"+req.params.id+"'";
            console.log(query);
            const client = new pg.Client({
                user: process.env.PGUSER,
                host: process.env.PGHOST,
                database: process.env.PGDATABASE,
                password: process.env.PGPASSWORD,
                port: process.env.PGPORT
            })
        
            client.connect()
            client.query(query).then(ress => {
        
                // process the results of the query
                const qdata = ress.rows
                qdata.forEach(row => {

                    datalinks = datalinks + "<tr><td>ISBN</td><td id='isbn'>" + row.isbn + "</td></tr>" + 
                                            "<tr><td>Title</td><td>" + row.title + "</td></tr>" + 
                                            "<tr><td>Author</td><td>" + row.author + "</td></tr>" + 
                                            "<tr><td>Genres</td><td>" + row.genres + "</td></tr>" +
                                            "<tr><td>Pages</td><td>" + row.pages + "</td></tr>" +
                                            "<tr><td>Price ($)</td><td id='price'>" + row.price + "</td></tr>" +
                                            "</table></div>" +
                                            "<form action='addToCart()'></form>" +
                                            "<button id='cart' onclick='addToCart("+row.isbn+","+row.price+")'>Add to Cart</button>&nbsp" +
                                            "<button id='close' onclick='closeCartWindow()'>Close Window</button>" +
                                            "</div><script src='../addToCart.js'></script>" + 
                                            "</div></body></html>";

                })

 

                console.log(datalinks)

			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.write(datalinks);
			res.end();	

            })


});

app.route('/delete/:id')
.get(function(req, res) {

	  		//Handle the base url request and send the home page
			// Create variable to hold the html page
			var datalinks ="<!DOCTYPE html><html><head>" +
					"<style>.hover-menu {float: left; color: #f2f2f2; text-align: center; padding: 14px;text-decoration: none;font-size: 17px;}  .hover-menu:hover {background-color: #ddd;color: black;}</style></head>" +
					"<body style='margin: 0; font-family: Arial, Helvetica, sans-serif;'>" +
					"<div class='topnav' style='overflow: hidden; background-color: #333;'>" +
					"<a href='../home.html'><div class='hover-menu'>Home</div></a>" +
					"<a href='../orders.html'><div class='hover-menu'>My Orders</div></a>" +
					"<a href='../bookstore.html'><div class='hover-menu'>Bookstore</div></a>" +
					"<a href='../register.html'><div class='hover-menu'>Registration</div></a>" +
                    "<a href='../logout.html'><div class='hover-menu'>Logout</div></a></div>" +
					"<div class='listing'>" +
					"<h1>Book Detail</h1>" +
					"<p>Click on the button to add this selection to your cart:</p><div>";
			//
            datalinks = datalinks + "<table id='bookdetail'>";
        
            const pg = require("pg")
            const dotenv = require("dotenv")
            dotenv.config()
            
            // Get the cookies
            const cookies = parseCookies(req.headers.cookie);
        
            // Query for the user
            let query = "select * from book where isbn='"+req.params.id+"'";
            console.log(query);
            const client = new pg.Client({
                user: process.env.PGUSER,
                host: process.env.PGHOST,
                database: process.env.PGDATABASE,
                password: process.env.PGPASSWORD,
                port: process.env.PGPORT
            })
        
            client.connect()
            client.query(query).then(ress => {
        
                // process the results of the query
                const qdata = ress.rows
                qdata.forEach(row => {

                    datalinks = datalinks + "<tr><td>ISBN</td><td id='isbn'>" + row.isbn + "</td></tr>" + 
                                            "<tr><td>Title</td><td>" + row.title + "</td></tr>" + 
                                            "<tr><td>Author</td><td>" + row.author + "</td></tr>" + 
                                            "<tr><td>Genres</td><td>" + row.genres + "</td></tr>" +
                                            "<tr><td>Pages</td><td>" + row.pages + "</td></tr>" +
                                            "<tr><td>Price ($)</td><td id='price'>" + row.price + "</td></tr>" +
                                            "</table></div>" +
                                            "<form action='addToCart()'></form>" +
                                            "<button id='cart' onclick='addToCart("+row.isbn+","+row.price+")'>Add to Cart</button>&nbsp" +
                                            "<button id='close' onclick='closeCartWindow()'>Close Window</button>" +
                                            "</div><script src='../addToCart.js'></script>" + 
                                            "</div></body></html>";

                })

 

                console.log(datalinks)

			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.write(datalinks);
			res.end();	

            })


});

app.route('/reports.js')
.get(function(req,res,next) {
			//Handle the base url request and send the home page
		  fs.readFile("reports.js", function(err, data){
			  if(err){
				  res.statusCode = 500;
				  res.write("Server error.");
				  res.end();
				  return;
			  }
			  res.statusCode = 200;
			  res.setHeader("Content-Type", "javascript");
			  res.write(data);
			  res.end();
		  });
});

app.route('/addinventory.js')
.get(function(req,res,next) {
			//Handle the base url request and send the home page
		  fs.readFile("addinventory.js", function(err, data){
			  if(err){
				  res.statusCode = 500;
				  res.write("Server error.");
				  res.end();
				  return;
			  }
			  res.statusCode = 200;
			  res.setHeader("Content-Type", "javascript");
			  res.write(data);
			  res.end();
		  });
});
  app.route('/login.js')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("login.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });

  app.route('/logout.js')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("logout.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });

  app.route('/users.js')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("users.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });

  app.route('/oldmyorders.js')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("oldmyorders.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });

  app.route('/user.js')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("user.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });

  app.route('/addToCart.js')
  .get(function(req,res,next) {
	  		//Handle the base url add an order the the cart
			fs.readFile("addToCart.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error getting addToCart.js ");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });

  app.route('/register.js')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("register.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });

  app.route('/order.js')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("order.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });  

  app.route('/search.js')
  .get(function(req,res,next) {
	  		//Handle the base url request and send the home page
			fs.readFile("search.js", function(err, data){
				if(err){
					res.statusCode = 500;
					res.write("Server error.");
					res.end();
					return;
				}
				res.statusCode = 200;
				res.setHeader("Content-Type", "javascript");
				res.write(data);
				res.end();
			});
  });

app.route('/restaurants/:id')
.get(function(req, res) {
		//get the list from the restaurant variable
		var data="";
		// Determine if the request is for json or html and respond appropriately
		
		for (let i=0; i < rest.length; i++) {
				if(req.params.id==rest[i].id) {
					
					res.format({
						'text/html':function() {
						data ="<!DOCTYPE html><html><head>" +
						"<style>.hover-menu {float: left; color: #f2f2f2; text-align: center; padding: 14px;text-decoration: none;font-size: 17px;}  .hover-menu:hover {background-color: #ddd;color: black;}</style></head>" +
						"<body onload='init()' style='margin: 0; font-family: Arial, Helvetica, sans-serif;'>" +
						"<style>table, th, td {border: 1px solid black; border-collapse: collapse;}</style>" +
						"<div class='topnav' style='overflow: hidden; background-color: #333;'>" +
						"<a href='http://localhost:3000/welcome.html'><div class='hover-menu'>Welcome</div></a>" +
						"<a href='http://localhost:3000/restaurants'><div class='hover-menu'>Restaurants</div></a>" +
						"<a href='http://localhost:3000/addrestaurant.html'><div class='hover-menu'>Add Restaurant</div></a></div>" +
						"<div id='list' class='listing'>";
						data = data + "<h1 id='restaurant'>" + rest[i].name + "</h1><br>";
						data = data + '<label>Restaurant ID:</label><input id="restid" value="'+rest[i].id +'" disabled></input>' +
									  '<label>Restaurant Name:</label><input id="Name" value="'+rest[i].name +'"></input>' +
									  "<label>Delivery Fee:</label><input type='text' id='Fee' value='"+rest[i].delivery_fee + "'></input>"+
									  "<label>Minimum Order:</label><input id='min' value='"+rest[i].min_order + "'></input><br>" +
									  "<label>New Menu Category</label><input id='newcat'></input>" +
									  "</select><button id='addcat'>Add Category</button><br>" +
									  "<label>Category</label><select id='cat'>";
									  
						for (var y in rest[i].menu) {

							data = data + "<option value='"+ y +"'>"+y+"</option>";
							
						}
						data = data + "</select><label>Name</label><input id='name'></input><label>Description</label><input id='desc'></input><label>Price</label><input id='price'></input><button id='additem'>Add Menu Item</button><br>";
						data = data + "<button id='save'>Save Changes To Server</button><br>";
						// Display the Menu
						for (var y in rest[i].menu) {
						
							if(!(y=="0"||y=="1")) {

								data = data + '<div id="' + y + '" padding="32">';
								data = data +  '<h1 padding="32">' + y + '</h1><table style="width=100%"><tr><th>ID</th><th>Category</th><th>Name</th><th>Description</th><th>Price ($)</th></tr>';
								
								for (var z in rest[i].menu[y]) {
								
									data = data + "<tr><td>" + z + "</td><td>" + y + "</td><td>" + rest[i].menu[y][z].name + '</td><td> ' + 
									rest[i].menu[y][z].description + "</td><td style='text-align:right'>" + rest[i].menu[y][z].price.toFixed(2) + "</td><td></tr>";
					
								}// end for z

								data = data + "</table></div>";

							}// End if for new Restaurants with no menu data

						}// end for y

						data = data + "</body><script src='http://localhost:3000/editmenu.js'></script></html>";
						res.statusCode = 200;
						res.setHeader("Content-Type", "json");
						res.write(data);
						res.end();

					},
					'application/json':function() {
						data = JSON.stringify(rest[i]);
						res.statusCode = 200;
						res.setHeader("Content-Type", "json");
						res.write(data);
						res.end();

					}})	
				}// End if on parameter id
			}// End for on i
	
})
.post(function(req,res){

})
.put(function(req,res){
	req.on("data", chunk => updateMenu(chunk.toString(),response));
	res.statusCode = 200;
	res.end();		
});

function addRestaurant(item, res) {
	
	// Parse the new Restaurant
	var newRestaurant = JSON.parse(item);
	var duplicate = false;

	// loop through existing restaurants and make sure the name is unique
	for (let i=0; i < rest.length; i++) {
			
		if(newRestaurant.name.toString()==rest[i].name.toString()) duplicate = true;
	
	};

	// if there is a duplicate return error else add the new Restaurant
	if(duplicate) {
		res.write("Duplicate");
		res.statusCode=500;
		res.end();
	} else {
		newRestaurant.id = rest.length;
		newRestaurant.menu = "{}";
		rest.push(newRestaurant);
		res.statusCode=200;
		res.write(JSON.stringify(rest[newRestaurant.id]));
		res.end();
	}

}// End addRestaurant

function updateMenu(item, response) {
	
	// Parse the new Restaurant
	var newRestaurant = JSON.parse(item);
	var exists = false;

	// loop through existing restaurants and update the restaurant
	for (let i=0; i < rest.length; i++) {
			
		if(newRestaurant.name.toString()==rest[i].name.toString()) {
			exists = true;
			rest[i] = newRestaurant;
		};
	
	};

	// if there is a duplicate return error else add the new Restaurant
	if(!exists) {
		restStatus = "Unknown Restaurant ID";
		response.statusCode = 404;
	} 

}// End updateMenu



//Get the list of restaurants by doing a directory
//requiring path and fs modules
const path = require('path');
const { Console } = require('console');
const { getSystemErrorMap } = require('util');
const { query } = require("express");
const { debugPort } = require("process");

//joining path of directory 
const directoryPath = path.join(__dirname, './restaurants');

// create restaurant array
const rest = [];

//pass in the directoryPath and get the list of json files
files = fs.readdirSync(directoryPath);
fcount = 0;

// Loop through and get the restaurant data
files.forEach(file => {

	rest[fcount]= require('./restaurants/'+file);
	fcount++;
	
});

app.listen(port);
console.log('Server started at http://localhost:' + port);