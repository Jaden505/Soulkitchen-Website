(function(d,c){"object"===typeof exports&&"undefined"!==typeof module?module.exports=c():"function"===typeof define&&define.amd?define(c):(d=d||self,d.currency=c())})(this,function(){function d(b,a){if(!(this instanceof d))return new d(b,a);a=Object.assign({},m,a);var f=Math.pow(10,a.precision);this.intValue=b=c(b,a);this.value=b/f;a.increment=a.increment||1/f;a.groups=a.useVedic?n:p;this.s=a;this.p=f}function c(b,a){var f=2<arguments.length&&void 0!==arguments[2]?arguments[2]:!0,c=a.decimal,g=a.errorOnInvalid;
var e=Math.pow(10,a.precision);var h="number"===typeof b;if(h||b instanceof d)e*=h?b:b.value;else if("string"===typeof b)g=new RegExp("[^-\\d"+c+"]","g"),c=new RegExp("\\"+c,"g"),e=(e*=b.replace(/\((.*)\)/,"-$1").replace(g,"").replace(c,"."))||0;else{if(g)throw Error("Invalid Input");e=0}e=e.toFixed(4);return f?Math.round(e):e}var m={symbol:"$",separator:",",decimal:".",formatWithSymbol:!1,errorOnInvalid:!1,precision:2,pattern:"!#",negativePattern:"-!#"},p=/(\d)(?=(\d{3})+\b)/g,n=/(\d)(?=(\d\d)+\d\b)/g;
d.prototype={add:function(b){var a=this.s,f=this.p;return d((this.intValue+c(b,a))/f,a)},subtract:function(b){var a=this.s,f=this.p;return d((this.intValue-c(b,a))/f,a)},multiply:function(b){var a=this.s;return d(this.intValue*b/Math.pow(10,a.precision),a)},divide:function(b){var a=this.s;return d(this.intValue/c(b,a,!1),a)},distribute:function(b){for(var a=this.intValue,f=this.p,c=this.s,g=[],e=Math[0<=a?"floor":"ceil"](a/b),h=Math.abs(a-e*b);0!==b;b--){var k=d(e/f,c);0<h--&&(k=0<=a?k.add(1/f):k.subtract(1/
f));g.push(k)}return g},dollars:function(){return~~this.value},cents:function(){return~~(this.intValue%this.p)},format:function(b){var a=this.s,c=a.pattern,d=a.negativePattern,g=a.formatWithSymbol,e=a.symbol,h=a.separator,k=a.decimal;a=a.groups;var l=(this+"").replace(/^-/,"").split("."),m=l[0];l=l[1];"undefined"===typeof b&&(b=g);return(0<=this.value?c:d).replace("!",b?e:"").replace("#","".concat(m.replace(a,"$1"+h)).concat(l?k+l:""))},toString:function(){var b=this.s,a=b.increment;return(Math.round(this.intValue/
this.p/a)*a).toFixed(b.precision)},toJSON:function(){return this.value}};return d});

// Guards for newcomers
if (localStorage.getItem("basket") == null) {localStorage.setItem("basket", JSON.stringify({}))}
if (localStorage.getItem("amounts") == null) {localStorage.setItem("amounts", JSON.stringify({}))}

// ADDERS AND REMOVERS
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

    result[item] = currency(parsed_price)

    // Update global basket
    localStorage.setItem("basket", JSON.stringify(result))
    localStorage.setItem("amounts", JSON.stringify(amounts))

    updateBasket()
}

function changeAmount(item, price, amount) {
    var result = JSON.parse(localStorage.getItem("basket"))
    var amounts = JSON.parse(localStorage.getItem("amounts"))

    result[item] = result[item] * amount / (amounts[item])
    amounts[item] = Number(amount)

    if (amounts[item] < 1) {
        delete result[item]
        delete amounts[item]
    }

    // Update global basket
    localStorage.setItem("basket", JSON.stringify(result))
    localStorage.setItem("amounts", JSON.stringify(amounts))

    updateBasket()
}

function removeProduct(item) {
    var result = JSON.parse(localStorage.getItem("basket"))
    var amounts = JSON.parse(localStorage.getItem("amounts"))

    delete result[item]
    delete amounts[item]

    // Update global basket
    localStorage.setItem("basket", JSON.stringify(result))
    localStorage.setItem("amounts", JSON.stringify(amounts))
}

// TOTALS
function totalAmount() {
    var result = JSON.parse(localStorage.getItem("basket"))
    var prices = Object.values(result)
    var shipping_costs = 4
    var sub_total = currency(prices.reduce((a,b) => currency(a).add(b), 0))
    var coupon = JSON.parse(localStorage.getItem("couponcode"))

    if (coupon !== null) {
        var discount = (Object.values(coupon)[0]) / 100
        var discount_price = currency(sub_total).multiply(discount)
        var total_price = currency(sub_total).subtract(discount_price).add(shipping_costs)
        var total = total_price

            try {displayDiscountPrices(sub_total, discount_price, total_price, coupon)}
            catch {// pass
            }
    }
    else {
        var sum = sub_total.add(shipping_costs)
        var total = sum

        try {displayPrices(sum, sub_total)}
        catch {// pass
         }
    }

    return total
}

function emptyBasket() {
    // Update global basket
    var string_dict = JSON.stringify({})
    localStorage.setItem("basket", string_dict)
    localStorage.setItem("amounts", string_dict)

    updateBasket()
    updateAmount()
}

// UPDATES
function updateBasket() {
    var result = JSON.parse(localStorage.getItem("basket"))
    var many = JSON.parse(localStorage.getItem("amounts"))

    var products = Object.keys(result)
    var prices = Object.values(result)
    var amounts = Object.values(many)

    var basket_products_amounts = amounts.reduce((a,b) => a + b, 0)

    //Round up the price 2 decimals
    prices.forEach(function(part, index, arr) {
        arr[index] = currency(arr[index])
    });

    updateAmount()

    // HTML ELEMENTS
    updateCartAmount(basket_products_amounts)

    // When on order page create/update products
    try {
        Create()
    }
    catch {
        //pass
    }
}

function updateAmount() {
    coupon_code = JSON.parse(localStorage.getItem("couponcode"))
    if (coupon_code != null) {
        coupon_code = Object.keys(coupon_code)[0]
    }

    total = totalAmount()
    cart_products = localStorage.getItem("basket")

    // Sends encrypted data to view
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/order/' + btoa(total) + '/' + btoa(coupon_code) + '/' + btoa(cart_products) + '/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        'Total': btoa(total),
        'Coupon': btoa(coupon_code)
    }));
}

// PAYMENTS
function Payment(pay_details, public_key) {
  var stripe = Stripe(public_key);
  var elements = stripe.elements();

  var idealBank = elements.create('idealBank');
  var form = document.getElementById('payment-form');

  idealBank.mount('#ideal-bank-element');

  idealBank.on('ready', function(event) {

        stripe
          .confirmIdealPayment(pay_details, {

            payment_method: {
              ideal: idealBank,
            },
            // Return URL where the customer should be redirected after the authorization.
            return_url: window.location.href,
          })

  });
}

// OTHERS
var counter = 0
function Categorize(category) {
    if (category === '1') {category = 'broodjes'}
    else if (category === '2') {category = 'drinken'}
    else if (category === '3') {category = 'extras'}
    else if (category === 'bvdw') {category = 'bvdw'}

    sortProductsCategory(category, counter)
    counter++
}

function couponSuccess(input_code, discount) {
    var dict = {[input_code]: discount}
    localStorage.setItem("couponcode", JSON.stringify(dict))

    totalAmount()
}

function couponError() {
    localStorage.setItem("couponcode", null)

    couponErrorDisplay()

    totalAmount()
}

function setDayData(day) {
    localStorage.setItem("day", JSON.stringify(day))
}

