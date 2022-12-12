// For a user who is not logged in and does not have private button or findUsers

function init() {

    if(checkCookie("username")) {
        console.log("Welcome"+getCookie("username"));
        document.getElementById('nav').innerHTML = '<a href="/">Home </a><a href="/users">Users </a>' +
        '<a href="/orderform.html">Order Form</a>' +
        '<a href="/users/'+getCookie("username")+'">User Profile</a>' +
        '<a href="/logout">Logout</a>';
      }

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