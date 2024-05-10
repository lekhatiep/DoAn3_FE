import {URL_CLIENT_LOCAL, URL_HOSTING_LOCAL, URL_SERVER_LOCAL} from '../../const.js'
import  {setCookie,getCookie} from '../../storeCookie.js';
import  {setSession,getSession} from '../../storeSession.js';
import {checkLogin, autoRedirect} from '../../checkLogged.js';
import {renderInfoUser} from '../../Users/user.js'
import logOut from '../../logout.js';
import  renderListCart from '../../pages/cart/listCart.js'
import {colorOrderStatus, stringOfOrderStatus} from '../../commons.js'
//Get variables
var orderApi = URL_SERVER_LOCAL + '/api/Orders';
var categoryApi = URL_SERVER_LOCAL + "/api/Categories";
var redirectFrom = location.pathname;
// Variables 
const $ = document.querySelector.bind(document);//Query

var tabAll = $(".header__tabs-all");
var tabConfirm = $(".header__tabs-confirm");
var tabWaiting = $(".header__tabs-wait-receive");
var tabShip = $(".header__tabs-shipping");
var tabDelivery = $(".header__tabs-delivered");
var tabCancel = $(".header__tabs-cancel");
var tabDefault = $(".defaultOpen");
var noContentTab = $('.purchase__no-content');
var btnLogout = $('.header__navbar-logout');
var listFooterCategory = document.querySelector(".footer-list__category");

var statusOrder = {
    all : 0,
    confirm: 1,
    waiting: 2,
    shipping : 3,
    delivered: 4,
    cancel : 5,
}
var idTabActive = '';
var accessToken = '';
async function start() {

    var infoLog = await checkLogin();
    if(!infoLog.isLogged){
        autoRedirect(redirectFrom);
       
    }else{

        accessToken = infoLog.accessToken;
        renderInfoUser(infoLog.accessToken);
        renderListCart();
        handleGetListCategory(function(response){
            renderListCategory(response.data);
        });
    }
    //Hanlde click each tab
    tabAll.addEventListener('click', e => openTab(e,'all'), false);
    tabConfirm.addEventListener('click', e => openTab(e,'confirm'), false);
    tabWaiting.addEventListener('click', e => openTab(e,'waiting'), false);
    tabShip.addEventListener('click', e => openTab(e,'shipping'), false);
    tabDelivery.addEventListener('click', e => openTab(e,'delivered'), false);
    tabCancel.addEventListener('click', e => openTab(e,'cancel'), false);
    tabDefault.click();
}

start();




function openTab(event, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.querySelectorAll(".tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.querySelectorAll(".tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";

    event.currentTarget.className += " active";
    
    //Show list 
    var status = '';
    switch (tabName) {
        case 'all':
            status = statusOrder.all;
            idTabActive = '#all';
            break;
        case 'confirm':
            status = statusOrder.confirm;
            idTabActive = '#confirm';
            break;
        case 'waiting':
            status = statusOrder.waiting;
            idTabActive = '#waiting';
            break;
        case 'shipping':
            status = statusOrder.shipping;
            idTabActive = '#shipping';
            break;
        case 'delivered':
            status = statusOrder.delivered;
            idTabActive = '#delivered';
            break;
        case 'cancel':
            status = statusOrder.cancel;
            idTabActive = '#cancel';
            break;
        default:
            break;
    }

    getListPurchaseWithStatus(status);
  }

//Handle get list ordered 

function getListPurchaseWithStatus(status){

    // string
     fetch(orderApi + `/HistoryOrderByUser?status=${status}`, {
   
        headers: {
            'Authorization' : `Bearer ${accessToken}`
        },
        })
        .then(response=>{
            return response.json();
        })
        // .then(data=>{
        //     console.log(data);
        // })
        .then((res)=>{
            renderPurchaseItem(res); 
        })
        .catch(er=>{
            console.log(er);
        })
}

//Handle render purchase Item waiting

function renderPurchaseItem(data) {
    if(data.length === 0){
        noContentTab.classList.add("show")

    }else
    {
        noContentTab.classList.remove("show")

        var purchaseItemList = $(idTabActive+'>.purchase__list');
    
        var html = '';
        var htmls = data.map((item,index) => {

            var strStatus = stringOfOrderStatus(item.status);
            var colorStatus = colorOrderStatus(item.status);
            var htmlStatus = `
                <div class="item__status" style="color: ${colorStatus}">
                    <i class="fa-solid  ${stringIconStatus(status)}" style="color: ${colorStatus}"></i>
                    ${strStatus}
                    <i class="fa-regular fa-circle-question item__status-icon-question"></i>
                </div>
                `;

             return`
            <div class="purchase__list-item">
                <div class="purchase__item-wrap">
                    <div class="purchase__item-header-warp">
                        <div class="col-12 col-md-6 purchase__item-header-left">
                            <i class="fa-solid fa-store item__store-icon"></i>
                            <span class="item__store-name">Whoo</span>
                            <div class="item__store-chatbox">
                                <i class="fa-solid fa-comments item__store-chatbox-icon"></i>
                                Chat
                            </div>
                            <div class="item__store-goto">
                                <i class="fa-solid fa-store item__store-goto-icon"></i>
                                Xem shop
                            </div>
                        </div>

                        <div class="col-6 d-none d-md-flex justify-content-end purchase__item-header-right">
                            ${htmlStatus}
                        </div>
                    </div>
                           
                    <div class="purchase__item-content">
                        
                        <div class="col-10 item__info">
                            <div class="col-3 col-sm-2 col-lg-1 item__info-img" style="background-image: url('${item.imgPath}') ;"></div>
                            <div class="col-8 col-md-6 item__info-details">
                                <div class="col-12 item__info-title">${item.title}</div>
                                <div class="col-12 item__info-type">Phân loại:</div>
                                <div class="col-12 item__info-quantity">x ${item.quantity}</div>
                            </div>
                        </div>
                        <div class="col-2 col-md-1 item__price">
                            <span class="item__price-original">${numberWithCommas(item.price)}</span>đ
        
                            ${item.discount > 0? `<span class="item__price-promotion text-primary-color">${item.discount} </span> <span class="text-primary-color">đ</span>` : ""}
                        </div>
                    </div>
                </div>
                
                <div class="purchase__item-footer"> 
                    <div class="col-12 d-flex d-md-none purchase__item-header-right">
                        <div class="item__status">
                            <i class="fa-solid fa-truck item__status-icon"></i>
                            Giao hàng thành công
                        </div>
                    </div>
                    <div class="item__total">
                        <i class="item__total-icon fa-solid fa-shield-virus"></i>  Tổng số tiền:
                        <span class="item__total-text text-primary-color">${numberWithCommas(item.total)} đ</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center item__total-wrap">
                        <div class="item__comment">
                            Không nhận được đánh giá
                        </div>
                        <div class="d-flex justify-content-center align-items-center btn btn--primary item__reorder-btn reoder-${index}" data-id = ${item.productId}>Mua lại</div>
                    </div>
                </div>
            </div>
            `
        });
    
        //purchaseItemList.innerHTML = htmls.join(' ');
        purchaseItemList.innerHTML = htmls.join(' ')
        HandleListItem();
    }
    
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


//Handle on list item 

function HandleListItem(){

    var purchaseItemList = document.querySelectorAll(idTabActive+'>.purchase__list>.purchase__list-item');


    purchaseItemList.forEach((item,index) => {


        var btnReorder = $('.reoder-'+index);
    
        btnReorder.onclick = ()=>{
            var productId = btnReorder.dataset.id;

            window.location.href = URL_HOSTING_LOCAL + '/pages/product/detail_client.html?id='+productId;

        }
    });
}

//Handle click logOut

btnLogout.addEventListener('click', logOut);

//Handle render purchase item: All

function renderPurchaseItemAll() {
    
}

function handleGetListCategory(callback){

    fetch(categoryApi +"?pageNumber=1&pageSize=20")
        .then(function(response){
            return response.json();
        })
        .then(callback)

}

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

function stringIconStatus(status){
    switch (parseInt(status)) {
        case 1:
            return "fa-clock";
            break;
        case 2:
            return "fa-clipboard-check"
        break;
        case 3:
            return "fa-truck"
        break;
        case 4:
            return "fa-check"
        break;
        case 5:
            return "fa-trash"
            break;
        default:
            break;
    }
}