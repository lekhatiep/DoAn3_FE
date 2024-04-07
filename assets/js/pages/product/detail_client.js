console.log('sss');

import {URL_SERVER_LOCAL} from '../../const.js'
import  {setCookie,getCookie} from '../../storeCookie.js';
import  renderListCart from '../cart/listCart.js'
import {checkLogin, autoRedirect} from '../../checkLogged.js'
import {renderInfoUser} from '../../Users/user.js'
import logOut from '../../logout.js'
import { getSession } from '../../storeSession.js';
//Variables

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const url = new URL(window.location.href);

var infoProduct = {

}

var title = $('.product__detail-title');
var price = $('.product__detail-price-current');
var imgList = $('.product__box-list-item-img'); 
var imageDetail = $('.product__box-left-img'); 
var btnPlus = $('.product__quantity-warp-plus');
var btnMinus = $('.product__quantity-warp-minus');
var inputQuantity = $('.product__quantity-current');
var btnAddToCart = $('.product__detail-add-cart');
var cartNoticeNumber = $('.header__cart-notice');
var paramId = url.searchParams.get("id");
var productApi = "https://api.tipslife.site/api/Products";
var cartApi = "https://api.tipslife.site/api/Carts";
var listCartUl = $('.header__cart-list-item');
var modal = $('.modal__message');
var modalWrap = $('.modal__success-warp');
var btnLogout = $('.header__navbar-logout');


var redirectFrom = location.pathname + '?id='+paramId;
console.log(redirectFrom);

async function start() {
    handleGetInfoProduct();
    
    var infoLog = await checkLogin();
    if(!infoLog.isLogged){
        
    }else{
        renderInfoUser(infoLog.accessToken)
        renderListCart();
    }

    
}

start();

modal.addEventListener("click", modalClick)
modalWrap.addEventListener('click', function(e) {
    e.stopPropagation();
    return false;
})
function modalClick(){
    console.log('remove modal');
    modal.classList.remove('open')
}


//Hande get info product

function handleGetInfoProduct(){

    fetch(productApi + '/' + paramId)
        .then(function(response){
            if(response.status !== 200){
                console.log('ERROR');
            }
            return response.json();
        }).then((response)=>{
            title.innerText = response.title;
            price.innerText = response.price;
            var link =  `url('${response.imagePath}')`;
            imageDetail.style.backgroundImage = link;
            imgList.style.backgroundImage = link;

            infoProduct.title = response.title;
            infoProduct.price = response.price;
            infoProduct.id = response.id;
            inputQuantity.value = 1;

        })
}

//Handle buttn plus

btnPlus.onclick = ()=>{
    var currentValue = parseInt( inputQuantity.value);

    inputQuantity.value = currentValue + 1;
}

//Handle buttn minus

btnMinus.onclick = ()=>{
    var currentValue = parseInt( inputQuantity.value);
    currentValue--;
    
    if(currentValue <= 1){
        inputQuantity.value = 1;
    }else{
        inputQuantity.value = currentValue;
    }
    
}

inputQuantity.onblur = ()=>{

    var currentValue = parseInt(inputQuantity.value);
    if (typeof(currentValue) === 'number') {
        inputQuantity.value = currentValue;
    }else{
        inputQuantity.value = 1;
    }
}
// Handle add to cart temp

//btnAddToCart.onclick = await addTocart();

btnAddToCart.addEventListener('click', addTocart);
//Hanlde function addtocart 

async function addTocart(){
    
    var infoLog = await checkLogin();
    if(!infoLog.isLogged){

        autoRedirect(redirectFrom);
       
    }else{
        
        var userId = parseInt(getCookie('userId'));
        // console.log(getCookie('listCart'));
        var data = {
            productId: infoProduct.id,
            price: infoProduct.price,
            quantity: parseInt(inputQuantity.value),
            userId: userId,
        }
    
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${infoLog.accessToken}`
            },
            body: JSON.stringify(data)
        }
        console.table(data.productId, data.price,typeof data.quantity, data.userId);
        fetch(cartApi, options)
            .then(response => 
                response.json()
            )
            .then( async response =>{
                setCookie("listCart",JSON.stringify(response),30);
                renderListCart();
                
            })
            
            .catch((error) => {
                console.log(error);
            })
        
        modal.classList.add('open');   
        setTimeout(function(){
            modal.classList.add('close');  
            
        }, 2000);
     
        setTimeout(function(){
            modal.classList.remove('close');  
            modal.classList.remove('open');   
        }, 4000);
    }
}

document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
        start();
    } 
});



//Handle click logOut

btnLogout.addEventListener('click', logOut);