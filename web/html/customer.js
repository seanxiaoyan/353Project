
function start() {
    // var removeOrderItemButtons = document.getElementsByClassName('btn-order-rm')
    // for (var i = 0; i < removeCartItemButtons.length; i++) {
    //     var button = removeCartItemButtons[i]
    //     button.addEventListener('click', removeOrderItemButtons)
    // }

    // var quantityInputs = document.getElementsByClassName('order-quantity-input')
    // for (var i = 0; i < quantityInputs.length; i++) {
    //     var input = quantityInputs[i]
    //     input.addEventListener('change', quantityChanged)
    // }

    var addToOrderButtons = document.getElementsByClassName('btn-add-item')
    
    console.log(addToOrderButtons)
    for (var i = 0; i < addToOrderButtons.length; i++) {
        var button = addToOrderButtons[i]
    
        button.addEventListener('click', addToOrderClicked)
    }

    // document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

// function purchaseClicked() {
//     alert('Thank you for your purchase')
//     var cartItems = document.getElementsByClassName('cart-items')[0]
//     while (cartItems.hasChildNodes()) {
//         cartItems.removeChild(cartItems.firstChild)
//     }
//     updateCartTotal()
// }

// function removeCartItem(event) {
//     var buttonClicked = event.target
//     buttonClicked.parentElement.parentElement.remove()
//     updateCartTotal()
// }

// function quantityChanged(event) {
//     var input = event.target
//     if (isNaN(input.value) || input.value <= 0) {
//         input.value = 1
//     }
//     updateCartTotal()
// }

function addToOrderClicked(event) {
    var button = event.target
    var orderRow = button.parentElement.parentElement

    var title = orderRow.getElementsByClassName('item-title')[0].innerText
    var price = orderRow.getElementsByClassName('item-price')[0].innerText
    addItemToOrder(title, price)
    // updateCartTotal()
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
            <button class="btn btn-rm" type="button">REMOVE</button>
        </div>`
    orderRow.innerHTML = orderRowContents
    orderItems.append(orderRow)
    // orderRow.getElementsByClassName('btn-rm')[0].addEventListener('click', removeCartItem)
    // orderRow.getElementsByClassName('order-quantity-input')[0].addEventListener('change', quantityChanged)
}

// function updateCartTotal() {
//     var cartItemContainer = document.getElementsByClassName('cart-items')[0]
//     var cartRows = cartItemContainer.getElementsByClassName('cart-row')
//     var total = 0
//     for (var i = 0; i < cartRows.length; i++) {
//         var cartRow = cartRows[i]
//         var priceElement = cartRow.getElementsByClassName('cart-price')[0]
//         var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
//         var price = parseFloat(priceElement.innerText.replace('$', ''))
//         var quantity = quantityElement.value
//         total = total + (price * quantity)
//     }
//     total = Math.round(total * 100) / 100
//     document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
// }