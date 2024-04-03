import {
    URL_CLIENT_LOCAL,
    URL_SERVER_LOCAL
} from './const.js';
import {setCookie,deleteCookie} from './storeCookie.js';
import  getUserInfo from './Users/user.js';
import {setSession} from './storeSession.js';
import {checkLogin} from '../js/checkLogged.js';


console.log("Login js");
const url = new URL(window.location.href);
var previousURL = sessionStorage.getItem("pageNotLoggedPath");
const get = document.getElementById.bind(document);//Get ID
const query = document.querySelector.bind(document);//Query
const queryAll = document.querySelectorAll.bind(document);
var userAPI = URL_SERVER_LOCAL + "/api/Users"

//Variables

var footerEl = query(".register__msg-modal");
var loginEL = query(".header__navbar-item-login");
var registerEL = query(".header__navbar-register");
var btnRegister = query(".auth-form__controls-register");

var registerForm = query(".register-form");
var loginForm = query(".login-form");

// var login form
var btnLogin = query(".auth-form__controls-login");
var btnBack = query(".auth-form__controls-back");

var email = query(".auth-form__email");
var password = query(".auth-form__password");
//var resgister form

var emailInputReg = query(".register__input-email");
var passwordInputReg = query(".register__input-password");
var cPasswordInputReg = query(".register__input-cpassword");


var htmlModalSuccessRegister = `<div class="modal__message-register">
<div class="modal__body">
    <div class="modal__success-warp">
        <div class="modal__success">
            <div class="icon__wrap">
                <i class="fa-solid fa-check modal__success-icon"></i>
            </div>
            <span class="modal__success-text">Đăng ký thành công</span>
        </div>
    </div>
</div>
</div> `;

async function start(){
    var infoLog =  await checkLogin();

    if(infoLog.isLogged) {
        var pathname = window.location.pathname;
        if(pathname === "/pages/login/login.html"){
            window.location.href = URL_CLIENT_LOCAL;
        }
        
    }else{
        
        console.log("not yet");
    }
}

start();

//LOGIN

var authForm = query(".auth-form");
var modalEL = query(".modal");

loginEL.onclick = function() {

    
    modalEL.classList.add('open');
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
}

modalEL.addEventListener("click", modalClick)
authForm.addEventListener('click', function(e) {
    e.stopPropagation();
    return false;
})

loginForm.addEventListener('click', function(e) {
    e.stopPropagation();
    return false;
})
function modalClick(){
    console.log('open');
    modalEL.classList.remove('open')
}

//Hande btn login
async function handleLoginClick(){

    
    var user = {};
    var data = {
        email: email.value,
        password: password.value
    }

    var isValid = validateForm(data);

    if(isValid){
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        
        await fetch(userAPI+"/login", options)
            .then(response => {
                if(response.ok) return  response.json()
                else{
                    alert("Kiểm tra lại thông tin đăng nhập")
                }
               
            }
            )
            .then( async response =>{

                deleteCookie('access_token');

                console.log(response);
                setCookie("access_token", response.access_token, 30);
                modalEL.classList.remove('open')

                var user = await  getUserInfo(response.access_token);
                setCookie("userId", user.id);
                
                if(previousURL!==null){
                    location.href = previousURL;
                }else{
                    location.href = "/";
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
    }
   
            
}

btnLogin.addEventListener("click",handleLoginClick);

password.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      handleLoginClick();
    }
  });


  //Handle back button

  btnBack.onclick = ()=>{
      window.location.href = URL_CLIENT_LOCAL;
  }

  function validateForm(data){
    if(data.email === "" || data.password == ""){
        alert("Vui lòng không để trống thông tin !!!");
        return false;
    }
    return true
  }

  //REGISTER

  registerEL.onclick = function() {

    modalEL.classList.add('open');
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }

  //Handle button register 

  btnRegister.onclick = async function(){
        
        var data = {
            email : emailInputReg.value,
            password: passwordInputReg.value,
            confirmPassword : cPasswordInputReg.value
        }

        var validEmpty = validateRegisterForm(data);

        if(validEmpty){

           var isExists = await checkExistsEmail(data.email);
           var isMatchPassword = matchPassword(data.password, data.confirmPassword);
           
           var validEmail = ValidateEmail(data.email)
           
           if(!validEmail){
                alert("Email không hợp lệ")
                emailInputReg.focus();
            }else if(isExists){
                alert("Email đã tồn tại")
            }else if( !isMatchPassword){
               alert("Mật khẩu không trùng khớp !")
            }else{
                await registerUser(data);
            }
        }
  }

  //validate emails exists 

  async function checkExistsEmail(email){
       
        var data =  await fetch(userAPI+`/CheckEmailExists?email=${email}`)
        .then(res => {
            return res.json()
        })
    
        var dataJson = await data
        return dataJson;
        
  };

  //Validate form register

  function validateRegisterForm(data){
    if(data.email === "" || data.password == "" || data.rePasswordInputReg){
        alert("Vui lòng không để trống các thông tin !!!");
        emailInputReg.focus();
        
        return false;
    }
    return true
  }

  //Validate match password

  function matchPassword(pw1,pw2){
      if(pw1 !== pw2){
          return false;
      }else{
          return true;
      }
  }

  // handle function register user

  async function registerUser(data){
      console.log(data);
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

        await fetch(userAPI +"/register",options)
            .then(res =>{
                if(res.status === 200){
                    displayMessage();
                    mo
                }
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            })
  }

function ValidateEmail(mail) 
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    
    return (false)
}

// Display modal register success 

function displayMessage(){
    
    footerEl.innerHTML += htmlModalSuccessRegister;
    var modalEL = query(".modal");
    var msgModal = query('.modal__message-register');
    var loginEL = query(".header__navbar-item-login");


    modalEL.classList.remove('open');
    msgModal.classList.add("open");
    
    setTimeout(()=>{
        msgModal.classList.remove("open");
       loginEL.click();
    },1300);

}
