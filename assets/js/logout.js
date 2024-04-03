import { URL_CLIENT_LOCAL,query } from "./const.js";
import {deleteCookie} from './storeCookie.js';


var btnRegister = query(".header__navbar-register");
var btnLogin = query(".header__navbar-item-login");


function logOut(){
    deleteCookie('access_token');
    deleteCookie('listCart');
    deleteCookie('userId');

    
    window.location.href = URL_CLIENT_LOCAL;

    btnLogin.classList.remove('hide');
    btnRegister.classList.remove('hide');

}

export default logOut;