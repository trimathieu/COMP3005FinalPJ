
function init() {
 
    if(checkCookie("username")) {

        document.getElementById("private").addEventListener("click", updatePrivacy);
        document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/users">Users </a>' +
        '<a href="/orderform.html">Order Form</a>' +
        '<a href="/users/'+getCookie("username")+'">User Profile</a>' +
        '<a href="/logout">Logout</a>';
      } else {
        document.getElementById("search").addEventListener("click", findUsers);
      }
      
}

// Routine to register the user on the server
function findUsers() {

    // Set cookies for the username and password
    let findMe = document.getElementById("searchString").value;

    // Find the Users matching the search String in the Database
    req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

            document.getElementById("list").innerHTML=this.responseText;

		} else if(this.readyState==4 && this.status==500) {

            alert("Error Finding Users");

        }
	}
	
	req.open("GET", 'http://localhost:3000/users'+'?'+findMe);
	req.setRequestHeader("Content-Type", "text/html");
	req.send();
}

// Routine to register the user on the server
function updatePrivacy() {

    // Submit Put Request to toggle privacy for this user
    req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

            document.write(this.responseText);
            location.reload();

		} else if(this.readyState==4 && this.status==500) {

            alert("Error Changing Privacy");

        }
	}
	
	req.open("PUT", 'http://localhost:3000/users/'+getCookie("username"));
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