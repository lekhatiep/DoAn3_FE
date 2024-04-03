import {URL_SERVER_LOCAL} from '../const.js'
import {getCookie,setCookie,deleteCookie} from '../storeCookie.js';

export {renderInfoUser} 



var userApi = URL_SERVER_LOCAL + "/api/Users";
const query = document.querySelector.bind(document);//Query

var btnRegister = query(".header__navbar-register");
var btnLogin = query(".header__navbar-item-login");
var navUser = query('.header__navbar-user');
var navUserName = query('.header__navbar-user-name');


//  //Check user login  
// var infoLog =  await checkLogin();

// if(infoLog.isLogged) {
//     getUserInfo(infoLog.accessToken);
//     console.log("Login")
// }else{
//     console.log("not yet");
// }


async function getUserInfo(accessToken){

    var accessToken = getCookie('access_token');
    var response = await fetch(userApi +'/GetInfo', {
                headers: {
                    'Authorization' : `Bearer ${accessToken}`
                },
            })
            .then(response => response.json())
            .then((data)=>{
                return data;
            })
    return await response;
    
}


function renderInfoUser(accessToken){
   
    console.log(navUserName);

    fetch(userApi +'/GetInfo', {
        headers: {
            'Authorization' : `Bearer ${accessToken}`
        },
    })
    .then(response => response.json())
    .then((data)=>{
        navUserName.textContent = data.userName;
        navUserName.style.textTransform = 'upperCase';
    })

    btnLogin.style.display = "none";
    btnRegister.style.display = "none";
    navUser.classList.remove("hide");
}
export default getUserInfo;


