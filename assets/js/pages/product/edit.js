//URL API
var productApi = "https://localhost:5001/api/Products";
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

        console.log(responseData)
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
    body: formData
    };

    fetch(productApi + "/" + data.id ,options)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Bad status code from server.');
        }
        alert("Sua thanh cong")
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




// //Handle Update

// var mainElement =  $("#main");
// var btnLoad = document.querySelector("#load-edit");
// function handleUpdate(id){     
//         $(document).ready(function(){
//             mainElement.load("edit.html", function(responseTxt, statusTxt, xhr){
//             if(statusTxt == "success"){

//                 var code = document.querySelector('input[name="code"]');
//                 var title = document.querySelector('input[name="title"]');
//                 var price = document.querySelector('input[name="price"]');
//                 var quantity = document.querySelector('input[name="quantity"]');
//                 var description = document.querySelector('textarea[name="description"]');
//                 var formEdit = document.querySelector("#admin-product__form-edit");

//                 formEdit.onsubmit = function(e) {
//                     e.preventDefault();
//                 }

//                 fetch(productApi + '/' + id)
//                     .then(function (response){
//                         return response.json();
//                     })
//                     .then(function (responseData){                       
//                         console.log(responseData);
//                         code.value = responseData.code;
//                         title.value = responseData.title;
//                         price.value = responseData.price;
//                         quantity.value = responseData.quantity;
//                         description.value = responseData.description;

//                         var data = {
//                             id : responseData.id,
//                             code : code.value,
//                             title: title.value,
//                             price: price.value,
//                             quantity: quantity.value,
//                             description: description.value
//                         };

//                         handleSaveForm(data);

//                     })

//             }
            
//             if(statusTxt == "error")
//             console.log("Error: " + xhr.status + ": " + xhr.statusText);
//             });
        
//         });
// }

// //Function handle create form
// function handleSaveForm(data){
//     var createBtn = document.querySelector("#admin-product__form-btn-save");

//     console.log(data);
//     createBtn.onclick = function(){
//         createProduct(data,function(products){
//             console.log(products);
//         });
//     }

// }

// //Function create product

// function createProduct(data,callback){
//     var options = {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data)
//     };

//     fetch(productApi + "/" + data.id ,options)
//     .then(function(response) {
//         if (!response.ok) {
//             throw new Error('Bad status code from server.');
//         }
    
//         //return response.json();
//         return response.json();//because not response data in body
//         })
//         .then((data) => {
//             return data ? JSON.parse(data) : {}
//         })
//         .catch((error) => {
//             console.log(error);
//         })
// }
    


