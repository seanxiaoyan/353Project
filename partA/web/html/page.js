
function addItemOnClick() {
    var addToOrderButtons = document.getElementsByClassName('btn-add-item');
    for (var i = 0; i < addToOrderButtons.length; i++) {
        var button = addToOrderButtons[i];
        button.addEventListener('click', function(event){
            var button = event.target;
            var orderRow = button.parentElement.parentElement;
        
            var title = orderRow.getElementsByClassName('item-title')[0].innerText;
            var price = orderRow.getElementsByClassName('item-price')[0].innerText;
            addItemToOrder(title, price);
            updateOrderTotal();
        });
    }
}
function submitOrderOnClick(){      
    var orderItems = document.getElementsByClassName('order-items')[0];
    var item_all="";
    for (var i = 0; i < orderItems.getElementsByClassName('order-item-title').length;i++){
        item_all += orderItems.getElementsByClassName('order-item-title')[i].innerText
        item_all +=" "
        item_all += (orderItems.getElementsByClassName('order-quantity-input')[i].value).toString()
        item_all +=";"
       
    }
    var total_price =document.getElementsByClassName('order-total-price')[0].innerText;
    var name =document.getElementById('customer_name');
    var inputName=encodeURIComponent(name.value);
    var http = new XMLHttpRequest();
    var url = '/newOrder';
    var params = "items="+item_all+"&"+"total="+total_price.substring(1)+"&"+"username="+inputName;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
          alert("Place order success\n");
        }
        if(http.readyState == 4 && http.status == 500) {
          alert("unaccept\n");
        }
      }
}
function removeItemOnClick(){
    var removeOrderItemButtons = document.getElementsByClassName('btn-rm');
    for (var i = 0; i < removeOrderItemButtons.length; i++) {
        var button = removeOrderItemButtons[i];
        button.addEventListener('click', function(event){
            event.target.parentElement.parentElement.remove();
            updateOrderTotal();
        });
    }
}
function quantityInputOnClick(){
    var quantityInputs = document.getElementsByClassName('order-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', function(event){
            var input = event.target;
            if (isNaN(input.value) || input.value <= 0) {
                input.value = 1;
            }
            updateOrderTotal();
        });
    }
}




function addItemToOrder(title, price) {
    var orderRow = document.createElement('div')
    orderRow.classList.add('order-row')
    var orderItems = document.getElementsByClassName('order-items')[0]
    var orderItemNames = orderItems.getElementsByClassName('order-item-title')
    for (var i = 0; i < orderItemNames.length; i++) {
        if (orderItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var orderRowContents = `
        <div class="order-item order-column">
            <span class="order-item-title">${title}</span>
        </div>
        <span class="order-price order-column">${price}</span>
        <div class="order-quantity order-column">
            <input class="order-quantity-input" type="number" value="1">
            <button class="btn-rm" type="button">REMOVE</button>
        </div>`
    orderRow.innerHTML = orderRowContents
    orderItems.append(orderRow)
    removeItemOnClick();
    quantityInputOnClick();
}

function updateOrderTotal() {
    var orderItemContainer = document.getElementsByClassName('order-items')[0]
    var orderRows = orderItemContainer.getElementsByClassName('order-row')
    var total = 0
    for (var i = 0; i < orderRows.length; i++) {
        var orderRow = orderRows[i]
        var priceElement = orderRow.getElementsByClassName('order-price')[0]
        var quantityElement = orderRow.getElementsByClassName('order-quantity-input')[0]
        var price = parseFloat(priceElement.innerText)
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('order-total-price')[0].innerText = '$' + total
}


function addItem() {
    var http = new XMLHttpRequest();
    var url = '/newItem';
    var item =document.getElementById("item")
    var inputItem = encodeURIComponent(item.value)
    var price =document.getElementById("price")
    var inputPrice = encodeURIComponent(price.value)
    var params = "item="+inputItem+"&"+"price="+inputPrice;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
    console.log()
    http.send(params);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
          alert("post success\n");
        }
        if(http.readyState == 4 && http.status == 500) {
          alert("unacceptable item/price\n");
        }
      }
  }
  function deleteItem() {
    var http = new XMLHttpRequest();
    var url = '/deleteItem';
    var item =document.getElementById("item")
    var inputItem = encodeURIComponent(item.value)
    var params = "item="+inputItem;
    http.open('DELETE', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
          alert(http.responseText);
        }
      }
  }

  

  function clearMenu(){
    var http = new XMLHttpRequest();
      http.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
        alert("menu now is clear!\n");
        }
      }
      http.open('GET',"/clearMenu",true)
      http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      http.send();
  }
  function submitLogin(){
    var http = new XMLHttpRequest();
    var url = '/auth';
    var uname =document.getElementById("username");
    var inputUname = encodeURIComponent(uname.value);
    var upassword =document.getElementById("password");
    var inputUpassword = encodeURIComponent(upassword.value);
    var inputRole = "employees"
    var params = "uname="+inputUname+"&"+"upassword="+inputUpassword
    +"&"+"role="+inputRole;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    console.log(params)
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status != 200) {
          alert(http.responseText);
        }
        if(http.readyState == 4 && http.status == 200) {
            window.location.replace(http.responseURL);
          }
      }
  }

  function submitRegister(){
    var http = new XMLHttpRequest();
    var url = '/register';
    var uname =document.getElementById("username");
    var inputUname = encodeURIComponent(uname.value);
    var upassword =document.getElementById("password");
    var inputUpassword = encodeURIComponent(upassword.value);
    var urole =document.getElementById("role");
    var inputRole = "employee"
    var params = "uname="+inputUname+"&"+"upassword="+inputUpassword
    +"&"+"role="+inputRole;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status != 200) {
          alert(http.responseText);
        }
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
          }
      }
  }

  function logout(){
    var http = new XMLHttpRequest();
    var url = '/logout';
    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(null);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            window.location.replace('http://localhost')
          }
      }
  }
  function login(){
    var http = new XMLHttpRequest();
    var url = '/login';
    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(null);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            window.open('http://localhost/login')
          }
      }
  }

  function cancelOrder(){
    var http = new XMLHttpRequest();
    var url = '/cancelOrder';
    var order_id =document.getElementById("cancel-order");
    var id = encodeURIComponent(order_id.value);
  
    var params = "order_id="+id;
    console.log(params);
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status != 200) {
          alert(http.responseText);
        }
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
          }
      }
  }
  function updateOrder(){
    var http = new XMLHttpRequest();
    var url = '/updateOrder';
    var order_id =document.getElementById("update-order-id");
    var id = encodeURIComponent(order_id.value);
    var order_status =document.getElementById("update-order-status");
    var status = encodeURIComponent(order_status.value);
  
    var params = "order_id="+id+"&"+"order_status="+status;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status != 200) {
          alert(http.responseText);
        }
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
          }
      }
  }