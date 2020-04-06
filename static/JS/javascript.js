// Guards for newcomers
if (localStorage.getItem("basket") == null) {localStorage.setItem("basket", JSON.stringify({}))}
if (localStorage.getItem("amounts") == null) {localStorage.setItem("amounts", JSON.stringify({}))}

function goBack() {
    window.history.back()
}

function addBasket(item, price) {
    var parsed_price = JSON.parse(price)
    var result = JSON.parse(localStorage.getItem("basket"))

    var amounts = JSON.parse(localStorage.getItem("amounts"))

    if (item in amounts) {
        result[item] = result[item] / amounts[item]
        amounts[item] += 1
    } else {
        amounts[item] = 1
    }

    if (item in result) {
        result[item] = result[item] * amounts[item]

        // Update global basket
        localStorage.setItem("basket", JSON.stringify(result))
        localStorage.setItem("amounts", JSON.stringify(amounts))

        updateBasket()

        return
    }

    result[item] = parsed_price

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
    var sum = prices.reduce((a,b) => parseFloat(a) + parseFloat(b), 0).toFixed(2)

    return sum
}

function emptyBasket() {
    // Update global basket
    var string_dict = JSON.stringify({})
    localStorage.setItem("basket", string_dict)
    localStorage.setItem("amounts", string_dict)

    document.getElementById('total').innerHTML = ''
    document.getElementById('cart_amount').innerHTML = '[0]'

    updateBasket()
}

function tryCheckout() {
    var result = JSON.parse(localStorage.getItem("basket"))
    var amounts = JSON.parse(localStorage.getItem("amounts"))
    var total = totalAmount(result)

    if (Object.keys(result).length > 0 && Object.keys(amounts).length > 0 && total > 10) {
        location.href = "/order/" + (total * 100) // Goes to amount page and gives amount to checkout page
    }
    else {
        location.href = "/checkout"
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
        location.href = "/menu"
    }
}

function updateBasket() {
    var result = JSON.parse(localStorage.getItem("basket"))
    var many = JSON.parse(localStorage.getItem("amounts"))

    var products = Object.keys(result)
    var prices = Object.values(result)
    var amounts = Object.values(many)

    var basket_products_amounts = amounts.reduce((a,b) => a + b, 0)

    var total = totalAmount(result)

    // Basket counter
    document.getElementById('cart_amount').innerHTML = basket_products_amounts

    //Round up the price 2 decimals
    prices.forEach(function(part, index, arr) {
      arr[index] = Math.round((arr[index] + 0.00001) * 100) / 100;
      arr[index].toFixed(2)
    });

    document.getElementById('total').innerHTML = 'Total: ' + total
    document.getElementById('basket').innerHTML = ''

    if (Object.keys(result).length === 0) {
        document.getElementById('basket').innerHTML = ('<p>Your basket is empty</p>')

        return
    }

    // Loops and creates div elements containing given products
    for (let i = 0; i < products.length; i++) {
        createProduct(products[i], prices[i], amounts[i])
    }

}

function createProduct(product, price, amount) {
    var div = document.createElement("div")

    div.className = 'product'

    div.innerHTML = (
        `<br><span class="am">${amount} </span><span class="prod">${product} </span>` +
        `<button class="plus" onclick="addBasket(\`${product}\`, \`${price}\`)">+</button>` +
        `<button class="minus" onclick="removeAmount(\`${product}\`, \`${price}\`, \`${amount}\`)">-</button>` +
        `<span class="pric"> ${price} </span><button onclick="removeProduct(\`${product}\`)">Remove</button><br><br>`
)

    document.getElementById('basket').appendChild(div)
}

var counter = 0
function Categorize(product) {
    var articles = document.getElementsByClassName('product')

    if (product === '1') {product = 'broodjes'}
    else if (product === '2') {product = 'drinken'}
    else if (product === '3') {product = 'extras'}
    else if (product === 'bvdw') {product = 'bvdw'}

    document.getElementById(product).appendChild(articles[counter])
    counter++
}


function removeProduct(item) {
    var result = JSON.parse(localStorage.getItem("basket"))
    var amounts = JSON.parse(localStorage.getItem("amounts"))

    delete result[item]
    delete amounts[item]

    // Update global basket
    localStorage.setItem("basket", JSON.stringify(result))
    localStorage.setItem("amounts", JSON.stringify(amounts))

    updateBasket()
}

function basketShowToggle() {
    var toggle = document.querySelector(".dropdown-content");
    if (toggle.style.display == "block"){
      toggle.style.display = "none";
    } else {
       toggle.style.display = "block";
    }
}

function stickyNavbar() {
  window.onscroll = function() {Moving()};

  var header = document.getElementById("navbar");
  var sticky = header.offsetTop;

  function Moving() {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }
}

function Payment(pay_details, public_key) {
  var stripe = Stripe(public_key);
  var elements = stripe.elements();

  var options = {
  // Custom styling can be passed to options when creating an Element
  style: {
    base: {
      padding: '12px 2px',
      color: '#32325d',
      fontSize: '18px',
      '::placeholder': {
        color: '#aab7c4'
      },
    },
  },
  };

  // Create an instance of the idealBank Element
  var idealBank = elements.create('idealBank', options);

  // Add an instance of the idealBank Element into
  // the `ideal-bank-element` <div>
  idealBank.mount('#ideal-bank-element');

  function RedirectPayment() {
    addEventListener('submit', function(event) {
    event.preventDefault();

    // Redirects away from the client
    stripe.confirmIdealPayment(
      pay_details,
      {
        payment_method: {
          ideal: idealBank,
        },
        return_url: 'http://127.0.0.1:8000/confirmation/',
      }
    )
    })
    return false
  }
  Payment.RedirectPayment = RedirectPayment
}

function Display() {
    document.getElementById("bvdw").style.display = 'none'
    document.getElementById("broodjes").style.display = 'none'
    document.getElementById("drinken").style.display = 'none'
    document.getElementById("extras").style.display = 'none'

    if(document.getElementById('cat_alles').checked) {
      document.getElementById("bvdw").style.display = 'block'
      document.getElementById("broodjes").style.display = 'block'
      document.getElementById("drinken").style.display = 'block'
      document.getElementById("extras").style.display = 'block'
    }
    else if(document.getElementById('cat_broodjes').checked) {
      document.getElementById("broodjes").style.display = 'block'
    }
    else if(document.getElementById('cat_drinken').checked) {
      document.getElementById("drinken").style.display = 'block'
    }
    else if(document.getElementById('cat_extras').checked) {
      document.getElementById("extras").style.display = 'block'
    }
}
