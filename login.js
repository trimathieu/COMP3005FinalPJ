
function init() {
    document.getElementById("login").addEventListener("click", validateUser);
}

// Routine to validate user credentials and configure menu as appropriate
function validateUser() {

//
// Set cookies
// Set cookies for the username and password
    setCookie("username", document.getElementById("username").value,1);
    setCookie("password", document.getElementById("password").value,1);

//  Validate the credentials
    req = new XMLHttpRequest();
	req.onreadystatechange = function() {

		if(this.readyState==4 && this.status==200){

            var user = getCookie("username");
            document.getElementById('nav').innerHTML = '<a href="/">Home </a>' + 
            '<a href="/orders.html">My Orders </a>' +
            '<a href="/bookstore.html">Bookstore</a>' +
            '<a href="/logout">Logout</a>';

           // window.open("http://localhost:3000/users/"+getCookie("username"));

    } else if(this.readyState==4 && this.status==201){

              var user = getCookie("username");
              document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/owner">Owner Profile </a>' +
              '<a href="/inventory.html">Add Inventory</a>' +
              '<a href="/reports.html">Reports</a>' +
              '<a href="/logout">Logout</a>';
  
            //  window.open("http://localhost:3000/owners/"+getCookie("username"));

		} else if (this.readyState==4 && this.status==404){

            alert("Invalid Username or Password. Please try again.");
            setCookie("username", document.getElementById("username").value,-1);
            setCookie("password", document.getElementById("password").value,-1);

        }
	}
					
	req.open("GET", `http://localhost:3000/login`);
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