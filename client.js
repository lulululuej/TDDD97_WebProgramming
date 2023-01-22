
/* Displayes a view */
displayView = function() {

};

/* Code is executed as page is loaded */
window.onload = function() {
  let token = localStorage.getItem("token");

  if (token) {
    window.document.getElementById("container").innerHTML = window.document.getElementById("profileview").innerHTML;
  } else {
    window.document.getElementById("container").innerHTML = window.document.getElementById("welcomeview").innerHTML;
  }
}