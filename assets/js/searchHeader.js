import {URL_CLIENT_LOCAL, URL_SERVER_LOCAL,URL_HOSTING_LOCAL} from './const.js'
import { getCookie, setCookie } from './storeCookie.js';
import { getSession, setSession } from './storeSession.js';

//Variables
const pageSize = 10;
const $ = document.querySelector.bind(document);//Query

var inputSearch = $('.header__search-input');
var titleSearch = $('.header__search-history-heading');
var historySearchList = $('.header__search-history-list');
var historySearchDiv = $('.header__search-history');
var typingTimer;                //timer identifier
var doneTypingInterval = 3000;  //time in ms, 5 seconds for example
var historySearch = JSON.parse(getSession('historySearch'));
var productApi = URL_SERVER_LOCAL + '/api/Products/GetProductByName';
var bodyEl = document.getElementsByTagName("BODY")[0];

var btnSearch = $('.header__search-btn');
var listHomeProduct = document.querySelector(".home-product>.grid__row");

function start(){
 
    if (historySearch !== null) {
        renderHistorySearch(historySearch);
    }else{
        historySearch = [];
    }
}

start();


historySearchDiv.addEventListener('click',function(e){
    e.stopPropagation();
    return false;
})

function searchHeader(searchString){
    fetch(productApi + `?pageNumber=1&pageSize=${pageSize}&Search=${searchString}`)
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{

            if(res.data.length > 0){

                if(historySearch.indexOf(searchString) === -1 && searchString !==''){
                    historySearch.push(searchString)
                    setSession('historySearch', JSON.stringify(historySearch));
                }

                titleSearch.innerText = ''
                historySearchList.style.display = 'block';
    
                renderResult(res.data);
            }else{
                titleSearch.innerText = 'Không tìm thấy kết quả'
                historySearchList.style.display = 'block';
                historySearchList.innerHTML = '';
            }
            
           
        })
   
}

//on keyup, start the countdown
inputSearch.addEventListener('keyup', function (e) {

    if(inputSearch.value !== ''){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(()=> searchHeader(inputSearch.value), doneTypingInterval);
    }

    if(e.key === 'Enter' || e.keyCode === 13){
        searchAndShowData(inputSearch.value.trim());
    }
      
  });
  
  //on keydown, clear the countdown 
inputSearch.addEventListener('keydown', function () {
    clearTimeout(typingTimer);
});


//user is "finished typing," do something
function doneTyping () {
    //do something
    console.log('Searching....');
}

//Render result list

function renderResult(data) {
    var html = data.map(item=>{
        return `<li class="header__search-history-item">
            <a href="/pages/product/detail_client.html?id=${item.id}" class="header__search-history-link">
                ${item.title}
            </a>
                </li>
            `       
    })

    historySearchList.innerHTML = html.join('');

}

// renderHistorySearch

function renderHistorySearch(data){

    var html = data.map(item=>{
        return `<li class="header__search-history-item">
            <a href="#" class="header__search-history-link" onclick="clickHistory(this)">
                ${item}
            </a>
        </li>
        `
    })

    historySearchList.innerHTML = html.join('');
}

//clickHistory

window.clickHistory = function(e) {

    var text = e.innerText;
 
    inputSearch.value = text;
    searchHeader(text);
    
}

// Handle onfocus input
inputSearch.onfocus = ()=>{
    historySearchDiv.style.display = 'block';
    if (historySearch !== null) {
        renderHistorySearch(historySearch);
    }else{
        historySearch = [];
    }


}

//prevent click propagation
inputSearch.addEventListener('click', function(e) {
    e.stopPropagation();
    return false;
})
historySearchDiv.addEventListener('click', function(e) {
    e.stopPropagation();
    return false;
})


bodyEl.addEventListener("click", bodyClick)

function bodyClick(){
    historySearchDiv.style.display = 'none';
}

//handle button search

btnSearch.onclick = ()=> {
 
    if(inputSearch.value.trim() !== '' || inputSearch.value !== null){
        searchAndShowData(inputSearch.value);
    }
    
}

function renderProduct(products){
    
    var html = products.map((product)=>{
        var imgURL = '';
        if(product.productImages.length !== 0){
            imgURL =  product.productImages[0].imagePath;
        }else{
            imgURL = '';
        }
        
        return `
        <div class="col-lg-3 col-md-4 col-sm-6">
        <!-- Product item -->
        <a class="home-product-item" href="${URL_HOSTING_LOCAL}/pages/product/detail_client.html?id=${product.id}"> 
        <div class="home-product-item__img" 
            style="background-image: url('${
                //URL_SERVER_LOCAL +'/'+ imgURL
                imgURL
            }')">
            </div>
            <h4 class="home-product-item__name">${product.title}</h4>
            <div class="home-product-item__price">
                <span class="home-product-item__price-old">${product.price} đ</span>
                <span class="home-product-item__price-current">${Math.floor(product.price - (product.price * 0.4))} đ</span>
            </div>
            <div class="home-product-item__action">
                <span class="home-product-item__like home-product-item__like--liked">
                    <i class="fa-solid fa-heart home-product-item__like-fill"></i>
                    <i class="fa-regular fa-heart home-product-item__like-empty"></i>
                </span>
                <div class="home-product-item__rating">
                    <i class="home-product-item__star-gold fa-solid fa-star"></i>
                    <i class="home-product-item__star-gold fa-solid fa-star"></i>
                    <i class="home-product-item__star-gold fa-solid fa-star"></i>
                    <i class="home-product-item__star-gold fa-solid fa-star"></i>
                    <i class="home-product-item__star-gold fa-solid fa-star"></i>
                </div>
                <span class="home-product-item__sold">88 đã bán</span>
            </div>
            <!-- <div class="home-product-item__origin">
                <spam class="home-product-item__brand">Whoo</spam>
                <span class="home-product-item__origin-name">Nhật Bản</span>
            </div> -->
            <div class="home-product__favourite">
                <i class="home-product__favourite-icon fa-solid fa-check"></i>
                <span>Yêu thích</span>
            </div>
            <div class="home-product__sale-off">
                <span class="home-product__sale-off-percent"> 40% </span>
                <span class="home-product__sale-off-label">GIẢM </span>
            </div>
        </a>                                
    </div>
        
        `
    });

    listHomeProduct.innerHTML = html.join(' ')
}

function searchAndShowData(searchString){

    fetch(productApi + `?pageNumber=1&pageSize=${pageSize}&Search=${searchString}`)
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{

            if(res.data.length > 0){

                if(historySearch.indexOf(searchString) === -1 && searchString !==''){
                    historySearch.push(searchString)
                    setSession('historySearch', JSON.stringify(historySearch));
                }

                titleSearch.innerText = ''
                historySearchList.style.display = 'block';
                renderProduct(res.data)
            }else{
                
            }
            
           
        })
   
}