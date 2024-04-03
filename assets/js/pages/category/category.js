import {
    URL_SERVER_LOCAL,
    PAGE_NUMBER_DEFAULT,
    PAGE_SIZE_DEFAULT,
    URL_CLIENT_LOCAL,
    query
} from '../../const.js';
import {checkLogin} from '../../checkLogged.js';
import logOut from '../../logout.js';
import  renderListCart from '../cart/listCart.js'

console.log("Category js");
//Global
var url = new URL(window.location.href)
var paramId = url.searchParams.get("id");
var productApi = URL_SERVER_LOCAL + "/api/Products/GetProductByCategory?categoryId="+paramId;
var categoryApi = URL_SERVER_LOCAL + "/api/Categories/categoryId=" + paramId;
var userApi = URL_SERVER_LOCAL + "/api/Users";
const detailRoute = URL_CLIENT_LOCAL + "/pages/product/detail_client.html"
//Variables
var pageNumber = 1;
var pageSize = 5;
var totalPages = 0;
var page = PAGE_NUMBER_DEFAULT;
var infoPage ={
    isPopularFilter : false,
    isNewestFilter : false,
    isBestSaleFilter : false,
    isPriceAsc : false,
    isPriceDesc : false,
    sortBy: 'new_desc',
    isLoadDefault: false
};


var ulTag = document.querySelector(".pagination");
var listHomeProduct = document.querySelector(".home-product>.grid__row");
var btnFilterPopular = document.querySelector(".home-filter__btn-popular");
var btnFilterNewest = document.querySelector(".home-filter__btn-newest");
var btnFilterBestSale = document.querySelector(".home-filter__btn-best-sale");
var btnFilterPriceAsc = document.querySelector(".select-input__link-price-asc");
var btnFilterPriceDesc = document.querySelector(".select-input__link-price-desc");
var elTotalPages = document.querySelector(".home-filter__page-total-page");
var elCurrentPages = document.querySelector(".home-filter__page-cur");
var btnPagePrev = document.querySelector(".home-filter__page-control-prev");
var btnPageNext = document.querySelector(".home-filter__page-control-next");
var elInputPrice = document.querySelector(".select-input__label");
var btnLogout = document.querySelector('.header__navbar-logout');
var btnRegister = query(".header__navbar-register");
var navUser = query('.header__navbar-user');
var btnLogin = query(".header__navbar-item-login");

async function start(){

    //Check user login  
    var infoLog =  await checkLogin();

    if(infoLog.isLogged) {
        navUser.classList.remove('hide');
        handleGetInfoUser(infoLog);
        console.log("Login")
        renderListCart();
    }else{
        
        console.log("not yet");
    }


    handleGetDefaultPage()
    .then(response => {
        totalPages = response.totalPages;
        page = response.pageNumber;
        elCurrentPages.textContent = page;
        elTotalPages.textContent = infoPage.totalPages;
        renderNavigationPaging(totalPages,page);
    })
}

start();
//Handle get default page
function handleGetDefaultPage(){

    return fetch(productApi + `&pageNumber=${pageNumber}&pageSize=${pageSize}`)
        .then(function(response){
            return response.json();_
        })
        .then(response =>{
            infoPage.pageNumber = response.pageNumber;
            infoPage.pageSize = response.pageSize;
            infoPage.totalPages = response.totalPages;
            infoPage.totalRecord = response.totalRecord;
            infoPage.currentPage = response.currentPage;
            infoPage.isLoadDefault = true;

            renderProduct(response.data)
            return response;
        });
        
}


//Handle render navigation paging 
function renderNavigationPaging(totalPages,page){
    var totalPages = totalPages;
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
                console.log(page);
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

//Handle render Home Products
function renderProduct(products){
    
    var html = products.map((product)=>{
        var imgURL = '';
        if(product.productImages.length !== 0){
            imgURL =  product.productImages[0].imagePath;
        }else{
            imgURL = '';
        }

        return `
        <div class="grid__column-2-4">
        <!-- Product item -->
        <a class="home-product-item" href='${detailRoute}?id=${product.id}'>
            <div class="home-product-item__img" 
            style="background-image: url('${
                URL_SERVER_LOCAL +'/'+ imgURL
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
            <div class="home-product-item__origin">
                <spam class="home-product-item__brand">Whoo</spam>
                <span class="home-product-item__origin-name">Nhật Bản</span>
            </div> 
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

//Pagination
window.Pagination = function(totalPages,page){  
    var sortBy = infoPage.sortBy;
    elCurrentPages.textContent = page;

    if(infoPage.isLoadDefault){
        fetch(productApi + `&pageNumber=${page}&pageSize=${pageSize}`)
        .then(function(response){
            return response.json();_
        })
        .then(response =>{
            renderProduct(response.data)
            renderNavigationPaging(totalPages,page);
        })
    }

}

//Handle click filter popular
btnFilterPopular.onclick = function(event) {
    event.preventDefault();

    if(!infoPage.isPopularFilter){
        console.log("popular filter click");

        fetch(productApi + `&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=popular_desc`)
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                renderProduct(response.data);
                infoPage.isPopularFilter = true;
                infoPage.isNewestFilter = false;
                infoPage.isBestSaleFilter = false;
                infoPage.sortBy = "popular_desc";
            })
        btnFilterPopular.classList.add("btn--primary");
        btnFilterNewest.classList.remove("btn--primary");
    }
}

//Handle click filter Newest
btnFilterNewest.onclick = function(event) {
    event.preventDefault();

    if(!infoPage.isNewestFilter){
        console.log("newest filter click");

        fetch(productApi + `&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=new_desc
            `)
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                renderProduct(response.data);
                infoPage.isPopularFilter = false;
                infoPage.isNewestFilter = true;
                infoPage.isBestSaleFilter = false;
                infoPage.sortBy = "new_desc";
            })
        btnFilterPopular.classList.remove("btn--primary");
        btnFilterNewest.classList.add("btn--primary");
    }
}

//Handle click filter Price Desc
btnFilterPriceAsc.onclick = function(event) {
    event.preventDefault();

    if(!infoPage.isPriceAsc){
        console.log("price asc filter click");

        fetch(productApi + 
            `&pageNumber=${pageNumber}&pageSize=${pageSize}
            &sortBy=price_asc
            `)
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                renderProduct(response.data);
                infoPage.isPopularFilter = false;
                infoPage.isNewestFilter = false;
                infoPage.isBestSaleFilter = false;
                infoPage.isPriceAsc = true;
                infoPage.isPriceDesc = false;
                infoPage.sortBy = "price_asc";
            })
            elInputPrice.textContent = "Giá: Thấp đến cao";
    
    }
}

//Handle click filter Price Desc
btnFilterPriceDesc.onclick = function(event) {
    event.preventDefault();

    if(!infoPage.isPriceDesc){
        console.log("price desc filter click");

        fetch(productApi + 
            `&pageNumber=${pageNumber}&pageSize=${pageSize}
            &sortBy=price_desc
            `)
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                renderProduct(response.data);
                infoPage.isPopularFilter = false;
                infoPage.isNewestFilter = false;
                infoPage.isBestSaleFilter = false;
                infoPage.isPriceAsc = false;
                infoPage.isPriceDesc = true;
                infoPage.sortBy = "price_desc";
            })

            elInputPrice.textContent = "Giá: Cao đến thấp";
    }
}

//Handle click filter page prev
btnPagePrev.onclick = function(event) {
    event.preventDefault();
    if(infoPage.pageNumber > 1){
        
        infoPage.pageNumber -=1;        
        Pagination(infoPage.totalPages,infoPage.pageNumber)
        if(infoPage.pageNumber === 1 ){
            
            btnPagePrev.classList.add("home-filter__page-btn--disabled");
            btnPageNext.classList.remove("home-filter__page-btn--disabled");
        }
    }
    
}
//Handle click filter page prev

btnPageNext.addEventListener('click', function(e) {
    e.preventDefault();
    if(infoPage.pageNumber < infoPage.totalPages){

        infoPage.pageNumber +=1;
        elCurrentPages.textContent = infoPage.pageNumber;
        Pagination(infoPage.totalPages,infoPage.pageNumber)

        if(infoPage.pageNumber === infoPage.totalPages ){
            
            btnPageNext.classList.add("home-filter__page-btn--disabled");
            btnPagePrev.classList.remove("home-filter__page-btn--disabled");
        }
    }
})

//render User
function handleGetInfoUser(infoLog){

    var navUserName = query('.header__navbar-user-name');
    fetch(userApi +'/GetInfo', {
        headers: {
            'Authorization' : `Bearer ${infoLog.accessToken}`
        },
    })
    .then(response => response.json())
    .then((data)=>{
        navUserName.textContent = data.userName;
        navUserName.style.textTransform = 'upperCase';
    })

    btnLogin.style.display = "none";
    btnRegister.style.display = "none";

}

//Handle click logOut

btnLogout.addEventListener('click', logOut);
