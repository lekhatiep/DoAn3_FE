// export {totalPages, page as pageNumber, Pagination};

var ulTag = document.querySelector(".pagination");
var totalPages = 20;
var page = 1;

console.log(ulTag);
function Pagination(totalPages,page){
    var liTag = '';
    var liActive ;
    var beforePages = page - 1; //5 - 1 = 4 
    var afterPages = page + 1;//5 + 1 = 6

    if(page>1){//if page values if greater than 1 then add new li which is previous button
        liTag += `<li class="pagination-item" onclick="Pagination(totalPages,${page - 1})">
        <div class="pagination-item__link">
            <i class="pagination-item-icon fa-solid fa-angle-left"></i>
        </div>
    </li>`;
    }

    if(page>2){//if page greater than 2 then add new li tag with 1 value
        liTag +=` <li class="pagination-item" onclick="Pagination(totalPages,1)">
        <div  class="pagination-item__link">1</div>
        </li>`;
        if(page > 3){//if page greater than 3 then add new li tag with (...)
            liTag +=`<li class="pagination-item">
            <a href="" class="pagination-item__link">...</a>
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
        
        liTag +=` <li class="pagination-item ${liActive}" onclick="Pagination(totalPages,${pageLength})">
        <div  class="pagination-item__link">${pageLength}</div>
        </li>`;
    }

    //If page value less than totalPages by - 1 then show the last li or page which is 20
    if(page < totalPages - 1 ){      
        if(page < totalPages - 2){//If page value less than totalPages by - 1 then show the last li or page which is 20
            liTag +=`<li class="pagination-item">
            <a href="" class="pagination-item__link">...</a>
            </li>`; 
        }
        liTag +=` <li class="pagination-item" onclick="Pagination(totalPages,totalPages)">
        <div  class="pagination-item__link">${totalPages}</div>
        </li>`; 
    }

    if(page < totalPages){//if page values if less than totalPages then add new li which is next button
        liTag +=` <li class="pagination-item" onclick="Pagination(totalPages, ${page + 1})">
        <div class="pagination-item__link">
            <i class="pagination-item-icon fa-solid fa-angle-right"></i>
        </div>
    </li>`;
    }
    ulTag.innerHTML = liTag;
}

Pagination(totalPages, page)