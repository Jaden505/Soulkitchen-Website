// Guards for newcomers
if (localStorage.getItem("basket") == null) {localStorage.setItem("basket", JSON.stringify({}))}
if (localStorage.getItem("amounts") == null) {localStorage.setItem("amounts", JSON.stringify({}))}

function goBack() {
    window.history.back()
}

function addBasket(item, price) {
    var int_price = JSON.parse(price)
    var rounded = Math.round((int_price + 0.00001) * 100) / 100
    var stored = localStorage.getItem("basket")
    var result = JSON.parse(stored)

    var stored_amounts = localStorage.getItem("amounts")
    var amounts = JSON.parse(stored_amounts)

    if (item in amounts) {
        result[item] = result[item] / amounts[item]
        amounts[item] += 1
    } else {
        amounts[item] = 1
    }

    if (item in result) {
        console.log('Already in cart')
        result[item] = result[item] * amounts[item]

        // Update global basket
        localStorage.setItem("basket", JSON.stringify(result))
        localStorage.setItem("amounts", JSON.stringify(amounts))

        updateBasket()
        console.log(result)

        return
    }

    result[item] = rounded
    console.log(result)

    // Update global basket
    localStorage.setItem("basket", JSON.stringify(result))
    localStorage.setItem("amounts", JSON.stringify(amounts))

    updateBasket()
}

function showBasket(stored) {
    console.log(stored)
}

function totalAmount(result) {
    var prices = Object.values(result)
    var sum = prices.reduce((a,b) => a + b, 0) * 100
    var rounded_sum = Math.round((sum + 0.00001) * 100) / 10000

    console.log(rounded_sum)

    return rounded_sum
}

function emptyBasket() {
    // Update global basket
    var string_dict = JSON.stringify({})
    localStorage.setItem("basket", string_dict)
    localStorage.setItem("amounts", string_dict)

    updateBasket()
}

function tryCheckout() {
    var stored = localStorage.getItem("basket")
    var result = JSON.parse(stored)
    var total = totalAmount(result)

    console.log(total)

    if (Object.keys(result).length !== 0) {
        console.log()
        window.location.href = "/order/" + (total * 100)
    }
}

function updateBasket() {
    var stored = localStorage.getItem("basket")
    var result = JSON.parse(stored)
    var stored_amounts = localStorage.getItem("amounts")
    var parsed_amounts = JSON.parse(stored_amounts)

    var products = Object.keys(result)
    var prices = Object.values(result)
    var amounts = Object.values(parsed_amounts)

    // Round up the price
    prices.forEach(function(part, index, arr) {
      arr[index] = Math.round((arr[index] + 0.00001) * 100) / 100;
      console.log(arr[index])
    });

    if (Object.keys(result).length === 0) {
        document.getElementById('products').innerHTML = ('<p>Your basket is empty</p>')

        return
    }

    for (let i = 0; i < products.length; i++) {
        createProduct(products[i], prices[i], amounts[i])
    }

}

function createProduct(product, price, amount) {
    var div = document.createElement("div")
    div.className = 'product'

    div.innerHTML = (`<br><p class="product">${product}</p><p class="price">${price}</p><p class="amount">${amount}</p><br>`)

    //div.appendChild(content)
    document.body.appendChild(div)
}

function addAmount(item) {
    var stored_amounts = localStorage.getItem("amounts")
    var amounts = JSON.parse(stored_amounts)

    amounts[item] += 1
}

function removeAmount(item) {
    var stored_amounts = localStorage.getItem("amounts")
    var amounts = JSON.parse(stored_amounts)

    amounts[item] += 1
}

function sendMail() {

}
