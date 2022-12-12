function init() {

  document.getElementById("register").addEventListener("click", registerUser);

  if(checkCookie("username")) {

      console.log("Welcome"+getCookie("username"));

      document.getElementById('nav').innerHTML = '<a href="/">Home </a>' +

      '<a href="/myorders.html">My Orders </a>' +

      '<a href="/bookstore.html">Bookstore</a>' +

      '<a href="/logout.html">Logout</a>';

    } else {

      document.getElementById('nav').innerHTML = '<a href="/">Home </a>' +

      '<a href="/bookstore.html">Bookstore</a>' +

      '<a href="/registration.html">Registration</a>' +

      '<a href="/login.html">Login</a>';

    }



}



// Routine to register the user on the server

function registerUser() {



  // Set cookies for the username and password

  setCookie("username", document.getElementById("uname").value,1);

  setCookie("password", document.getElementById("pwd").value,1);

  setCookie("street1", document.getElementById("street").value,1);

  setCookie("unit1", document.getElementById("unit").value,1);

  setCookie("city1", document.getElementById("city").value,1);

  setCookie("state1", document.getElementById("state").value,1);

  setCookie("zip1", document.getElementById("zip").value,1);

  setCookie("country2", document.getElementById("country").value,1);

  setCookie("street2", document.getElementById("street2").value,1);

  setCookie("unit2", document.getElementById("unit2").value,1);

  setCookie("city2", document.getElementById("city2").value,1);

  setCookie("state2", document.getElementById("state2").value,1);

  setCookie("zip2", document.getElementById("zip2").value,1);

  setCookie("country2", document.getElementById("country2").value,1);




  // Register the User in the Database

req = new XMLHttpRequest();

req.onreadystatechange = function() {

  if(this.readyState==4 && this.status==200){

    alert("User Registration Complete")

    document.getElementById('nav').innerHTML = '<a href="/">Home </a>' +

    '<a href="/myorders.html">My Orders </a>' +

    '<a href="/bookstore.html">Bookstore </a>' +

    '<a href="/logout.html">Logout </a>';



   // window.open("http://localhost:3000/users/"+getCookie("username"));



  } else if(this.readyState==4 && this.status==500) {

          alert("Duplicate User");

          setCookie("username",document.getElementById("uname"),-1);

          setCookie("password",document.getElementById("pwd"),-1);

          document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/bookstore.html">Bookstore </a>' +

          '<a href="/registration.html">Registration</a>' +

          '<a href="/logout">Logout</a>';

      }

}

       

req.open("POST", 'http://localhost:3000/register');

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

