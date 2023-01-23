
/* Displayes a view */
displayView = function(view) {
  if (view == "profile") {
    document.getElementById("container").innerHTML = document.getElementById("profileview").innerHTML;
  }
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

validatePassword = function() {
  const inputPass = window.document.getElementById("password-input");
  const validPass = inputPass.validity;
  const inputPassRp = window.document.getElementById("password-input-rp");
  const validPassRp = inputPassRp.validity;
  console.log(document.getElementById("password-input").value.length);
  if (document.getElementById("password-input").value != document.getElementById("password-input-rp").value) {
    inputPassRp.setCustomValidity('Password does not match!!!');
    inputPassRp.reportValidity();
    return false;
  } 
  else if (document.getElementById("password-input").value.length < 8) {
    inputPass.setCustomValidity('Password too short!!!');
    inputPass.reportValidity();
    return false;
  }
  return true;
}

validateEmail = function() {
  const inputEmail = window.document.getElementById("email-input");
  const validEmail = inputEmail.validity;
 
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById("email-input").value)) {
    inputEmail.setCustomValidity('This is not a valid email!!!');
    inputEmail.reportValidity();
    return false;
  }
  return true;
}

validateInputLength = function() {
  const inputSignup = window.document.getElementById("signup-button");
  const validSignUp = inputSignup.validity;
  if (document.getElementById("password-input").value.length == 0 || document.getElementById("firstname-input").value == 0 || document.getElementById("familyname-input").value.length == 0 || document.getElementById("gender-drop").value.length == 0 || document.getElementById("city-input").value.length == 0 || document.getElementById("country-input").value.length == 0){
    inputSignup.setCustomValidity('Every field should be filled!!!');
    inputSignup.reportValidity();
    return false;
  }
  return true;
}

signUp = function() {
  validateEmail();
  if (validatePassword() && validateEmail() && validateInputLength()) {
    const data = {email:document.getElementById("email-input").value, password:document.getElementById("password-input").value, firstname:document.getElementById("firstname-input").value, familyname:document.getElementById("familyname-input").value, gender:document.getElementById("gender-drop").value, city:document.getElementById("city-input").value, country:document.getElementById("country-input").value};

    if (serverstub.signUp(data).success) {
      displayView("profile")
    }
  }
}
 
