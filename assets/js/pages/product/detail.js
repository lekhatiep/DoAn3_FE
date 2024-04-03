import {URL_SERVER_LOCAL} from '../../const.js'

//Variables
const url = new URL(window.location.href);
var paramId = url.searchParams.get("id");
var btn = document.querySelector("#admin-product__detail-btn-edit");
var title = document.querySelector('.admin-product__list-name');
var code = document.querySelector('.admin-product__list-code');
var price = document.querySelector('.admin-product__list-price');
var quantity = document.querySelector('.admin-product__list-quantity');
var description = document.querySelector('.admin-product__list-description'); 
var imageDetail = document.querySelector('.admin-product-detail__img'); 

var productApi = "https://localhost:5001/api/Products";

btn.onclick = function() {
    window.location.href="./edit_dev.html?id="+paramId;
}

function start() {
    handleGetInfoProduct();

}

start();

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
            code.innerText = response.code;
            price.innerText = response.price;
            quantity.innerText = response.quantity;
            description.innerText = response.description;

            var link =  `url('${URL_SERVER_LOCAL + response.imagePath}')`;
            imageDetail.style.backgroundImage = link
        })
}
