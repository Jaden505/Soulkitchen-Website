// Guards for newcomers
if (localStorage.getItem("basket") == null) {localStorage.setItem("basket", JSON.stringify({}))}
if (localStorage.getItem("amounts") == null) {localStorage.setItem("amounts", JSON.stringify({}))}

function goBack() {
    window.history.back()
}

/*
 currency.js - v1.2.2
 http://scurker.github.io/currency.js

 Copyright (c) 2019 Jason Wilson
 Released under MIT license
*/
(function(d,c){"object"===typeof exports&&"undefined"!==typeof module?module.exports=c():"function"===typeof define&&define.amd?define(c):(d=d||self,d.currency=c())})(this,function(){function d(b,a){if(!(this instanceof d))return new d(b,a);a=Object.assign({},m,a);var f=Math.pow(10,a.precision);this.intValue=b=c(b,a);this.value=b/f;a.increment=a.increment||1/f;a.groups=a.useVedic?n:p;this.s=a;this.p=f}function c(b,a){var f=2<arguments.length&&void 0!==arguments[2]?arguments[2]:!0,c=a.decimal,g=a.errorOnInvalid;
var e=Math.pow(10,a.precision);var h="number"===typeof b;if(h||b instanceof d)e*=h?b:b.value;else if("string"===typeof b)g=new RegExp("[^-\\d"+c+"]","g"),c=new RegExp("\\"+c,"g"),e=(e*=b.replace(/\((.*)\)/,"-$1").replace(g,"").replace(c,"."))||0;else{if(g)throw Error("Invalid Input");e=0}e=e.toFixed(4);return f?Math.round(e):e}var m={symbol:"$",separator:",",decimal:".",formatWithSymbol:!1,errorOnInvalid:!1,precision:2,pattern:"!#",negativePattern:"-!#"},p=/(\d)(?=(\d{3})+\b)/g,n=/(\d)(?=(\d\d)+\d\b)/g;
d.prototype={add:function(b){var a=this.s,f=this.p;return d((this.intValue+c(b,a))/f,a)},subtract:function(b){var a=this.s,f=this.p;return d((this.intValue-c(b,a))/f,a)},multiply:function(b){var a=this.s;return d(this.intValue*b/Math.pow(10,a.precision),a)},divide:function(b){var a=this.s;return d(this.intValue/c(b,a,!1),a)},distribute:function(b){for(var a=this.intValue,f=this.p,c=this.s,g=[],e=Math[0<=a?"floor":"ceil"](a/b),h=Math.abs(a-e*b);0!==b;b--){var k=d(e/f,c);0<h--&&(k=0<=a?k.add(1/f):k.subtract(1/
f));g.push(k)}return g},dollars:function(){return~~this.value},cents:function(){return~~(this.intValue%this.p)},format:function(b){var a=this.s,c=a.pattern,d=a.negativePattern,g=a.formatWithSymbol,e=a.symbol,h=a.separator,k=a.decimal;a=a.groups;var l=(this+"").replace(/^-/,"").split("."),m=l[0];l=l[1];"undefined"===typeof b&&(b=g);return(0<=this.value?c:d).replace("!",b?e:"").replace("#","".concat(m.replace(a,"$1"+h)).concat(l?k+l:""))},toString:function(){var b=this.s,a=b.increment;return(Math.round(this.intValue/
this.p/a)*a).toFixed(b.precision)},toJSON:function(){return this.value}};return d});

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
    var sum = prices.reduce((a,b) => currency(a).add(b), 0)

    return sum
}

function emptyBasket() {
    // Update global basket
    var string_dict = JSON.stringify({})
    localStorage.setItem("basket", string_dict)
    localStorage.setItem("amounts", string_dict)

    document.querySelectorAll(".total")[0].innerHTML = ''
    if (document.querySelectorAll(".total").length > 1) {document.querySelectorAll(".total")[1].innerHTML = ''}
    document.getElementById('cart_amount').innerHTML = '[0]'

    updateBasket()
}

function tryCheckout() {
    var result = JSON.parse(localStorage.getItem("basket"))
    var amounts = JSON.parse(localStorage.getItem("amounts"))
    var total = totalAmount(result)

    if (Object.keys(result).length > 0 && Object.keys(amounts).length > 0 && total > 10) {
        location.href = "/order/" + (total) // Goes to amount page and gives amount to checkout page
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
    if (document.getElementById('cart_amount').innerHTML == 1) {document.getElementsByClassName("dropdown-content")[0].style.display = 'block'}

    //Round up the price 2 decimals
    prices.forEach(function(part, index, arr) {
        arr[index] = currency(arr[index])
    });

    document.querySelectorAll(".total")[0].innerHTML = 'Total: €' + total
    if (document.querySelectorAll(".total").length > 1) {document.querySelectorAll(".total")[1].innerHTML = 'Total: €' + total}
    document.querySelectorAll(".basket")[0].innerHTML = ''
    if (document.querySelectorAll(".basket").length > 1) {document.querySelectorAll(".basket")[1].innerHTML = ''}

    if (Object.keys(result).length === 0) {
        document.querySelectorAll(".basket")[0].innerHTML = ('<p>Je winkel mandje is leeg</p>')
    if (document.querySelectorAll(".basket").length > 1) {document.querySelectorAll(".basket")[1].innerHTML = '<p>Je winkel mandje is leeg</p>'}

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
        `<br><i class="fa fa-trash-o" onclick="removeProduct(\`${product}\`)"></i> <span class="prod">${product} </span>` +
        `<button class="plus" onclick="addBasket(\`${product}\`, \`${price}\`)">+</button><span class="am"> ${amount} </span>` +
        `<button class="minus" onclick="removeAmount(\`${product}\`, \`${price}\`, \`${amount}\`)">-</button>` +
        `<span class="pric"> €${price} </span><br><br>`
)
    document.querySelectorAll(".basket")[0].appendChild(div)
    if (document.querySelectorAll(".basket").length > 1) {document.querySelectorAll(".basket")[1].appendChild(div)}
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

  var header = document.getElementById("ftco-navbar");
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
  var form = document.getElementById('payment-form');

  // Add an instance of the idealBank Element into
  // the `ideal-bank-element` <div>
  idealBank.mount('#ideal-bank-element');

  form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Redirects away from the client
  stripe.confirmIdealPayment(
    pay_details,
    {
      payment_method: {
        ideal: idealBank,
      },
      return_url: 'https://sassies-soulkitchen.herokuapp.com/confirmation/',
    }
  )
  })
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

function dropdownBasket() {
    var modal = document.getElementsByClassName("dropdown-content")[0];
    var basket = document.getElementById("basket_icon");
    var close = document.getElementsByClassName("close")[0];

    basket.onclick = function() {
      modal.style.display = "block";
    }

    close.onclick = function() {
      modal.style.display = "none";
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}
