import { 
    URL_CLIENT_LOCAL,
    URL_SERVER_LOCAL,
    query,
    Routes,
    Permissions
} from "../../const.js";
import {checkLogin} from '../../checkLogged.js'
import checkPermission from '../../checkPermission.js';

//Const
const serverURL = URL_SERVER_LOCAL;
const productApi = URL_SERVER_LOCAL+"/api/Products";
const userApi = URL_SERVER_LOCAL+"/api/Users";
//Variables
var pageNumber = 1;
var pageSize = 10;
var totalPages = 0;
var page = 1;
var infoPage ={};

var listProductBlock = document.querySelector("#list-products")
var ulTag = document.querySelector(".pagination");
var routePage = location.pathname;
//Start 
async function start(){
    //Check authen
    var infoLog = await checkLogin();
    if(infoLog.isLogged){
        //Check permission
        var createProductRoute = Routes.Products.get;
        var getProductPermission = Permissions.Product.Get

        await checkPermission(routePage,createProductRoute,getProductPermission);
    }else{
        console.log("Not logged");
    }

    handleGetDefaultPage().then(response =>{     
            totalPages = response.totalPages;
            page = response.pageNumber;
            Pagination(totalPages, infoPage.pageNumber)
            
        });
}


start();

//Functions
function getProducts(callback){

    fetch(productApi + `?pageNumber=${pageNumber}&pageSize=${pageSize}`)
        .then(function(response){
            return response.json();_
        })
        .then(callback);
}

function renderProduct(products){
    var htmls = products.map(function(product){

        var imagePath = '';
        if(product.productImages.length !== 0){
            imagePath =  product.productImages[0].imagePath;
        }else{
            imagePath = '';
        }
        
        return `
        <tr class="admin-product__data-${product.id}">
            <td class="text-bold-500 admin-product-table__col-text">${product.title}</td>
            <td class="admin-product-table__col-price">${product.price}đ</td>
            <td class="admin-product-table__col-img">
                <div class="admin-product-table__img" style="background-image: url('${serverURL + imagePath}')"></div>
            </td>
            <td>${Math.floor(product.price - (product.price * 0.4))}</td>
            <td class="text-bold-500">${product.quantity}</td>
            <td>
                <ul class="admin-product-table__list">
                    <li class="admin-product-table__list-item admin-product-table__item-edit" data-id = ${product.id} onclick="handleUpdate(${product.id})">
                        <a href="/pages/product/detail.html?id=${product.id}" class="admin-product-table__link">
                            <i class="admin-product-table__icon-detail fa-solid fa-circle-info"></i>
                                                                Chi tiết sản phẩm
                        </a>
                    </li>
                    <li class="admin-product-table__list-item" onclick ="handleDelete(${product.id});" >
                        <div class="admin-product-table__link">
                            <i class="admin-product-table__icon-del fa-solid fa-trash-can"></i>
                            Xóa
                        </div>
                    </li>
                </ul>
            </td>
        </tr>
        `;
    });

    listProductBlock.innerHTML = htmls.join('');
}

// Handle Delete
window.handleDelete = function(id){

    var msg = "Bạn có muốn xóa sản phẩm này không?"
    if(!confirm(msg)){

        return;
    }

    var options = {
        method: 'DELETE',
    };

    fetch(productApi + "/" +id, options)
        .then(function (response) {
            if(response.status === 200){
                var itemProduct = document.querySelector(".admin-product__data-" +id);
                
                itemProduct.remove();
                alert("Xóa thành công")
            } 
        })
        .then(response => {
            return response ? JSON.parse(response) : {};
        })
        .catch(err => {
            console.log(err);
        })
        
}

//Handle get default page
function handleGetDefaultPage(){

    return fetch(productApi + `?pageNumber=${pageNumber}&pageSize=${pageSize}`)
        .then(function(response){
            return response.json();_
        })
        .then(response =>{
            infoPage.pageNumber = response.pageNumber;
            infoPage.pageSize = response.pageSize;
            infoPage.totalPages = response.totalPages;
            infoPage.totalRecord = response.totalRecord;
            infoPage.currentPage = response.currentPage;

            return response;
        });
        
}

//Pagination
window.Pagination = function (totalPages,page){

    fetch(productApi + `?pageNumber=${page}&pageSize=${pageSize}`)
    .then(function(response){
        return response.json();_
    })
    .then(response =>{
        renderProduct(response.data)
        renderNavigationPaging(totalPages,page);
    })
}


//Handle render navigation paging 
function renderNavigationPaging(totalPages,page){
    var liTag = '';
    var liActive ;
    var beforePages = page - 1; //5 - 1 = 4 
    var afterPages = page + 1;//5 + 1 = 6

    if(totalPages <= 5){
        for(let pageLength = 0; pageLength <= 5; pageLength++){
            if(pageLength > totalPages){
                continue;
            }
    
            if(pageLength ==0){//If pageLength is equals to 0 then add + 1
                pageLength+=1;
            }
    
            if(page == pageLength){
                liActive = 'pagination-item--active';
            }else{
                liActive = '';
            }
            
            liTag +=` <li class="pagination-item ${liActive}" onclick="Pagination(${totalPages},${pageLength})">
            <div  class="pagination-item__link">${pageLength}</div>
            </li>`;
        }
        
    }else{
        if(page>1){//if page values if greater than 1 then add new li which is previous button
            liTag += `<li class="pagination-item" onclick="Pagination(${totalPages},${page - 1})">
            <div class="pagination-item__link">
                <i class="pagination-item-icon fa-solid fa-angle-left"></i>
            </div>
        </li>`;
        }
    
        if(page>2){//if page greater than 2 then add new li tag with 1 value
            liTag +=` <li class="pagination-item" onclick="Pagination(${totalPages},1)">
            <div  class="pagination-item__link">1</div>
            </li>`;
            if(page > 3){//if page greater than 3 then add new li tag with (...)
                liTag +=`<li class="pagination-item">
                <div href="" class="pagination-item__link">...</div>
                </li>`; 
            }
        }
    
        //How many page or li show before the current li
        if(page == totalPages){//if page value is equal to totalPages the substract by -2 to before page value 
            beforePages = beforePages - 2;
        }else if(page == totalPages - 1){//if page value is equal to totalPages - 1 the substract by -1 to before page value 
            beforePages = beforePages - 1;
        }
         //How many page or li show after the current li
        if(page == 1){//if page value is equal to 1 the ad by +2 to after page value 
            afterPages = afterPages + 2;
        }else if(page == 2){
            afterPages = afterPages + 1;
        }
        
        for(let pageLength = beforePages; pageLength <= afterPages; pageLength++){
            if(pageLength > totalPages){
                continue;
            }
    
            if(pageLength ==0){//If pageLength is equals to 0 then add + 1
                pageLength+=1;
            }
    
            if(page == pageLength){
                liActive = 'pagination-item--active';
            }else{
                liActive = '';
            }
            
            liTag +=` <li class="pagination-item ${liActive}" onclick="Pagination(${totalPages},${pageLength})">
            <div  class="pagination-item__link">${pageLength}</div>
            </li>`;
        }
    
        //If page value less than totalPages by - 1 then show the last li or page which is 20
        if(page < totalPages - 1 ){      
            if(page < totalPages - 2 ){//If page value less than totalPages by - 1 then show the last li or page which is 20
                liTag +=`<li class="pagination-item">
                <a href="" class="pagination-item__link">...</a>
                </li>`; 
            }
            liTag +=` <li class="pagination-item" onclick="Pagination(${totalPages},${totalPages})">
            <div  class="pagination-item__link">${totalPages}</div>
            </li>`; 
        }
        
        
    
        if(page < totalPages){//if page values if less than totalPages then add new li which is next button
            liTag +=` <li class="pagination-item" onclick="Pagination(${totalPages}, ${page + 1})">
            <div class="pagination-item__link">
                <i class="pagination-item-icon fa-solid fa-angle-right"></i>
            </div>
        </li>`;
        }
    }
    ulTag.innerHTML = liTag;
} 

async function handleCheckPermissionPage(accessToken){

    console.log("check permission this page");

    var createProductRoute = Routes.Products.get;
    var getProductPermission = Permissions.Product.Delete

    console.log(createProductRoute);
    console.log(routePage);


    if(createProductRoute === routePage){
        var userPermissions = await fetch(userApi+"/GetUserPermission/2", {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            return response;
        })
        console.log(userPermissions);
        var isAuthorize = userPermissions.some(function(permission) {
            return permission === getProductPermission;
        });

        console.log(isAuthorize);
    }
}