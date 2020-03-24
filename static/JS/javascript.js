var basket = {}

function goBack() {
    window.history.back()
}

function addBasket(item, price) {
    var int_price = JSON.parse(price)
    var stored = localStorage.getItem("basket")
    var result = JSON.parse(stored)

    if (item in result) {
        console.log('Already in cart')
        result[item] = result[item] + int_price

        // Update global basket
        var string_dict = JSON.stringify(result)
        localStorage.setItem("basket", string_dict)

        return
    }

    result[item] = int_price
    console.log(result)

    // Update global basket
    var string_dict = JSON.stringify(result)
    localStorage.setItem("basket", string_dict)
}

function showBasket(result) {
    console.log(result)
}

function totalAmount(result) {
    var prices = Object.values(result)
    console.log(prices.reduce((a,b) => a + b, 0))
}

function emptyBasket() {
    basket = {}

    // Update global basket
    var string_dict = JSON.stringify(basket)
    localStorage.setItem("basket", string_dict)
}
