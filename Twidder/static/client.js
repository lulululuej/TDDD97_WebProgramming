

/* Displayes a view */
displayView = function(view) {
  if (view == "profile") {
    const token = localStorage.getItem("token");
    document.getElementById("container").innerHTML = document.getElementById("profileview").innerHTML;
    populateInformation();
    updateWall();
  }
};

/* Code is executed as page is loaded */
window.onload = function() {
  let token = localStorage.getItem("token");
  console.log("onload: ", token);
  if (token) {
    window.document.getElementById("container").innerHTML = window.document.getElementById("profileview").innerHTML;
    showPanel(localStorage.getItem('lastPanel'));
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
signUp = function() {
  if (validatePassword() && validateEmail("Sign Up") && validateInputLength()) {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    const signup_data = {"email": email, "password": password, "firstname": document.getElementById("firstname-input").value, "familyname": document.getElementById("familyname-input").value, "gender": document.getElementById("gender-drop").value, "city": document.getElementById("city-input").value, "country": document.getElementById("country-input").value};
    
    let signup_req = new XMLHttpRequest();
    signup_req.open("POST", "/sign_up/", true);
    signup_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    signup_req.send(JSON.stringify(signup_data));

    signup_req.onreadystatechange =  function(){
      if (signup_req.readyState == 4){
        if (signup_req.status == 201){
          const signin_data = {"email": email, "password": password};
          console.log(signin_data);
          let signin_req = new XMLHttpRequest();
          signin_req.open("POST", "/sign_in/", true);
          signin_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
          signin_req.send(JSON.stringify(signin_data));

          signin_req.onreadystatechange =  function(){
            if (signin_req.readyState == 4){
                if (signin_req.status == 201){
                    let token = JSON.parse(signin_req.responseText)['data'];
                    localStorage.setItem("token", token);
                    console.log("signup: ", localStorage.getItem("token"));
                    displayView("profile", token);
                    let socket = io.connect();
                    socket.on('connect', function() {
                      socket.emit('connection', {data: 'i am connected'});
                    });
                }else {
                  const inputEmail = window.document.getElementById("email-input");
                  let resp = JSON.parse(signin_req.responseText);
                  console.log(resp);
                  inputEmail.setCustomValidity(resp['message']);
                  inputEmail.reportValidity();
                }
    
            }
    
        }
      } else  {
        let resp = JSON.parse(signup_req.responseText);
        console.log(resp);
        inputEmail.setCustomValidity(resp['message']);
        inputEmail.reportValidity();
                
      }
    }
   }
  }
}

signIn = function() {
  validateEmail("Sign In");
  let username = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;

  const signin_data = {"email": username, "password": password};
  let signin_req = new XMLHttpRequest();
  signin_req.open("POST", "/sign_in/", true);
  signin_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  signin_req.send(JSON.stringify(signin_data));

  signin_req.onreadystatechange =  function(){
    if (signin_req.readyState == 4){
        if (signin_req.status == 201){
            let token = JSON.parse(signin_req.responseText)['data'];
            localStorage.setItem("token", token);
            console.log("signin: ", localStorage.getItem("token"));
            displayView("profile", token);
            let socket = io();
            socket.on('connect', function() {
              socket.emit('connection', {data: 'i am connected'});
            });
        }else {
          let resp = JSON.parse(signin_req.responseText);

          const loginButton = window.document.getElementById("login-button");
          loginButton.setCustomValidity(resp['message']);
          loginButton.reportValidity();
          return;
        }

    }

  }
}

signOut = function() {
  let signout_req = new XMLHttpRequest();
  signout_req.open("PATCH", "/sign_out/", true);
  signout_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  signout_req.setRequestHeader("Authorization", localStorage.getItem("token"));
  signout_req.send();

  signout_req.onreadystatechange =  function(){
    if (signout_req.readyState == 4){
        if (signout_req.status == 204){
          localStorage.removeItem("token");
          window.document.getElementById("container").innerHTML = window.document.getElementById("welcomeview").innerHTML;
        }else {
          let resp = JSON.parse(signout_req.responseText);
          console.log(resp.message);
          return;
        }

    }

  }
}
 
showPanel = function(panelName) {
  localStorage.setItem('lastPanel', panelName);
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
  token = localStorage.getItem("token");
  let getdata_req = new XMLHttpRequest();
  getdata_req.open("GET", "/get_user_data_by_token", true);
  getdata_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  getdata_req.setRequestHeader("Authorization", token);

  getdata_req.send();

  getdata_req.onreadystatechange =  function(){
    if (getdata_req.readyState == 4){
      if (getdata_req.status == 200) {
        let resp = JSON.parse(getdata_req.responseText);
        let data = resp['data'];
        document.getElementById("firstname-text").innerText = data.firstname;
        document.getElementById("familyname-text").innerText = data.familyname;
        document.getElementById("email-text").innerText = data.email;
        document.getElementById("gender-text").innerText = data.gender;
        document.getElementById("city-text").innerText = data.city;
        document.getElementById("country-text").innerText = data.country;
      } else {
        let resp = JSON.parse(getdata_req.responseText);
        console.log(resp['message']);
      }
    }
  }
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
  const pw_data = {"oldpw": oldPassword, "newpw": newPassword}
  let changepw_req = new XMLHttpRequest();
  changepw_req.open("POST", "/change_password/", true);
  changepw_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  changepw_req.setRequestHeader("Authorization", token);

  changepw_req.send(JSON.stringify(pw_data));

  changepw_req.onreadystatechange =  function(){
    if (changepw_req.readyState == 4){
      if (changepw_req.status == 201) {
        resp = JSON.parse(changepw_req.responseText);
        changeCheckPass.setCustomValidity(resp['message']);
        changeCheckPass.reportValidity();
        return true;
      } else {
        let resp = JSON.parse(getdata_req.responseText);
        changeCheckPass.setCustomValidity(resp['message']);
        changeCheckPass.reportValidity();
        return false;
      }
    }
  }
}

updateWall = function() {
  const token = localStorage.getItem("token");
  let getmessages_req = new XMLHttpRequest();
  getmessages_req.open("GET", "/get_user_messages_by_token/", true);
  getmessages_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  getmessages_req.setRequestHeader("Authorization", token);

  getmessages_req.send();

  getmessages_req.onreadystatechange =  function(){
    if (getmessages_req.readyState == 4){
      if (getmessages_req.status == 200) {
        let resp = JSON.parse(getmessages_req.responseText);
        let messages = resp['data'];
        let messageList = document.getElementById("user-wall-container");
        messageList.innerHTML = '';
        let i =0;
        for(const obj of messages) {
          let msg = obj.content;
          let sender = obj.writer;
          messageList.innerHTML += '<div id="wall-msg-container'+i+'"><p>'+ sender + ': ' + msg+'</p></div>';
          let id = "wall-msg-container"+i;
      
          document.getElementById(id).style.height = 'fit-content(6em)';
          document.getElementById(id).style.border = '1px solid black';
          document.getElementById(id).style.marginBottom = '10px';
          document.getElementById(id).style.backgroundColor = 'white';
          document.getElementById(id).style.borderRadius = '5px';
          document.getElementById(id).style.padding = "10px 10px 10px 10px";
          i++;
        }
      } else {
        let resp = JSON.parse(getmessages_req.responseText);     
        console.log(resp);
      }

    }
  }
}

postMessage = function() {
  let token = localStorage.getItem("token");
  let msg = document.getElementById('user-text-box').value;
 
  if(msg.length == 0) {
    document.getElementById('user-text-box').value = "No empty message!!!";
    return;
  }
  let getdata_req = new XMLHttpRequest();
  getdata_req.open("GET", "/get_user_data_by_token/", true);
  getdata_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  getdata_req.setRequestHeader("Authorization", token);

  getdata_req.send();

  getdata_req.onreadystatechange =  function(){
    if (getdata_req.readyState == 4){
      if (getdata_req.status == 200) {
        let resp = JSON.parse(getdata_req.responseText);
        let email = resp['data'].email;

        let data = {"message": msg, "email": email}
        let postmessage_req = new XMLHttpRequest();
        postmessage_req.open("POST", "/post_message/", true);
        postmessage_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        postmessage_req.setRequestHeader("Authorization", token);
        postmessage_req.send(JSON.stringify(data));

        postmessage_req.onreadystatechange =  function(){
          if (postmessage_req.readyState == 4){
            if (postmessage_req.status == 201) {
              document.getElementById('user-text-box').value = "You posted a message!";
              updateWall();
            }
            else {
              let resp = JSON.parse(postmessage_req.responseText);
              console.log(resp['message']);
            }
          }
        }
      } else {
        let resp = JSON.parse(getdata_req.responseText);
        console.log(resp['message']);
      }
    }
  }
}

getUserInformation = function() {
  const token = localStorage.getItem("token");
  let email = document.getElementById("search-user-input").value;

  let getdata_req = new XMLHttpRequest();
  getdata_req.open("GET", "/get_user_data_by_email/" + email, true);
  getdata_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  getdata_req.setRequestHeader("Authorization", token);

  getdata_req.send();

  getdata_req.onreadystatechange =  function(){
    if (getdata_req.readyState == 4){
      if (getdata_req.status == 200) {
        let resp = JSON.parse(getdata_req.responseText);
        let data = resp['data'];

        document.getElementById("user-container").style.display = "inline-flex";
        document.getElementById("friend-firstname-text").innerText = data.firstname;
        document.getElementById("friend-familyname-text").innerText = data.familyname;
        document.getElementById("friend-email-text").innerText = data.email;
        document.getElementById("friend-gender-text").innerText = data.gender;
        document.getElementById("friend-city-text").innerText = data.city;
        document.getElementById("friend-country-text").innerText = data.country;

        updateUserWall();
      } else {
        let resp = JSON.parse(getdata_req.responseText);
        console.log(resp['message']);
      }
    }
  }
}

updateUserWall = function() {
  let token = localStorage.getItem("token");
  let email = document.getElementById("friend-email-text").innerText;

  let getmessages_req = new XMLHttpRequest();
  getmessages_req.open("GET", "/get_user_messages_by_email/" + email, true);
  getmessages_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  getmessages_req.setRequestHeader("Authorization", token);

  getmessages_req.send();

  getmessages_req.onreadystatechange =  function(){
    if (getmessages_req.readyState == 4){
      if (getmessages_req.status == 200) {
        let resp = JSON.parse(getmessages_req.responseText);
        let messages = resp['data'];
        let messageList = document.getElementById("friend-wall-container");
        messageList.innerHTML = '';
        let i = 0;
        for(const obj of messages) {
          let msg = obj.content;
          console.log(obj);
          let sender = obj.writer;
          messageList.innerHTML += '<div id="friend-wall-msg-container'+i+'"><p>'+ sender + ': ' + msg+'</p></div>';
          let id = "friend-wall-msg-container"+i;
       
          document.getElementById(id).style.height = 'fit-content(6em)';
          document.getElementById(id).style.border = '1px solid black';
          document.getElementById(id).style.marginBottom = '10px';
          document.getElementById(id).style.backgroundColor = 'white';
          document.getElementById(id).style.borderRadius = '5px';
          document.getElementById(id).style.padding = "10px 10px 10px 10px";
          i++;
        }
      } else {
        let resp = JSON.parse(getmessages_req.responseText);     
        console.log(resp);
      }

    }
  }
}

sendMessage = function() {
  let token = localStorage.getItem("token");
  let msg = document.getElementById('friend-text-box').value;
  let email = document.getElementById("friend-email-text").innerText;

  let data = {"message": msg, "email": email};
  let postmessage_req = new XMLHttpRequest();
  postmessage_req.open("POST", "/post_message/", true);
  postmessage_req.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  postmessage_req.setRequestHeader("Authorization", token);
  postmessage_req.send(JSON.stringify(data));

  postmessage_req.onreadystatechange =  function(){
    if (postmessage_req.readyState == 4){
      if (postmessage_req.status == 201) {
        document.getElementById('friend-text-box').value = "You sent a message!";
        updateUserWall();
      }
      else {
        let resp = JSON.parse(postmessage_req.responseText);
        console.log(resp['message']);
      }
    }
  }
}