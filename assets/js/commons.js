export {
    encodeURLFirebase,
    numberWithCommas,
    stringOfOrderStatus,
    colorOrderStatus
};

function encodeURLFirebase(url){
    const baseUrl = url.split("?")[0];
    const queryString = url.split("?")[1]; 
    const encodedBaseUrl = baseUrl.replace(/\/images\//g, "/images%2F");;
    const encodedUrl = encodedBaseUrl + "?" + queryString;
    return encodedUrl;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function stringOfOrderStatus(status){
    switch (parseInt(status)) {
        case 1:
            return "Đang xử lý"
            break;
        case 2:
            return "Xác nhận đơn hàng"

        break;
        case 3:
            return "Đang giao hàng"
        break;
        case 4:
            return "Đã giao hàng"
        break;
        case 5:
            return "Đã hủy"
            break;
        default:
            break;
    }
}

function colorOrderStatus(status){
    switch (parseInt(status)) {
        case 1:
            return "#FFA500 "
            break;
        case 2:
            return "#FFD700"

        break;
        case 3:
            return "#32CD32 "
        break;
        case 4:
            return "#008000"
        break;
        case 5:
            return "#FF0000"
            break;
        default:
            break;
    }
}