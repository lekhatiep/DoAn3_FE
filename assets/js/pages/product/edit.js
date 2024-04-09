import {getCookie} from '../../../js/storeCookie.js';
import {URL_SERVER_LOCAL, query} from '../../const.js'
//URL API
var productApi = URL_SERVER_LOCAL +"/api/Products";
var categoryApi = URL_SERVER_LOCAL + "/api/Categories";
var access_token = getCookie('access_token');
//Element Selector
var formEdit = document.querySelector("#admin-product__form-edit");
var code = document.querySelector('input[name="code"]');
var title = document.querySelector('input[name="title"]');
var price = document.querySelector('input[name="price"]');
var quantity = document.querySelector('input[name="quantity"]');
var description = document.querySelector('textarea[name="description"]');
var formEdit = document.querySelector("#admin-product__form-edit");
var createBtn = document.querySelector("#admin-product__form-btn-save");
var image = document.querySelector('input[type="file"]')
var imageDetail = document.querySelector('.admin-product-detail__img')
var categories = query("#categories");


//Variables
const url = new URL(window.location.href);
var paramId = url.searchParams.get("id");


var data = {
    // code : code.value,
    // title: title.value,
    // price: price.value,
    // quantity: quantity.value,
    // description: description.value
};

var formData = new FormData();

formEdit.onsubmit = function(e) {
    e.preventDefault();
}

function start() {
    
    handleUpdate(paramId);

    handleSaveForm(data);
    loadListCategory();
}


start();


function handleUpdate(id){

    fetch(productApi + '/' + id)
    .then(function (response){
        return response.json();
    })
    .then(function (responseData){    
        formData.append("id", responseData.id);                   
        data.id = responseData.id;
        code.value = responseData.code;
        title.value = responseData.title;
        price.value = responseData.price;
        quantity.value = responseData.quantity;
        description.value = responseData.description;
        imageDetail.style.backgroundImage =  `url(${responseData.imagePath})`;

        console.log(responseData);
    })

}

//Function handle save form
function handleSaveForm(){
    createBtn.onclick = function(){

        //set data
        // data.code = code.value
        // data.title =  title.value
        // data.price =  Number(quantity.value)
        // data.quantity = Number(quantity.value)
        // data.description = description.value
        // console.log(data);  

        formData.append("Code",code.value);
        formData.append("Title",title.value);
        formData.append("Price",Number(price.value));
        formData.append("Quantity",Number(quantity.value));
        formData.append("Description",description.value);
        formData.append("ThumbnailImage",image.files[0]);
        
        saveProduct(formData);
 
    }

}

//Function save product

function saveProduct(formData){
    var options = {
    method: 'PUT',
    headers: {
        'Authorization' : `Bearer ${access_token}`
    },
    body: formData
    };

    fetch(productApi + "/" + data.id ,options)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Bad status code from server.');
        }
        alert("Sua thanh cong")
        history.back()
        return response.text();//because not response data in body
    })
    .then((data) => {
        return data ? JSON.parse(data) : {}
    })
    .catch((error) => {
        console.log(error);
    })


    updateCategory(data.id);
}

function loadListCategory(){
    
    var htmls = '';

    fetch(categoryApi +"?pageNumber=1&pageSize=20")
        .then(function(response){
            return response.json();
        })
        .then(response => {
            console.log(response.data);

            htmls = response.data.map(cat =>{
                return `
                    <option value='${cat.id}'>${cat.name}</option>
                `;
            });
            categories.innerHTML = htmls;
        })
}

function updateCategory(productId){

    var options = categories.selectedOptions;
    var categoryIds = Array.from(options).map(({value})=> parseInt(value));
    console.log(categoryIds);
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${access_token}`
        },
        body: JSON.stringify(categoryIds)
        };
    
        fetch(categoryApi + "/UpdateCategoryOfProduct?productID=" + productId ,options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Bad status code from server.');
            }
            //return response.json();
            return response.text();//because not response data in body
        })
        .then((data) => {
            return data ? JSON.parse(data) : {}
        })
        .catch((error) => {
            console.log(error);
        })
}

