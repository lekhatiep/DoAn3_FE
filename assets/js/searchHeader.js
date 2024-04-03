import {URL_CLIENT_LOCAL, URL_SERVER_LOCAL} from './const.js'
import { getCookie, setCookie } from './storeCookie.js';
import { getSession, setSession } from './storeSession.js';

//Variables
const pageSize = 10;
const $ = document.querySelector.bind(document);//Query

var inputSearch = $('.header__search-input');
var titleSearch = $('.header__search-history-heading');
var historySearchList = $('.header__search-history-list');
var historySearchDiv = $('.header__search-history');
var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms, 5 seconds for example
var historySearch = JSON.parse(getSession('historySearch'));
var productApi = URL_SERVER_LOCAL + '/api/Products/GetProductByName';
var bodyEl = document.getElementsByTagName("BODY")[0];

var btnSearch = $('.header__search-btn');

function start(){
 
    if (historySearch !== null) {
        renderHistorySearch(historySearch);
    }else{
        historySearch = [];
    }
}

start();


historySearchDiv.addEventListener('click',function(e){
    e.stopPropagation();
    return false;
})

function searchHeader(searchString){
    console.log('Search header');

    fetch(productApi + `?pageNumber=1&pageSize=${pageSize}&Search=${searchString}`)
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{

            if(res.data.length > 0){

                historySearch.push(searchString)
                setSession('historySearch', JSON.stringify(historySearch));
                console.log(res);

                titleSearch.innerText = ''
                historySearchList.style.display = 'block';
    
                renderResult(res.data);
            }else{
                titleSearch.innerText = 'Không tìm thấy kết quả'
                historySearchList.style.display = 'block';
                historySearchList.innerHTML = '';
            }
            
           
        })
   
}

//on keyup, start the countdown
inputSearch.addEventListener('keyup', function () {
    console.log(typingTimer);
    clearTimeout(typingTimer);

    typingTimer = setTimeout(()=> searchHeader(inputSearch.value), doneTypingInterval);
    
  });
  
  //on keydown, clear the countdown 
inputSearch.addEventListener('keydown', function () {
    clearTimeout(typingTimer);
});


//user is "finished typing," do something
function doneTyping () {
    //do something
    console.log('Searching....');
}

//Render result list

function renderResult(data) {

    var html = data.map(item=>{

        return `<li class="header__search-history-item">
            <a href="/pages/category/list-product.html?id=${item.categoryId}" class="header__search-history-link">
                ${item.title}
            </a>
        </li>
        `
    })

    historySearchList.innerHTML = html.join('');
}

// renderHistorySearch

function renderHistorySearch(data){

    var html = data.map(item=>{
        return `<li class="header__search-history-item">
            <a href="#" class="header__search-history-link" onclick="clickHistory(this)">
                ${item}
            </a>
        </li>
        `
    })

    historySearchList.innerHTML = html.join('');
}

//clickHistory

window.clickHistory = function(e) {

    var text = e.innerText;
 
    inputSearch.value = text;
    searchHeader(text);
    
}

// Handle onfocus input
inputSearch.onfocus = ()=>{
    historySearchDiv.style.display = 'block';
    if (historySearch !== null) {
        renderHistorySearch(historySearch);
    }else{
        historySearch = [];
    }


}

//prevent click propagation
inputSearch.addEventListener('click', function(e) {
    e.stopPropagation();
    return false;
})
historySearchDiv.addEventListener('click', function(e) {
    e.stopPropagation();
    return false;
})


bodyEl.addEventListener("click", bodyClick)

function bodyClick(){
    historySearchDiv.style.display = 'none';
}

//handle button search

btnSearch.onclick = ()=> {
 
    if(inputSearch.value.trim() !== '' || inputSearch.value !== null){
        searchHeader(inputSearch.value);
    }
    
}