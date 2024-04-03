import {URL_CLIENT_LOCAL, URL_SERVER_LOCAL} from '../../const.js'
import  {setCookie,getCookie} from '../../storeCookie.js';
import  {setSession,getSession} from '../../storeSession.js';
import {checkLogin, autoRedirect} from '../../checkLogged.js'
import {renderInfoUser} from '../../Users/user.js'
import logOut from '../../logout.js';
//Get variables
var redirectFrom = location.pathname;
const $ = document.querySelector.bind(document);//Query

var divCartList = $(".content__cart-list-wrap");
var quantityTotal = $(".cart__purchase-quantity-total");
var grandTotal = $(".cart__purchase-price-total");
var btnCheckAll = $(".cart__purchase-input");
var textCheckAll = $(".cart__purchase-text");
var headerCheckAll = $(".header__list-cart-checkbox");
var btnPurchase = $(".cart__purchase-btn");
var btnLogout = $('.header__navbar-logout');

var cartApi = URL_SERVER_LOCAL + '/api/Carts';

var accessToken = '';
async function start(){

    var infoLog = await checkLogin();
    if(!infoLog.isLogged){
        autoRedirect(redirectFrom);
       
    }else{
        renderInfoUser(infoLog.accessToken);
        accessToken = infoLog.accessToken;
        await getListCart()
    }
    

    
    var isCheckAllBottom = getSession('isCheckAllBottom');
    var isCheckAllHeader = getSession('isCheckAllHeader');

    isCheckAllBottom === 'true' ? btnCheckAll.checked = true : btnCheckAll.checked = false;
    isCheckAllHeader === 'true' ? headerCheckAll.checked = true : headerCheckAll.checked = false;

   
}

start();

// document.addEventListener("visibilitychange", function() {
//     if (document.visibilityState === 'visible') {
//         start();
//     } 
// });

//getListCart
 async function getListCart(){

     await fetch(cartApi + '/GetListCart',{
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            },
        })
        .then(response=>{
            return response.json();
        })
        .then((res)=>{
            setCookie('listCart',JSON.stringify(res),30)
            renderListCartUser();
            
        })
        .catch(er=>{
            console.log(er);
        })
}


//Hanlde render list cart user

function renderListCartUser(){

    var data = JSON.parse(getCookie('listCart'));
    var contentCart = $('.content__cart-warp');
    var contentNoCart = $('.no-cart');

    if(data === null || data.length === 0){
        contentCart.style.display = 'none';
        contentNoCart.style.display = 'block';
        console.log('no cart')
        
    }else{
        contentCart.style.display = 'block';
        contentNoCart.style.display = 'none';

       

        var html = '';

         data.forEach((item,index)=>{
            html+= `<div class="content__cart-list-item">
            <input type="checkbox" class="content__cart-item-checkbox check-item-${index}" ${(item.active === true)? 'checked' :'' }>
            <div class="content__cart-item-info">
                <a href="">
                    <div class="content__cart-item-info-img" style="background-image: url(${URL_SERVER_LOCAL+ item.imgPath});"></div>
                </a>
                <div class="content__cart-wrap-title">
                    <a href="" class="content__cart-item-info-title">                  
                        ${item.title}                   
                    </a>
                    
                </div>
            </div>
            <div class="content__cart-item-price">${numberWithCommas(item.price)} đ</div>
            <div class="content__cart-item-quantity">
                <div class="content__cart-warp-quantity">
                    <div class="content__cart-warp-minus minus-item-${index}" data-id='${item.id}'>
                        <i class="content__cart-minus fa-solid fa-minus"></i>
                    </div>
                    <div class="content__cart-warp-current">
                        <input type="text" class="product__quantity-current product__quantity-${index}"  value="${item.quantity}">
                    </div>
                    <div class="content__cart-warp-plus plus-item-${index}" data-id='${item.id}'">
                        <i class="content__cart-plus fa-solid fa-plus"></i>
                    </div>
                </div>
            </div>
            <div class="content__cart-item-total item-total-${index}">${numberWithCommas(item.total)} đ</div>
            <div class="content__cart-item-action">
                <div class="content__cart-item-remove remove__item-${index}" onclick=removeFromCart('${item.id}')>Xóa</div>
            </div>
        </div>
            `
            
        });
    
        divCartList.innerHTML = html;

    }
    UpdateData();
    calculateTotal();
   
}

//Handle update data
function UpdateData() {  
    
    var listCartItemsEl = document.querySelectorAll('.content__cart-list-item');
    
    

    listCartItemsEl.forEach((element,index) => {
        var plusItem = $('.plus-item-'+index);
        var minusItem = $('.minus-item-'+index);
        var btnRemove = $('.remove__item-'+index);
        var checkboxItem = $('.check-item-'+index);
        var active = false;
        const id = plusItem.dataset.id;
        var quantityItem = $('.product__quantity-'+index);
        var inputQuantity = $('.product__quantity-'+ index )

        //Handle btn (+)
        plusItem.onclick =  function(){

            var currentValue = parseInt( inputQuantity.value);

            inputQuantity.value = currentValue + 1;
            
            UpdateItem(plusItem.dataset.id, inputQuantity.value, checkboxItem.checked?true:false);
            
        }
        
        //Handle btn (-)

        var currentValue = parseInt(inputQuantity.value);
        if(inputQuantity.value <= 1){
            inputQuantity.value = 1;
        }else{
            
            minusItem.onclick =  function(){
                inputQuantity.value = currentValue - 1;

                if(inputQuantity.value <= 1){
                    inputQuantity.value = 1;
                }
                UpdateItem(plusItem.dataset.id, inputQuantity.value,checkboxItem.checked?true:false)
            }
        }
       
         //Handle input quantity

         quantityItem.onblur = ()=>{

            var currentValue = parseInt(quantityItem.value);
            if (typeof(currentValue) === 'number' && !isNaN(currentValue)) {
                quantityItem.value = currentValue;
            }else{
                quantityItem.value = 1;
            }

            UpdateItem(plusItem.dataset.id, quantityItem.value,checkboxItem.checked?true:false)
        }

        quantityItem.addEventListener("keypress", function(event) {
            // If the user presses the "Enter" key on the keyboard
            if (event.key === "Enter") {
              // Cancel the default action, if needed
              event.preventDefault();
              // Trigger the button element with a click
              var currentValue = parseInt(quantityItem.value);
              if (typeof(currentValue) === 'number' && !isNaN(currentValue)) {
                  quantityItem.value = currentValue;
              }else{
                  quantityItem.value = 1;
              }
  
              UpdateItem(plusItem.dataset.id, quantityItem.value)
            }
          });

        //Handle btn remove

        btnRemove.onclick = function(){
            
            console.log('del')
            var listCartTemp = JSON.parse(getCookie('listCart'));
            
            for (let i = 0; i < listCartTemp.length; i++) {
                if (listCartTemp[i].id === id) {
                    listCartTemp.splice(i, 1);
                }
            }

            var options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${accessToken}`
                },
                body: JSON.stringify(listCartTemp)
            }
            
             fetch(cartApi+'/UpdateOrRemoveCartItem', options)
                .then(response => {
                    if(response.status === 200){
                        getListCart();
                    } 
                    response.json()
                })
                .catch((error) => {
                    console.log(error);
                })

        }

        //Hanlde check an item

        checkboxItem.onchange = function(event){
            if(checkboxItem.checked){
                active = true;
                UpdateItem(id,parseInt(quantityItem.value),active)  

            }else{
                
                active = false;
                UpdateItem(id,parseInt(quantityItem.value),active) 
            }
        }    

    });
}

function UpdateItem(id, quantity,active) {
    
    var data = {
        id : id,
        quantity: quantity,
        active: active
    }

    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
    }
    
    fetch(cartApi+'/UpdateItem', options)
        .then(function(response)   
            {
                if(response.status === 200){
                    getListCart();
                    calculateTotal();
                   
                }
                return response.json();
            }           
        )
        .then( async () =>{   
            //await getListCart();          
        })
        .catch((error) => {
            
        })
        
        
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function removeCommasNumber(x){
    return x.toString().replace(/\./g,'')
}

//Hanlde calculate total

function calculateTotal(){
    console.log('re-calculateTotal');
    var listCartItemsEl = document.querySelectorAll('.content__cart-list-item');
    

    var currenTotalQuanityItem = 0;
    var currentGrandTotal = 0;

    listCartItemsEl.forEach((element,index) => {
        var checkboxItem = $('.check-item-'+index);
        if(checkboxItem.checked){
            
            var total = $('.item-total-'+index);
            var quantity = $('.product__quantity-'+index).value;
            currentGrandTotal += parseInt(removeCommasNumber(total.innerHTML));   
            currenTotalQuanityItem += parseInt(quantity);
        }
    })
    

    grandTotal.innerText = numberWithCommas(currentGrandTotal);
    quantityTotal.innerText = currenTotalQuanityItem;

}


//Check all item 

btnCheckAll.onchange =  function(){

    var listCartItemsEl = document.querySelectorAll('.content__cart-list-item');

    listCartItemsEl.forEach((element,index) => {
        var plusItem = $('.plus-item-'+index);
        const id = plusItem.dataset.id;

        var quantityItem = $('.product__quantity-'+index);
        var checkboxItem = $('.check-item-'+index);

        if(!checkboxItem.checked && btnCheckAll.checked ){
            checkboxItem.checked  = true;
            setSession('isCheckAllBottom',true)
            setSession('isCheckAllHeader',false)
            UpdateItem(plusItem.dataset.id, quantityItem.value,checkboxItem.checked)
        }
        
        if(checkboxItem.checked && !btnCheckAll.checked)
        {
            checkboxItem.checked  = false;
            setSession('isCheckAllBottom',false)
            UpdateItem(plusItem.dataset.id, quantityItem.value,checkboxItem.checked)
        }
    })
}


headerCheckAll.onchange = function(){
    
    var listCartItemsEl = document.querySelectorAll('.content__cart-list-item');

    listCartItemsEl.forEach((element,index) => {
        var plusItem = $('.plus-item-'+index);
        const id = plusItem.dataset.id;

        var quantityItem = $('.product__quantity-'+index);
        var checkboxItem = $('.check-item-'+index);

        if(!checkboxItem.checked && headerCheckAll.checked){
            checkboxItem.checked  = true;
     
            setSession('isCheckAllHeader',true)
            setSession('isCheckAllBottom',false)
            UpdateItem(plusItem.dataset.id, quantityItem.value,checkboxItem.checked)
        }
        
        if(checkboxItem.checked && !headerCheckAll.checked )
        {
            setSession('isCheckAllHeader',false)
            checkboxItem.checked  = false;
            
            UpdateItem(plusItem.dataset.id, quantityItem.value,checkboxItem.checked)
        }     
    })
}

//Hanlde click btn purchase 
btnPurchase.onclick = function(){

    window.location.href = `${URL_CLIENT_LOCAL}/pages/order`;
}

//Handle click logOut

btnLogout.addEventListener('click', logOut);