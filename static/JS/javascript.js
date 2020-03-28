function goBack() {
    window.history.back()
}

function addBasket(item, price) {
    var int_prices = JSON.parse(price)
    var rounded = Math.round(int_prices * 10) / 10
    var stored = localStorage.getItem("basket")
    var result = JSON.parse(stored)

    if (item in result) {
        console.log('Already in cart')
        result[item] = Math.round((result[item] + rounded) * 10) /10

        // Update global basket
        var string_dict = JSON.stringify(result)
        localStorage.setItem("basket", string_dict)

        updateBasket()
        console.log(result)

        return
    }

    result[item] = rounded
    console.log(result)

    // Update global basket
    var string_dict = JSON.stringify(result)
    localStorage.setItem("basket", string_dict)

    updateBasket()
}

function showBasket(stored) {
    console.log(stored)
}

function totalAmount(result) {
    var prices = Object.values(result)

    console.log(prices.reduce((a,b) => a + b, 0))

    return prices.reduce((a,b) => a + b, 0)
}

function emptyBasket() {
    // Update global basket
    var string_dict = JSON.stringify({})
    localStorage.setItem("basket", string_dict)

    updateBasket()
}

function tryCheckout() {
    var stored = localStorage.getItem("basket")
    var result = JSON.parse(stored)
    var total = totalAmount(result)

    if (Object.keys(result).length !== 0) {
        window.location.href = "/order/" + (total * 100)
    }
}

function updateBasket() {
    var stored = localStorage.getItem("basket")
    var result = JSON.parse(stored)
    var products = Object.keys(result)
    var prices = Object.values(result)

    if (Object.keys(result).length === 0) {
        document.getElementById('products').innerHTML = ('<p>Your basket is empty</p>')
        document.getElementById('prices').innerHTML = ''

        return
    }

    document.getElementById('products').innerHTML = ('<br>' + products)
    document.getElementById('prices').innerHTML = ('<br>' + prices)
}

