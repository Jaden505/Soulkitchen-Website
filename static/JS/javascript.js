// Guards for newcomers
if (localStorage.getItem("basket") == null) {localStorage.setItem("basket", JSON.stringify({}))}
if (localStorage.getItem("amounts") == null) {localStorage.setItem("amounts", JSON.stringify({}))}

function goBack() {
    window.history.back()
}

function addBasket(item, price) {
    var rounded = Math.round((JSON.parse(price) + 0.00001) * 100) / 100
    var result = JSON.parse(localStorage.getItem("basket"))

    var amounts = JSON.parse(localStorage.getItem("amounts"))

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

function removeAmount(item, price, amount) {
    var result = JSON.parse(localStorage.getItem("basket"))

    var amounts = JSON.parse(localStorage.getItem("amounts"))

    if (item in amounts) {
        result[item] = result[item] * (amount-1) / amount
        amounts[item] -= 1
    }

    if (amounts[item] === 0) {
        delete result[item]
        delete amounts[item]
    }

    // Update global basket
    localStorage.setItem("basket", JSON.stringify(result))
    localStorage.setItem("amounts", JSON.stringify(amounts))

    updateBasket()
}

function totalAmount(result) {
    var prices = Object.values(result)
    var sum = prices.reduce((a,b) => a + b, 0) * 100
    var rounded_sum = Math.round((sum + 0.00001) * 100) / 10000

    return rounded_sum
}

function emptyBasket() {
    // Update global basket
    var string_dict = JSON.stringify({})
    localStorage.setItem("basket", string_dict)
    localStorage.setItem("amounts", string_dict)

    document.getElementById('total').innerHTML = ''

    updateBasket()
}

function tryCheckout() {
    var result = JSON.parse(localStorage.getItem("basket"))
    var amounts = JSON.parse(localStorage.getItem("amounts"))
    var total = totalAmount(result)

    if (Object.keys(result).length !== 0 && Object.keys(amounts).length !== 0 && total > 10) {
        location.href = "/order/" + (total * 100)
    }
    else {
        alert('The minimum is 10 euro')
    }
    return false
}

function tryOrder() {
    var result = JSON.parse(localStorage.getItem("basket"))
    var amounts = JSON.parse(localStorage.getItem("amounts"))
    var total = totalAmount(result)

    if (Object.keys(result).length !== 0 && Object.keys(amounts).length !== 0 && total > 10) {
        location.href = "/order"
    }
    else {
        alert('The minimum is 10 euro')
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

    var total = totalAmount(result)
    document.getElementById('total').innerHTML = 'Total: ' + total

    // Round up the price
    prices.forEach(function(part, index, arr) {
      arr[index] = Math.round((arr[index] + 0.00001) * 100) / 100;
    });

    document.getElementById('basket').innerHTML = ''

    if (Object.keys(result).length === 0) {
        document.getElementById('basket').innerHTML = ('<p>Your basket is empty</p>')

        return
    }

    for (let i = 0; i < products.length; i++) {
        createProduct(products[i], prices[i], amounts[i])
    }

}

function createProduct(product, price, amount) {
    var div = document.createElement("div")

    div.className = 'product'

    div.innerHTML = (
        `<br><p class="prod">${product}</p><p class="pric">${price}</p><p class="am">${amount}</p>` +
        `<button onclick="addBasket(\`${product}\`, \`${price}\`)">plus</button>` +
        `<button onclick="removeAmount(\`${product}\`, \`${price}\`, \`${amount}\`)">minus</button><br><br>`
)

    document.getElementById('basket').appendChild(div)
}

var counter = 0
function Categorize(product) {
    var articles = document.getElementsByClassName('article')

    if (product === '1') {product = 'broodjes'}
    else if (product === '2') {product = 'drinken'}
    else if (product === '3') {product = 'extras'}
    else if (product === 'bvdw') {product = 'bvdw'}

    document.getElementById(product).appendChild(articles[counter])
    counter++
}

