export {
    URL_CLIENT_LOCAL,
    URL_SERVER_LOCAL,
    PAGE_NUMBER_DEFAULT,
    PAGE_SIZE_DEFAULT,
    query,
    queryAll,
    Permissions,
    Routes
};
//Query Selector
const getId = document.getElementById.bind(document);//Get ID
const query = document.querySelector.bind(document);//Query
const queryAll = document.querySelectorAll.bind(document);

//URL Dev
//const URL_SERVER_LOCAL = "https://localhost:5001";
const URL_CLIENT_LOCAL = "http://127.0.0.1:5500";
const URL_HOSTING_LOCAL = "https://do-an3-fe.vercel.app";
// URL Production
const URL_SERVER_LOCAL = "https://api.tipslife.site";

//Product
const PAGE_NUMBER_DEFAULT = 1;
const PAGE_SIZE_DEFAULT = 5;

//Route

const Routes = {
    Products : {
        create : "pages/product/create.html",
        edit : "pages/product/edit_dev.html",
        get : "/pages/product/"
    }
}

//Permissions
const Permissions = {
//Product
    Product : {
        Create:"Permission.Product.Create",
        Delete:"Permission.Product.Delete",
        Update:"Permission.Product.Update",
        Get:"Permission.Product.Get",

    },
//User
    User : [
        "Permission.User.Create",
        "Permission.User.Get",
    ]
}