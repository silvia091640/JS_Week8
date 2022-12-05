// 請代入自己的網址路徑
const api_path = "silvia";
const token = "V97UzLNDHVgVG01yVSHij21VAmQ2";

const orderForm=document.querySelector(".orderPage-table");
const discardAll=document.querySelector(".discardAllBtn");

let orderList="";
let c3Data=[];
function init()
{
    getOrderList();
    
}

// 取得訂單列表
function getOrderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        orderList=response.data;
        // console.log(response.data);
        renderOrderList();
        renderC3data();
      })
      .catch(function (error) {
        // 失敗會回傳的內容
        console.log(error);
      })
  }

// 修改訂單狀態
function editOrderList(orderId) {
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        "data": {
          "id": orderId,
          "paid": true
        }
      },
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        getOrderList();
      })
      .catch(function (error) {
        // 失敗會回傳的內容
        console.log(error);
      })
  }

  // 刪除全部訂單
function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      getOrderList();
      // console.log(response.data);
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })
}


  // 刪除特定訂單
function deleteOrderItem(orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        getOrderList();
      })
      .catch(function (error) {
        // 失敗會回傳的內容
        console.log(error);
      })
  }
  
//渲染訂單畫面
  function renderOrderList(){
    let str="";
    let productTitle="";
    c3Data=[];
   
    orderList.orders.forEach(function(item,index){
        let orderDate = new Date(item.createdAt * 1000);
        orderDate=`${orderDate.getFullYear()}/${orderDate.getMonth()+1}/${orderDate.getDate()}`;
        item.products.forEach(function(item,index){
            productTitle+=`<p>${item.title}<p>`;
        })
        str+=` <tr>
        <td>${item.createdAt}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${productTitle}</p>
        </td>
        <td>${orderDate}</td>
        <td class="orderStatus">
          <a href="#" class="isPaid" data-id=${item.id}>${item.paid==false ? "未處理":"已處理"}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" data-id=${item.id} value="刪除">
        </td>
    </tr>`
    })
    str=` <thead>
    <tr>
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單日期</th>
        <th>訂單狀態</th>
        <th>操作</th>
    </tr>
</thead>`+str;
    orderForm.innerHTML=str;

}

//清除全部按鈕監聽
discardAll.addEventListener("click",function(e){
  if(confirm("確定清除全部訂單資訊？")){
    if(orderList.orders.length==0){
      alert("無訂單資訊，無法刪除！！");
      return;
    }
    deleteAllOrder();
  }

})
//訂單清單按鈕監聽
orderForm.addEventListener("click",function(e){
  e.preventDefault();
   
    const btnClass=e.target.getAttribute("class");
    if(btnClass =="isPaid"){
      if(confirm("確定修改訂單狀態？"))
      {       
          const orderId=e.target.getAttribute("data-id");
          editOrderList(orderId);

        }
       
    }
    else if(btnClass =="delSingleOrder-Btn"){
      if(confirm("確定清除此筆訂單資訊？"))
      {
        const orderId=e.target.getAttribute("data-id");
        deleteOrderItem(orderId);
      }
    }
    
  })
  

  //渲染C3圖示
function renderC3data(){
  let totalObj={};
  orderList.orders.forEach(function(item){
      item.products.forEach(function(item){
          if(item.title==totalObj[item.title]){
              totalObj[item.title]+=item.quantity*item.price;
          }
          else{
              totalObj[item.title]=item.quantity*item.price;
              // totalColor[item.title]="#DACBFF";
          }    

      })

  })
 

    // 全品項營收
let totalAry = Object.entries(totalObj);
totalAry.sort((a, b) => {
  return b[1] - a[1];
});

  let dataAry=Object.keys(totalObj);
  // console.log(dataAry);


  let otherTotal=0;
  dataAry.forEach(function(item,index){

      let ary = [];
      //計算其他類，金額相加
      if(index>2){
          otherTotal+=totalObj[item];
      }
      else{
          ary.push(item);
          ary.push(totalObj[item]);
          c3Data.push(ary);
      }
     
      
  })

  if (dataAry.length>3)
  {
      let aryOther = [];
      aryOther.push("其他");
      aryOther.push(otherTotal);
      c3Data.push(aryOther);
  }
 
  // console.log(ary);
  // console.log(c3Data);

  // C3.js
  let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
      type: "pie",
      columns:      
      c3Data,
   
  },
});


}
//初始化
  init();
  

