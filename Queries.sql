// Query for the user login to get the user
	let query = "select * from customer where username='" + cookies.username +
                "' and password='" + cookies.password + "'";

// Create the new user
   const q2 = "insert into customer (username,password) values ('"+ cookies.username + "','" + cookies.password + "')"
				
// Query for the Customer Orders for Checkout
	let query = "select * from customer_order where customer_order.user_id=(select distinct userid from customer where status='CART' and username='"+
				 cookies.username + "')";
				 
// Query to select the customer orders for the user who is currently logged in
	let query = "select * from customer_order where customer_order.user_id=(select distinct userid from customer where username='"+
				 cookies.username + "')";	

// Query to insert a book into the users cart
q2 = "insert into customer_order (user_id,item_id, isbn,quantity,track_no,ordertotal,status) " +
			"values ('"+ row.userid + "','1','" + cookies.isbn +  "','1','1','" + cookies.price + "','CART')"})

// Create to insert a new book (cookies are the values passed from the client to the server
const q2 = "insert into book (isbn, title, pubid, author, pages, price, quantity, genres) values ('"
				 + cookies.in_isbn + "','" 
				 + cookies.in_tit + "','"
				 + cookies.in_pub + "','" 
				 + cookies.in_aut + "','"	 
				 + cookies.in_pgs + "','" 
				 + cookies.in_pr + "','"	 
				 + cookies.in_qty + "','"   
				 + cookies.in_gen + "')"
				 
// Query to get the book details for a book found in the book search
let query = "select * from book where isbn='"+req.params.id+"'";


// Query to delete a book from the users cart
let query = "delete from customer_order where orderid='"+req.params.id + 
			            "' and customer_order.user_id=(select user_id from customer where username='"+cookies.username+"')";

// Query to build the search string for the normal search and for the approximate search
						
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
			
// Query to get the orders that are considered sales (not in the car)
	let query = "select * from customer_order where NOT status='CART'"	

// Query to get the total sales
	let query = "select sum(totalcost) from customer_order where NOT status='CART'"	
	
// Query to get the publishing costs
select c.orderid, (float)(c.ordertotal)*(float)(p.pcttopub) from customer_order c, book p where p.isbn=c.isbn and NOT c.status='CART'

