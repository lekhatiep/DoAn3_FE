import {URL_SERVER_LOCAL} from './const.js';
export {autoRedirect ,checkLogin};
import {getCookie} from './storeCookie.js';
import {getSession} from './storeSession.js';

var access_token = getCookie('access_token');
var userApi = URL_SERVER_LOCAL + "/api/Users/validateToken";
var infoLogged = {
    isLogged : false,
    isValidToken : '',
    accessToken : '',
}

async function checkLogin(){
    if(access_token === null || access_token === undefined){
        infoLogged.isLogged = false;
        return infoLogged;
    }

    var options ={
        method: 'POST',
        headers: { accessToken: access_token},
    };

    await fetch(userApi, options)
        .then(resp => {
            if(resp.status === 200){
                infoLogged.isLogged = true
                infoLogged.accessToken = access_token;
            }

        })
        .catch((err) => {
            console.log(err);
        })
    
    return infoLogged;
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


//Check Logged in
// async function isLoggedIn () {
//     const token = localStorage.getItem('access_token')
//     if (token === null) return false
//     else return true;
// }
    

function autoRedirect (redirectFrom) {

    console.log(redirectFrom);
    const validLogin = infoLogged.isLogged

    console.log(validLogin);
    if (!validLogin && location.pathname !== '/pages/login/login.html'){
        sessionStorage.setItem("pageNotLoggedPath", redirectFrom);
        location.href='/pages/login/login.html';
    }
    if (validLogin && location.pathname === '/pages/login/login.html/')
        location.href= '/'
}