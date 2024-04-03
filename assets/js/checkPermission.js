import {
    URL_SERVER_LOCAL,
    Permissions
} from './const.js';
import {getCookie} from './storeCookie.js';
import {getSession} from './storeSession.js';

var access_token = getCookie('access_token');
var userApi = URL_SERVER_LOCAL + "/api/Users";


async function checkPermission(...args) {
    var claims = parseJwt(access_token);
    var routePageNeedAccess = args[0];
    var routePage = args[1];
    var namePagePermission = args[2];
    var userId = getSession("userId");

    if(routePageNeedAccess === routePage){
        var userPermissions = await fetch(userApi+`/GetUserPermission/${parseInt(claims.id)}`, {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            return response
        })
        console.log(userPermissions);
        var isAuthorize = userPermissions.some(function(permission) {
            return permission === namePagePermission;
        });
        if(!isAuthorize)
        {
            location.href = '/pages/error/error-403.html'
        }
        console.log(isAuthorize);
    }
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export default checkPermission;