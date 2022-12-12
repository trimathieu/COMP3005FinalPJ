
function init() {

    console.log("Welcome"+getCookie("username"))
    if(checkCookie("username")) {
      console.log("Welcome"+getCookie("username"));
      document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/myorders.html">My Orders </a>' +
      '<a href="/bookstore.html">Bookstore</a>' +
      '<a href="/logout.html">Logout</a>';
    }

}

function closeCartWindow() {

    alert("Window is closing")
    this.close()
}

// Routine to register the user on the server
function addToCart(x,y) {

    // Check that user is logged in


    // Get the book identifier
    setCookie("isbn", x,1);
    setCookie("price", y,1);

    // Register the User in the Database
  req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			alert("Book added to cart")


     // window.open("http://localhost:3000/users/"+getCookie("username"));

		} else if(this.readyState==4 && this.status==500) {
            alert("Failed to add book - duplicate entry");
 
        }
	}
					
	req.open("POST", 'http://localhost:3000/addtocart');
	req.setRequestHeader("Content-Type", "text/html");
	req.send();
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function checkCookie() {
    let username = getCookie("username");
    if (username != "") {
     return true;
    } else {
     return false;
    }
  }