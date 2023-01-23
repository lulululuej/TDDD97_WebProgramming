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
   // serverstub.signOut(token);
    //window.document.getElementById("container").innerHTML = window.document.getElementById("welcomeview").innerHTML;
    window.document.getElementById("container").innerHTML = window.document.getElementById("profileview").innerHTML;
  } else {
    window.document.getElementById("container").innerHTML = window.document.getElementById("welcomeview").innerHTML;
  }
}

/* Validation off chosen password */
validatePassword = function() {
  const inputPass = window.document.getElementById("password-input");
  //const validPass = inputPass.validity;
  const inputPassRp = window.document.getElementById("password-input-rp");
  //const validPassRp = inputPassRp.validity;
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

/* Email validation */
validateEmail = function(process) {
  let inputEmail = "";
  let email = "";
  if (process == "Sign Up") {
    inputEmail = window.document.getElementById("email-input");
    email = document.getElementById("email-input").value;
  } else if (process == "Sign In") {
    inputEmail = window.document.getElementById("login-email");
    email = document.getElementById("login-email").value;
  }
  const validEmail = inputEmail.validity;

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    inputEmail.setCustomValidity('This is not a valid email!!!');
    inputEmail.reportValidity();
    return false;
  }
  return true;

}

/* Validation of input. There should be no blanks */
validateInputLength = function() {
  const inputSignup = window.document.getElementById("signup-button");
  //const validSignUp = inputSignup.validity;
  if (document.getElementById("password-input").value.length == 0 || document.getElementById("firstname-input").value == 0 || document.getElementById("familyname-input").value.length == 0 || document.getElementById("gender-drop").value.length == 0 || document.getElementById("city-input").value.length == 0 || document.getElementById("country-input").value.length == 0){
    inputSignup.setCustomValidity('Every field should be filled!!!');
    inputSignup.reportValidity();
    return false;
  }
  return true;
}

/* Signup from client-side */
signUp = function() {;
  if (validatePassword() && validateEmail("Sign Up") && validateInputLength()) {
    
    const data = {email:document.getElementById("email-input").value, password:document.getElementById("password-input").value, firstname:document.getElementById("firstname-input").value, familyname:document.getElementById("familyname-input").value, gender:document.getElementById("gender-drop").value, city:document.getElementById("city-input").value, country:document.getElementById("country-input").value};

    if (serverstub.signUp(data).success) {
      let token = serverstub.signIn(document.getElementById("email-input").value, document.getElementById("password-input").value).data;
      localStorage.setItem("token", token);
      console.log("token: ", localStorage.getItem("token"));
      displayView("profile")
    } else {
      const inputEmail = window.document.getElementById("email-input");
      inputEmail.setCustomValidity(serverstub.signUp(data).message);
      inputEmail.reportValidity();
    }
  }
}

signIn = function() {
  validateEmail("Sign In");
  let username = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;
  let data = serverstub.signIn(username, password);
  if (data.success) {
    let token = serverstub.signIn(username, password).data;
    localStorage.setItem("token", token);
    displayView("profile");
  } else {
    const loginButton = window.document.getElementById("login-button");
    loginButton.setCustomValidity(serverstub.signIn(data).message);
    loginButton.reportValidity();
    return;
  }
}
 
