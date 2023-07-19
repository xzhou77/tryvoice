class CartItem{
 //   constructor(name, desc, img, price){
    constructor(name, price){
        this.name = name
        this.price = price
        this.quantity = 1
   }
}

class LocalCart{
    static key = "cartItems"

    static getLocalCartItems(){
        let cartMap = new Map()
     const cart = localStorage.getItem(LocalCart.key)   
     if(cart===null || cart.length===0)  return cartMap
        return new Map(Object.entries(JSON.parse(cart)))
    }

    static addItemToLocalCart(id, item){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem = cart.get(id)
            mapItem.quantity +=1
            cart.set(id, mapItem)
        }
        else
        cart.set(id, item)
       localStorage.setItem(LocalCart.key,  JSON.stringify(Object.fromEntries(cart)))
       updateCartUI()
        
    }

    static removeItemFromCart(id){
    let cart = LocalCart.getLocalCartItems()
    if(cart.has(id)){
        let mapItem = cart.get(id)
        if(mapItem.quantity>1)
       {
        mapItem.quantity -=1
        cart.set(id, mapItem)
       }
       else
       cart.delete(id)
    } 
    if (cart.length===0)
    localStorage.clear()
    else
    localStorage.setItem(LocalCart.key,  JSON.stringify(Object.fromEntries(cart)))
       updateCartUI()
    }
}


const cartIcon = document.querySelector('.header-cart')
const wholeCartWindow = document.querySelector('.whole-cart-window')
wholeCartWindow.inWindow = 0
const addToCartBtns = document.querySelectorAll('.dish-add-btn')
addToCartBtns.forEach( (btn)=>{
    btn.addEventListener('click', addItemFunction)
}  )

function addItemFunction(e){
    const id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id")
 //   const img = e.target.parentElement.parentElement.previousElementSibling.src
 //   const name = e.target.parentElement.previousElementSibling.textContent
    const name = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].textContent
 //   const desc = e.target.parentElement.children[0].textContent
 //   let price = e.target.parentElement.children[1].textContent
    let price = e.target.parentElement.parentElement.previousElementSibling.children[0].textContent
    price = price.replace("USD ", '')
 //   const item = new CartItem(name, desc, img, price)
    const item = new CartItem(name, price)
    LocalCart.addItemToLocalCart(id, item)
 console.log(price)
}


cartIcon.addEventListener('mouseover', ()=>{
if(wholeCartWindow.classList.contains('hide'))
wholeCartWindow.classList.remove('hide')
})

cartIcon.addEventListener('mouseleave', ()=>{
    // if(wholeCartWindow.classList.contains('hide'))
    setTimeout( () =>{
        if(wholeCartWindow.inWindow===0){
            wholeCartWindow.classList.add('hide')
        }
    } ,500 )
    
    })

 wholeCartWindow.addEventListener('mouseover', ()=>{
     wholeCartWindow.inWindow=1
 })  
 
 wholeCartWindow.addEventListener('mouseleave', ()=>{
    wholeCartWindow.inWindow=0
    wholeCartWindow.classList.add('hide')
})  
 

function updateCartUI(){
    const cartWrapper = document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML=" "
    const items = LocalCart.getLocalCartItems()
    if(items === null) return
    let count = 0
    let total = 0
    for(const [key, value] of items.entries()){
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        let price = value.price*value.quantity
        price = Math.round(price*100)/100
        count+=1
        total += price
        total = Math.round(total*100)/100
        cartItem.innerHTML =
        `
                       <div class="details">
                           <h6>${value.name}</h6>
   
                            <span class="quantity">Quantity: ${value.quantity}</span>
                               <span class="price">Price: $ ${price}</span>
                           </p>
                       </div>
                       <div class="cancel"><i class="fas fa-window-close"></i></div>
        `
       cartItem.lastElementChild.addEventListener('click', ()=>{
           LocalCart.removeItemFromCart(key)
       })
        cartWrapper.append(cartItem)
    }

    if(count >= 0){
        cartIcon.classList.add('non-empty')
        let root = document.querySelector(':root')
        root.style.setProperty('--after-content', `"${count}"`)
        const subtotal = document.querySelector('.subtotal')
        subtotal.innerHTML = `SubTotal: $${total}`
    }
    else
    cartIcon.classList.remove('non-empty')
}
document.addEventListener('DOMContentLoaded', ()=>{updateCartUI()})


// Add codes for checkout page
function checkout_view(){
    const checkoutPage = document.getElementById('checkout')
    const cartWrapper = document.querySelector('.cart-wrapper')

    cartWrapper.innerHTML=" "
    const items = LocalCart.getLocalCartItems()
    if(items === null) return
    let count = 0
    let total = 0
    for(const [key, value] of items.entries()){
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        let price = value.price*value.quantity
        price = Math.round(price*100)/100
        count+=1
        total += price
        total = Math.round(total*100)/100
        cartItem.innerHTML =
        `
                       <div class="details">
                           <h6>${value.name}</h6>  
                            <span class="quantity">Quantity: ${value.quantity}</span>
                            <span class="price">Price: $ ${price}</span>
                        
                       </div>
        `
        cartWrapper.append(cartItem)
    }

    if(count > 0){
        cartWrapper.innerHTML += `<span class="price">SubTotal: $${total}</span>`
    
    
    checkoutPage.innerHTML=
    `

    <div class="container"> 
        <div class="row">
            <div class="col-lg-12">
                <div class="sec-title text-center mb-5">
                    
                    <p class="sec-sub-title mb-3"><a href="#menu" onclick="order_more()">Order More</a></p>
                    <h4 style = "text-align: center; color: blue;">
                        Please check your ordered items </h4>
                    <div class="sec-title-shape mb-4">
                        <img src="assets/images/title-shape.svg" alt="">
                     </div>
                </div>` + cartWrapper.innerHTML +
    `        </div>
        </div>    </p>
        <form class="order-form">
        <label for="fname">Your name: </label> <br>
        <input type="text" id="fname" name="fname" value="Your Name here"><br>
        <label for="daddress">Phone Number: </label> <br>
        <input type="tel" value="0000000000"> <br>
        <input type="radio" id="ppick" name="ppick" value="PickUp">
        <label for="ppick">Pick Up</label><br>
        <input type="radio" id="ddelivery" name="ddlivery" value="Delivery">
        <label for="ddlivery">Delivery</label><br> 
        <label for="dtime">Pickup or Delivery Time:</label>
        <input type="time" id="dtime" name="dtime" value=""><br>
        <label for="daddress">Address:</label><br>
        <input type="text" id="daddress" name="daddress size="80" value="default unit, default street address, postal code"><br>
        
      </form> </p>
      <p class="sec-sub-title mb-3" style="background-color:brown">Check Out</p> 
    </div>

    `
    }
}
    
function order_more(){
    const checkoutPage = document.getElementById('checkout')
        
    checkoutPage.innerHTML= ``
}