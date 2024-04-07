export {setCookie, getCookie, checkCookie, deleteCookie} 

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
function getCookie(cname) {
    let name = cname + "=";
    //if use this 2 lines below, link image of the goods will be wrong and can appear
    // let decodedCookie = decodeURIComponent(document.cookie);
    // let ca = decodedCookie.split(';');
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return null;
}
    
function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:","");
        if (user != "" && user != null) {
            setCookie("username", user, 30);
        }
    }
}

function deleteCookie(cname){
    document.cookie = cname +"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}