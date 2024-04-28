import { 
    URL_CLIENT_LOCAL,
    URL_SERVER_LOCAL,
    query,
    Routes,
    Permissions
} from "../../const.js";
import { 
    numberWithCommas, 
    stringOfOrderStatus,
    colorOrderStatus
} from "../../commons.js"
import {checkLogin,autoRedirect} from '../../checkLogged.js'


//Const
const serverURL = URL_SERVER_LOCAL;
const catApi = URL_SERVER_LOCAL+"/api/Categories";
const userApi = URL_SERVER_LOCAL+"/api/Users";
//Variables
var pageNumber = 1;
var pageSize = 10;
var totalPages = 0;
var page = 1;
var infoPage ={};

var listCatBlock = query("#list-cats")
var ulTag = document.querySelector(".pagination");
var routePage = location.pathname;
var redirectFrom = location.pathname;
var accessToken = '';
var infoLogged = {};
//Start 
async function start(){
    //Check authen
    var infoLog = await checkLogin();
    if(!infoLog.isLogged){
        autoRedirect(redirectFrom);
       
    }else{
        accessToken = infoLog.accessToken;
    }

    handleGetDefaultPage().then(response =>{     
            totalPages = response.totalPages;
            page = response.pageNumber;
            Pagination(totalPages, infoPage.pageNumber)
            
        });
}


await start();

//Functions
function renderCats(cats){

    
    var htmls = cats.map(function(cat){

        var m = new Date(cat.createTime);
        var dateString = 
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2) + " " +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + "/" +
        m.getUTCFullYear() ;

        var color = colorOrderStatus(cat.status);

        return `
       
        <tr >
            <td class="text-bold-500 col-md-2">${dateString}</td>
            <td class="admin-product-table__col-price">${cat.id} </td>
            <td class="admin-product-table__col-price">${cat.name} </td>
            <td>
                <ul class="admin-product-table__list">
                    <li class="admin-product-table__list-item" onclick="modalChangeName(${cat.id}, '${cat.name}')">
                        <a href="#" class="admin-product-table__link" >
                            <i class="admin-product-table__icon-detail fa-solid fa-circle-info"></i>
                            Đổi tên
                        </a>
                    </li>
                    <li class="admin-product-table__list-item" onclick ="handleDeleteCat(${cat.id});">
                        <a href="#" class="admin-product-table__link">
                            <i class="admin-product-table__icon-del fa-solid fa-trash-can"></i>
                            Xóa
                        </a>
                    </li>
                </ul>
            </td>
        </tr>
        `;
    });

    listCatBlock.innerHTML = htmls.join('');
}

// Handle Delete
window.handleDeleteCat = function(id){

    var options = {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${accessToken}`
        }
    };

    fetch(catApi + "/IsCatAssignProduct?catID=" +id, options)
        .then(function (response) {
            return response.json();_
        })
        .then(response => {
            if(response == 1){
                var msg = "Loại này đang được gắn cho một sản phẩm, Có chắc muốn xóa nó?"
                if(!confirm(msg)){
            
                    return;
                }
                DeleteCat(id)
            }else{
                var msg = "Có chắc muốn xóa nó?"
                if(!confirm(msg)){
            
                    return;
                }
                DeleteCat(id)
            }
        })
        .catch(err => {
            //location.reload();
            console.log(err);
        })


    

        
}

function DeleteCat(id){
   

    var options = {
        method: 'DELETE',
        headers: {
            'Authorization' : `Bearer ${accessToken}`
        }
    };

    fetch(catApi + "/" +id, options)
        .then(function (response) {
            if(response.status === 200){
                
                alert("Xóa thành công")
                location.reload();
            } 
        })
        .then(response => {
            return response ? JSON.parse(response) : {};
        })
        .catch(err => {
            location.reload();
            console.log(err);
        })
}

//Handle get default page
function handleGetDefaultPage(){
    var options = {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${accessToken}`
        }
    }
    return fetch(catApi + `/?pageNumber=${pageNumber}&pageSize=${pageSize}`,options)
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
    page =1;
    var options = {
        method: 'GET',
        headers: {
            'Authorization' : `Bearer ${accessToken}`
        }
    }

    fetch(catApi + `?pageNumber=${page}&pageSize=${pageSize}`,options)
    .then(function(response){
        return response.json();_
    })
    .then(response =>{
        renderCats(response.data)
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


window.modalChangeName = function(catId, name){
    var modalChangeName = query("#modalChangeName");
    var myModal = new bootstrap.Modal(query("#modalChangeName"), {});
    var currentCatName = query("#modalChangeName div>#currentName");
    var catName = query("#modalChangeName div>#catName");
    modalChangeName.setAttribute("catId", catId);
    currentCatName.value = name;
    catName.value = name;

    if(modalChangeName){
        myModal.show();     
    }

}

window.saveNameCat = function(){
    var modalChangeName = query("#modalChangeName");
    var currentCatName = query("#modalChangeName div>#currentName");
    var catName = query("#modalChangeName div>#catName");
    var catId = modalChangeName.getAttribute("catId");

    if(catName.value !== currentCatName.value){
        var options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body:  JSON.stringify( {
                id: parseInt(catId),
                name: catName.value,
            })
        }
    
        fetch(catApi,options)
        .then(function(response){
            return response;_
        })
        .then(response =>{
            location.reload();
        })
    }
   
}


window.modalAddNewCat = function (){
    var modalAddNewCat = document.getElementById("modalAddNewCat");
    var myModal = new bootstrap.Modal(document.getElementById("modalAddNewCat"), {});
    if(modalAddNewCat){
        myModal.show();     
    }
}

window.addNewCat = function (){
    var catName = query("#modalAddNewCat div>#catName");

    if(catName.value !== ''){
       
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            },
            body:  JSON.stringify( {
                name: catName.value,
            })
        }
    
        fetch(catApi,options)
        .then(function(response){
            alert("Thêm thành công");
            location.reload();
            return response;
        })
        .then(response =>{
            
        })
    }else{
        var spanTag = document.createElement("span");
        spanTag.innerHTML = "Nhập tên";
        spanTag.className = "text-danger";
        catName.parentNode.insertBefore(spanTag, catName.nextSibling);
        console.log(catName);
    }

}