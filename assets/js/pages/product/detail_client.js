console.log('sss');

import {URL_SERVER_LOCAL} from '../../const.js'
import  {setCookie,getCookie} from '../../storeCookie.js';
import  renderListCart from '../cart/listCart.js'
import {checkLogin, autoRedirect} from '../../checkLogged.js'
import {renderInfoUser} from '../../Users/user.js'
import logOut from '../../logout.js'
import { getSession } from '../../storeSession.js';
import {numberWithCommas,formatNumberWithDots} from '../../commons.js'
//Variables

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const url = new URL(window.location.href);
var categoryApi = URL_SERVER_LOCAL + "/api/Categories";

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
var productApi = URL_SERVER_LOCAL +"/api/Products";
var cartApi = URL_SERVER_LOCAL +"/api/Carts";
var listCartUl = $('.header__cart-list-item');
var modal = $('.modal__message');
var modalWarning = $('.modal_warning');

var modalWrap = $('.modal__success-warp');
var btnLogout = $('.header__navbar-logout');
var listFooterCategory = document.querySelector(".footer-list__category");
var cost = $('#cost');
var description = $('#description_detail');
var quantityStockEl = $('.product__quantity-stock');
var quantityStock = 0;

var redirectFrom = location.pathname + '?id='+paramId;
console.log(redirectFrom);

async function start() {
    handleGetInfoProduct();
    
    var infoLog = await checkLogin();
    if(!infoLog.isLogged){
        
    }else{
        renderInfoUser(infoLog.accessToken)
        renderListCart();
        handleGetListCategory(function(response){
            renderListCategory(response.data);
        });
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
            price.innerText = formatNumberWithDots(response.price);
            cost.innerHTML = formatNumberWithDots(response.price + (response.price * 0.4));
            description.innerHTML = response.description;
            var link =  `url('${response.imagePath}')`;
            imageDetail.style.backgroundImage = link;
            imgList.style.backgroundImage = link;

            infoProduct.title = response.title;
            infoProduct.price = formatNumberWithDots(response.price);
            infoProduct.id = response.id;
            inputQuantity.value = 1;
            quantityStockEl.textContent = response.quantity;
            quantityStock = response.quantity;
        })
}

//Handle buttn plus

btnPlus.onclick = ()=>{
    var currentValue = parseInt( inputQuantity.value);

    if(currentValue + 1 > quantityStock){

        modalWarning.classList.add('open');   
        setTimeout(function(){
            modalWarning.classList.add('close');  
            
        }, 1000);
     
        setTimeout(function(){
            modalWarning.classList.remove('close');  
            modalWarning.classList.remove('open');   
        }, 1200);
        return;
    }
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
            price: parseFloat(infoProduct.price.replace(/\./g, '')),
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
            
        }, 1000);
     
        setTimeout(function(){
            modal.classList.remove('close');  
            modal.classList.remove('open');   
        }, 2000);
    }
}

document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
        start();
    } 
});



//Handle click logOut

btnLogout.addEventListener('click', logOut);

function handleGetListCategory(callback){

    fetch(categoryApi +"?pageNumber=1&pageSize=20")
        .then(function(response){
            return response.json();
        })
        .then(callback)

}

//Render list category
function renderListCategory(categories) {
    var html = categories.map(function(category){
        return `
        <li class="category-item category-item--active">
        <a href="/pages/category/list-product.html?id=${category.id}" class="category-item__link" onclick="handleClickCategory(${category.id})" >${category.name}</a>
    </li>    
        `;
    });

    var htmlFooterCategory = categories.map(category=>{
        return `
        <li class="footer-item">
        <a href="" class="footer-item__link">${category.name}</a>
        </li>
        `
        })
    listFooterCategory.innerHTML = htmlFooterCategory.join(' ');
}