import {URL_CLIENT_LOCAL, URL_SERVER_LOCAL} from '../../const.js'
import  {setCookie,getCookie} from '../../storeCookie.js';
import  {setSession,getSession} from '../../storeSession.js';
import {checkLogin, autoRedirect} from '../../checkLogged.js';
import {renderInfoUser} from '../../Users/user.js'
import logOut from '../../logout.js';
import  renderListCart from '../../pages/cart/listCart.js'
//Get variables
var orderApi = URL_SERVER_LOCAL + '/api/Orders';
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

var statusOrder = {
    all : 'all',
    confirm: 'Confirm',
    waiting: 'Processing',
    shipping : 'Shipping',
    delivered: 'Delivered',
    cancel : 'Cancel',
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

    console.log('status: '+status);

    fetch(orderApi + `/HistoryOrderByUser?status=${status}`, {
        headers: {
            'Authorization' : `Bearer ${accessToken}`
        },
        })
        .then(response=>{
            return response.json();
        })
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
             return`
            <div class="purchase__list-item">
            <div class="purchase__item-wrap">
                <div class="purchase__item-header-warp">
                    <div class="purchase__item-header-left">
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
                    <div class="purchase__item-header-right">
                        <div class="item__status">
                            <i class="fa-solid fa-truck item__status-icon"></i>
                            Giao hàng thành công
                            <i class="fa-regular fa-circle-question item__status-icon-question"></i>
                            <span class="item__status-text">ĐÃ GIAO</span>
                        </div>
                    </div>
                </div>
    
                <div class="purchase__item-content">
                    <div class="item__info">
                        <div class="item__info-img" style="background-image: url('${URL_SERVER_LOCAL+ item.imgPath}') ;"></div>
                        <div class="item__info-details">
                            <div class="item__info-title">${item.title}</div>
                            <div class="item__info-type">Phân loại:</div>
                            <div class="item__info-quantity">x ${item.quantity}</div>
                        </div>
                    </div>
                    <div class="item__price">
                        <span class="item__price-original">${numberWithCommas(item.price)}</span> đ
    
                        ${item.discount > 0? `<span class="item__price-promotion text-primary-color">${item.discount} </span> <span class="text-primary-color">đ</span>` : ""}
                    </div>
                </div>
            </div>
            <div class="purchase__item-footer">
    
                <div class="item__comment">
                    Không nhận được đánh giá
                </div>
                <div class="item__total-wrap">
                    <div class="item__total">
                        <i class="item__total-icon fa-solid fa-shield-virus"></i>  Tổng số tiền:
                        <span class="item__total-text text-primary-color">${numberWithCommas(item.total)} đ</span>
                    </div>
                    <div class="btn btn--primary item__reorder-btn reoder-${index}" data-id = ${item.productId}>Mua lại</div>
                    <div class="btn item__contact-btn">Liên Hệ Người bán</div>
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
        console.log(btnReorder);

        btnReorder.onclick = ()=>{
            var productId = btnReorder.dataset.id;

            window.location.href = URL_CLIENT_LOCAL + '/pages/product/detail_client.html?id='+productId;

        }
    });
}

//Handle click logOut

btnLogout.addEventListener('click', logOut);

//Handle render purchase item: All

function renderPurchaseItemAll() {
    
}