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
const orderApi = URL_SERVER_LOCAL+"/api/Orders";
const userApi = URL_SERVER_LOCAL+"/api/Users";
//Variables
var pageNumber = 1;
var pageSize = 10;
var totalPages = 0;
var page = 1;
var infoPage ={};

var listProductBlock = query("#list-products")
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
function renderOrder(orders){

    
    var htmls = orders.map(function(order){

        var m = new Date(order.createTime);
        var dateString = 
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2) + " " +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + "/" +
        m.getUTCFullYear() ;

        var color = colorOrderStatus(order.status);

        return `
       
        <tr >
            <td class="text-bold-500 col-md-2">${dateString}</td>
            <td class="admin-product-table__col-price">${numberWithCommas(order.grandTotal)} đ</td>
            <td class="admin-product-table__col-price">
                <div style="font-weight: bold;color:${colorOrderStatus(order.status)}">
                     ${stringOfOrderStatus(order.status)}
                </div>                
            </td>
            <td>${order.id}</td>
            <td>[${order.userId}]-${order.userName}</td>
            <td>
                <ul class="admin-product-table__list">
                    <li class="admin-product-table__list-item" onclick="modalUpdateStatusOrder(${order.id}, ${order.status})">
                        <a href="#" >
                            <i class="admin-product-table__icon-add fa-solid fa fa-cog"></i>
                            Cập nhập trạng thái
                        </a>
                           
                    </li>
                    <li class="admin-product-table__list-item" onclick="modalListOrderDetails(${order.id})">
                        <a href="#" class="admin-product-table__link" >
                            <i class="admin-product-table__icon-detail fa-solid fa-circle-info"></i>
                            Chi tiết đơn hàng
                        </a>
                    </li>
                    <li class="admin-product-table__list-item" onclick ="handleDeleteOrder(${order.id});">
                        <a href="#" class="admin-product-table__link">
                            <i class="admin-product-table__icon-del fa-solid fa-trash-can"></i>
                            Xóa đơn
                        </a>
                    </li>
                </ul>
            </td>
        </tr>
        `;
    });

    listProductBlock.innerHTML = htmls.join('');
}

// Handle Delete
window.handleDeleteOrder = function(id){

    var msg = "Bạn có muốn xóa đơn này không?"
    if(!confirm(msg)){

        return;
    }

    var options = {
        method: 'DELETE',
    };

    fetch(orderApi + "/" +id, options)
        .then(function (response) {
            if(response.status === 200){
                
                alert("Xóa thành công")
            } 
        })
        .then(response => {
            return response ? JSON.parse(response) : {};
        })
        .catch(err => {
            //location.reload();
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
    return fetch(orderApi + `/GetListOderPaging?pageNumber=${pageNumber}&pageSize=${pageSize}`,options)
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

    fetch(orderApi + `/GetListOderPaging?pageNumber=${page}&pageSize=${pageSize}`,options)
    .then(function(response){
        return response.json();_
    })
    .then(response =>{
        renderOrder(response.data)
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

window.modalUpdateStatusOrder = function(orderId){
    var modalStatusOrder = document.getElementById("modalStatusOrder");
    var myModal = new bootstrap.Modal(document.getElementById("modalStatusOrder"), {});

    modalStatusOrder.setAttribute("orderId", orderId);
    myModal.show();

}

window.saveStatusOrder = function(){
    var modalStatusOrder = document.getElementById("modalStatusOrder");
    var orderId = modalStatusOrder.getAttribute("orderId");
    var status = document.querySelector("#modalStatusOrder #status");

    console.log(status);
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${accessToken}`
        },
        body: status.value
    }

    fetch(orderApi + `/UpdateStatusOrder/${orderId}`,options)
    .then(function(response){
        return response;_
    })
    .then(response =>{
        location.reload();
    })
}

window.modalListOrderDetails = function(orderId){
    var modalStatusOrder = document.getElementById("modalListOrderDetails");
    var myModal = new bootstrap.Modal(document.getElementById("modalListOrderDetails"), {});
    


    if(modalStatusOrder){
        console.log(2222);
        var options = {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            },
        }
    
        fetch(orderApi + `/GetDetailOrder?id=${orderId}`,options)
        .then(function(response){
            return response.json();
        })
        .then(response =>{
            renderModalStatusOrder(response);
            myModal.show();
        })     
       
    }

}

function renderModalStatusOrder(data){
    var listOrdeDetailBlock =  query("#modalListOrderDetails #list-order-details")
    console.log(data);

   
   var htmls = data.map(function(orderDetail){
    var m = new Date(orderDetail.createTime);
    var dateString = 
    ("0" + m.getUTCHours()).slice(-2) + ":" +
    ("0" + m.getUTCMinutes()).slice(-2) + ":" +
    ("0" + m.getUTCSeconds()).slice(-2) + " " +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    ("0" + m.getUTCDate()).slice(-2) + "/" +
    m.getUTCFullYear() ;
        return `
        <tr class="admin-product__data-${orderDetail.id}">
        <td>${dateString}</td>
        <td class="admin-product-table__col-img">
            <div class="admin-product-table__img" style="background-image: url('${orderDetail.imgPath}')"></div>
            <span>${orderDetail.title}</span>
        </td>
        <td class="text-bold-500">${orderDetail.quantity}</td>
        <td class="text-bold-500 admin-product-table__col-text">${orderDetail.price}</td>
        <td class="text-bold-500 admin-product-table__col-text">${orderDetail.discount}</td>
        <td class="admin-product-table__col-price">
            <span class="text-danger">${numberWithCommas(orderDetail.total)}đ</span> 
        </td>
       
        <td></td>
        <td>
        
        </td>
    </tr>
        
    `
   });

   listOrdeDetailBlock.innerHTML = htmls.join('');
}