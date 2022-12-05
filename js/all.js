// 請代入自己的網址路徑
const api_path = "silvia";
const token = "V97UzLNDHVgVG01yVSHij21VAmQ2";

let productList="";
let cardList="";
const productWrap=document.querySelector(".productWrap");
const productSelect=document.querySelector(".productSelect");
const shoppingCart=document.querySelector(".shoppingCart-table");
const addOrderInfo=document.querySelector(".orderInfo-btn");
const orderInfoForm=document.querySelector(".orderInfoForm");

//初始化
function init(){
    getProductList();
    getCartList();
    // console.log(orderInfo);

}
// 取得產品列表
function getProductList() {
    
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
        productList=response.data.products;
        
      renderProductList();

     
    })
    .catch(function(error){
      //console.log(error.response.data)
    })
}


// 取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      cardList=response.data;
      renderCardList();
      // console.log(cardList);
    })
}



function renderProductList(){
    let str="";
    productList.forEach(function(item,index){
        str+=`<li class="productCard">
        <h4 class="productType">新品</h4>
        <span class="productCategory">${item.category}</span>
        <img src=${item.images} alt="">
        <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$ ${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
    </li>`
    })
    productWrap.innerHTML=str;


}

function renderCardList(){
  let str="";
  cardList.carts.forEach(function(item,index){
    str+=`<tr>
  <td>
      <div class="cardItem-title">
          <img src=${item.product.images} alt="">
          <p>${item.product.title}</p>
      </div>
  </td>
  <td>NT$${item.product.price}</td>
  <td>${item.quantity}</td>
  <td>NT$${item.product.price *item.quantity}</td>
  <td class="discardBtn">
      <a href="#" class="material-icons deleteCart" data-id=${item.id}>
          clear
      </a>
  </td>
</tr>`;

  })
  str=`<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
</tr>`+str+`<tr>
  <td>
      <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td>
      <p>總金額</p>
  </td>
  <td>NT$${cardList.finalTotal}</td>
  </tr>`

  shoppingCart.innerHTML=str;
}


//加入購物車
function addCartItem(productId) {
  let numCheck=1;
  //相同購買項目時，數字相加
  cardList.carts.forEach(function(item,index){
    if(item.product.id==productId){
      numCheck++;
    }
  })
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    data: {
      "productId": productId,
      "quantity": numCheck
    }
  }).
    then(function (response) {
      cardList=response.data;
      renderCardList();
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })

}

// 清除購物車內全部產品
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      cardList=response.data;
      getCartList();
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })
}

// 刪除購物車內特定產品
function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
    then(function (response) {
      cardList=response.data;
      getCartList();
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })
}

// 送出購買訂單
function addOrder(orderInfo) {

  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      data:{
        user:orderInfo
      }
    }
  ).
    then(function (response) {
      cardList="";
      getCartList();
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })
}


//產品搜尋監聽
productSelect.addEventListener("change",function(e){
  let content="";
  let aryFilter=productList.filter(function(item){
    return e.target.value=="全部" ? true : e.target.value==item.category ? true : false ;

  })
  aryFilter.forEach(function(item,index){
    
    content+=`<li class="productCard">
        <h4 class="productType">新品</h4>
        <span class="productCategory">${item.category}</span>
        <img src=${item.images} alt="">
        <a href="#" class="addCardBtn">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$ ${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
    </li>`
  })
  productWrap.innerHTML=content;

});

//加入購物車按鈕監聽
productWrap.addEventListener("click",function(e){
  e.preventDefault();
  const addCard=e.target.getAttribute("class");
  if(addCard !="addCardBtn"){
    console.log("你沒點到購物車");
      return;
  }
  const productId=e.target.getAttribute("data-id");
  addCartItem(productId);
  getCartList();
})


//購物車按鈕監聽
shoppingCart.addEventListener("click",function(e){
  e.preventDefault(); 
  const deleteCart=e.target.getAttribute("class");
  if(deleteCart.includes("deleteCart")){
    if(confirm("確定刪除此筆購物車資訊？")){
      const cartId=e.target.getAttribute("data-id");
      deleteCartItem(cartId);
    }
    
  }
  else if (deleteCart=="discardAllBtn"){
    if(confirm("確定刪除全部購物車資訊？")){
      if(cardList.carts.length==0){
        alert("無購物車資訊，無法刪除！！");
        return;
      }
    //執行清除全部購物車函式
    deleteAllCartList();
      
    }
  }

})

//預訂資訊按鈕監聽
addOrderInfo.addEventListener("click",function(e){
  e.preventDefault();
  const customerName=document.querySelector("#customerName");
const customerPhone=document.querySelector("#customerPhone");
const customerEmail=document.querySelector("#customerEmail");
const customerAddress=document.querySelector("#customerAddress");
const payment=document.querySelector("#payment");
  const orderInfo={};
  orderInfo.name=customerName.value;
  orderInfo.tel=customerPhone.value;
  orderInfo.email=customerEmail.value;
  orderInfo.address=customerAddress.value;
  orderInfo.payment=payment.value;

  addOrder(orderInfo);

  document.getElementById("orderInfoForm").reset();


})




init();




