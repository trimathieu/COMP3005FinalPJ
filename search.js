
function init() {

    document.getElementById("search").addEventListener("click", findBooks);
    if(checkCookie("username")) {
        document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/orders.html">My Orders </a>' +
        '<a href="/bookstore.html">Bookstore</a>' +
        '<a href="/logout">Logout</a>';
      } else {
        document.getElementById('nav').innerHTML = '<a href="/">Home </a>' +
        '<a href="/bookstore.html">Bookstore</a>' +
        '<a href="/registration.html">Registration</a>' +
        '<a href="/login.html">Login</a>';
      }

}

// Routine to register the user on the server
function findBooks() {

    // Set cookies for the username and password
    let findGenre = document.getElementById("genre").value;
    let findTitle = document.getElementById("title").value;
    let findAuthor = document.getElementById("author").value;
    var c=document.getElementById('like');
    
    // Get the book identifier
    setCookie("searchg", findGenre,1);
    setCookie("searcha", findAuthor,1);
    setCookie("searcht", findTitle,1);
    if (c.checked) setCookie("searchtype","Approx",1)
    if (!c.checked) setCookie("searchtype","Normal",1)

    // Find the Users matching the search String in the Database
    req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

            document.getElementById("list").innerHTML=this.responseText;

		} else if(this.readyState==4 && this.status==500) {

            alert("Error Finding Users");

        }
	}
	
	//req.open("GET", 'http://localhost:3000/search'+'?'+findMe);
    req.open("GET", 'http://localhost:3000/search');
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