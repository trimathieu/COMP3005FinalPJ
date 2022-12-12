function init() {
  document.getElementById("addinventory").addEventListener("click", addbooks);

  if(checkCookie("username")) {
    console.log("Welcome"+getCookie("username"));
    document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/reports.html">Reports</a>' +
    '<a href="/inventory.html">Add Inventory</a>' +
    '<a href="/logout">Logout</a>';
  }

}

// Routine to register the user on the server
function addbooks() {

  // Set cookies for the username and password
  setCookie("in_isbn", document.getElementById("isbn").value,1);
  setCookie("in_aut", document.getElementById("author").value,1);
  setCookie("in_tit", document.getElementById("title").value,1);
  setCookie("in_gen", document.getElementById("genre").value,1);
  setCookie("in_pgs", document.getElementById("pages").value,1);
  setCookie("in_pr", document.getElementById("price").value,1);
  setCookie("in_qty", document.getElementById("quantity").value,1);
  setCookie("in_pub", document.getElementById("publisher").selectedIndex+1,1);

  // Register the User in the Database
req = new XMLHttpRequest();
req.onreadystatechange = function() {
  if(this.readyState==4 && this.status==200){
    alert("Sucessfully Added Books")
          document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/users">Users </a>' +
          '<a href="/orderform.html">Order Form</a>' +
          '<a href="/logout">Logout</a>';

  } else if(this.readyState==4 && this.status==500) {
          alert("Duplicate User");
          setCookie("username",document.getElementById("uname"),-1);
          setCookie("password",document.getElementById("pwd"),-1);
          document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/users">Users </a>' +
          '<a href="/registration.html">Registration</a>' +
          '<a href="/logout">Logout</a>';
      }
}
        
req.open("POST", 'http://localhost:3000/addbooks');
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