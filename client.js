/* Displayes a view */
displayView = function(view) {
  if (view == "profile") {
    document.getElementById("container").innerHTML = document.getElementById("profileview").innerHTML;
    populateInformation();
    updateWall();
  }
};

/* Code is executed as page is loaded */
window.onload = function() {
  let token = localStorage.getItem("token");

  if (token) {
    window.document.getElementById("container").innerHTML = window.document.getElementById("profileview").innerHTML;
    populateInformation();
    updateWall();
  } else {
    window.document.getElementById("container").innerHTML = window.document.getElementById("welcomeview").innerHTML;
  }
}

/* Validation off chosen password */
validatePassword = function() {
  const inputPass = window.document.getElementById("password-input");
  const inputPassRp = window.document.getElementById("password-input-rp");
  
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
    console.log(data);
    /*if (serverstub.signUp(data).success) {
      let token = serverstub.signIn(document.getElementById("email-input").value, document.getElementById("password-input").value).data;
      localStorage.setItem("token", token);
      console.log("token: ", localStorage.getItem("token"));
      displayView("profile")
    } else {
      const inputEmail = window.document.getElementById("email-input");
      inputEmail.setCustomValidity(serverstub.signUp(data).message);
      inputEmail.reportValidity();
    }*/
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

signOut = function() {
  let token = localStorage.getItem("token");
  serverstub.signOut(token);
  localStorage.removeItem('token');
  window.document.getElementById("container").innerHTML = window.document.getElementById("welcomeview").innerHTML;
}
 
showPanel = function(panelName) {
  if(panelName == 'homePanel') {
    document.getElementById("home-panel").style.display = "inline-flex";
    document.getElementById("browse-panel").style.display = "none";
    document.getElementById("account-panel").style.display = "none";
    updateWall();
    populateInformation();
  } else if (panelName == 'browsePanel') {
    document.getElementById("home-panel").style.display = "none";
    document.getElementById("browse-panel").style.display = "block";
    document.getElementById("account-panel").style.display = "none";
  } else if (panelName == 'accountPanel') {
    document.getElementById("home-panel").style.display = "none";
    document.getElementById("browse-panel").style.display = "none";
    document.getElementById("account-panel").style.display = "block";
  }
}

populateInformation = function() {
  let token = localStorage.getItem("token");
  let data = serverstub.getUserDataByToken(token);
  document.getElementById("firstname-text").innerText = data['data'].firstname;
  document.getElementById("familyname-text").innerText = data['data'].familyname;
  document.getElementById("email-text").innerText = data['data'].email;
  document.getElementById("gender-text").innerText = data['data'].gender;
  document.getElementById("city-text").innerText = data['data'].city;
  document.getElementById("country-text").innerText = data['data'].country;
}

changeActPassword = function() {
  let token = localStorage.getItem("token");
  let oldPassword = document.getElementById("old-password-input").value;
  let newPassword = document.getElementById("new-password-input").value;
  let rpNewPassword = document.getElementById("rp-new-password-input").value;
  let changeCheckPass = document.getElementById("change-password-check");

  if(newPassword != rpNewPassword) {
    changeCheckPass.setCustomValidity('New Password does not match!!!');
    changeCheckPass.reportValidity();
    return false;
  } else if (document.getElementById("new-password-input").value.length < 8) {
    changeCheckPass.setCustomValidity('Password too short!!!');
    changeCheckPass.reportValidity();
    return false;
  } 

  let res = serverstub.changePassword(token, oldPassword, newPassword);

  if(!res['success']) {
    changeCheckPass.setCustomValidity(res['message']);
    changeCheckPass.reportValidity();
    return false;
  }else if(res['success']){
    changeCheckPass.setCustomValidity(res['message']);
    changeCheckPass.reportValidity();
    return true;
  }
}

updateWall = function() {
  let token = localStorage.getItem("token");
  let data = serverstub.getUserMessagesByToken(token)['data'];
  let messageList = document.getElementById("user-wall-container");
  messageList.innerHTML = '';
  let i =0;
  for(const obj of data) {
    let msg = obj.content;
    messageList.innerHTML += '<div id="wall-msg-container'+i+'"><p>'+msg+'</p></div>';
    let id = "wall-msg-container"+i;
 
    document.getElementById(id).style.height = 'fit-content(6em)';
    document.getElementById(id).style.border = '1px solid black';
    document.getElementById(id).style.marginBottom = '10px';
    document.getElementById(id).style.backgroundColor = 'white';
    document.getElementById(id).style.borderRadius = '5px';
    document.getElementById(id).style.padding = "10px 10px 10px 10px";
    i++;
  }
}

postMessage = function() {
  let token = localStorage.getItem("token");
  let msg = document.getElementById('user-text-box').value;
  console.log(msg);
  let email = serverstub.getUserDataByToken(token)['data'].email;
  let data = serverstub.postMessage(token, msg, email);
  if(data.success) {
    document.getElementById('user-text-box').value = "You posted a message!";
  }
  updateWall();
}

getUserInformation = function() {
  const token = localStorage.getItem("token");
  let email = document.getElementById("search-user-input").value;
  let userData = serverstub.getUserDataByEmail(token, email);
  document.getElementById("user-container").style.display = "inline-flex";
  document.getElementById("friend-firstname-text").innerText = userData['data'].firstname;
  document.getElementById("friend-familyname-text").innerText = userData['data'].familyname;
  document.getElementById("friend-email-text").innerText = userData['data'].email;
  document.getElementById("friend-gender-text").innerText = userData['data'].gender;
  document.getElementById("friend-city-text").innerText = userData['data'].city;
  document.getElementById("friend-country-text").innerText = userData['data'].country;

  updateUserWall();
}

updateUserWall = function() {
  let token = localStorage.getItem("token");
  let email = document.getElementById("friend-email-text").innerText;
  let data = serverstub.getUserMessagesByEmail(token, email)['data'];
  let messageList = document.getElementById("friend-wall-container");
  messageList.innerHTML = '';
  let i = 0;
  for(const obj of data) {
    let msg = obj.content;
    messageList.innerHTML += '<div id="friend-wall-msg-container'+i+'"><p>'+msg+'</p></div>';
    let id = "friend-wall-msg-container"+i;
 
    document.getElementById(id).style.height = 'fit-content(6em)';
    document.getElementById(id).style.border = '1px solid black';
    document.getElementById(id).style.marginBottom = '10px';
    document.getElementById(id).style.backgroundColor = 'white';
    document.getElementById(id).style.borderRadius = '5px';
    document.getElementById(id).style.padding = "10px 10px 10px 10px";
    i++;
  }
}

sendMessage = function() {
  let token = localStorage.getItem("token");
  let msg = document.getElementById('friend-text-box').value;
  let email = document.getElementById("friend-email-text").innerText;
  let data = serverstub.postMessage(token, msg, email);
  if(data.success) {
    document.getElementById('friend-text-box').value = "You sent a message!";
  }
  updateUserWall();
}
