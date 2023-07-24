class CartItem{
 //   constructor(name, desc, img, price){
    constructor(id, name, price){
        this.id = id
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

     //   let ordered = parseInt(e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[1].children[1].textContent)
       
     //   e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[1].children[1].textContent
     //           = ordered + 1
     //   const selector = '[data-id="' + id + '"]'
        let ordered = document.querySelector('[data-id="' + id + '"]')
        let ordered_no = parseInt(ordered.children[3].children[0].children[1].children[1].textContent) + 1
        ordered.children[3].children[0].children[1].children[1].textContent = ordered_no

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

   // let ordered = parseInt(e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[1].children[1].textContent)
   // if (ordered > 0) {
   //     e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[1].children[1].textContent
   //         = ordered - 1
    //}

    let ordered = document.querySelector('[data-id="' + id + '"]')
    let ordered_no = parseInt(ordered.children[3].children[0].children[1].children[1].textContent) -1
    if (ordered_no >=0) {
        ordered.children[3].children[0].children[1].children[1].textContent = ordered_no
    }
    
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
const minusToCartBtns = document.querySelectorAll('.dish-minus-btn')
minusToCartBtns.forEach( (btn)=>{
    btn.addEventListener('click', minusItemFunction)
}  )

function minusItemFunction(e){
    const id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id")
 //   const img = e.target.parentElement.parentElement.previousElementSibling.src
 //   const name = e.target.parentElement.previousElementSibling.textContent
    const name = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.children[0].textContent
 //   const desc = e.target.parentElement.children[0].textContent
 //   let price = e.target.parentElement.children[1].textContent
    let price = e.target.parentElement.parentElement.nextElementSibling.children[0].textContent
    price = price.replace("USD ", '')
 //   const item = new CartItem(name, desc, img, price)
    const item = new CartItem(id, name, price)
    LocalCart.removeItemFromCart(id)



 console.log(price)
}

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
    const item = new CartItem(id, name, price)
    LocalCart.addItemToLocalCart(id, item)

  //  let ordered = parseInt(e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[1].children[1].textContent)
  //  e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[1].children[1].textContent
    //     = ordered + 1   

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
       // `
       //                <div class="cancel"><i class="uil uil-plus"></i></div>
        `
                       <div class="details">
                           <h6>${value.name}</h6>
                           <button class="dish-add-btn"><i class="uil uil-plus"></i></button>
                           <button class="dish-minus-btn"><i class="uil uil-minus"></i></button>
                            <span class="quantity">Quantity: ${value.quantity}</span>
                               <span class="price">Price: $ ${price}</span>
                           </p>
                       </div>
                   
         `
        //               <div class="cancel"><i class="uil uil-minus"></i></div>
        
       cartItem.firstElementChild.children[2].addEventListener('click', ()=>{
           LocalCart.removeItemFromCart(key)
       })
       cartItem.firstElementChild.children[1].addEventListener('click', ()=>{
        LocalCart.addItemToLocalCart(key, null)
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
    const cartWrapper = document.querySelector('.checkout-wrapper')

    cartWrapper.innerHTML=" "
    const items = LocalCart.getLocalCartItems()
    if(items === null) {
        window.location.href = "#home"
        return
    }
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
                           <h6>${value.name}</h6> <img src="assets/images/dish/${value.id}.jpg">
                            <span class="quantity">Quantity: ${value.quantity}  </span>
                            <span class="price">Price: $ ${price}</span>
                            
                       </div>
        `
        
        cartWrapper.append(cartItem)

    }

    hide_all()

    if(count > 0){
        cartWrapper.innerHTML += `<span class="price">SubTotal: $${total}</span>`
    
    
    checkoutPage.innerHTML=
    `
    <div class="container"> 
        <div class="row">
            <div class="col-lg-12">
                <div class="sec-title text-center mb-5">
                    
                    <p class="sec-sub-title mb-3"><a href="#menu" onclick="order_more()">Order More | Go Back</a></p>
                    <h4 style = "text-align: center; color: blue;">
                        Please check your ordered items </h4>
                    <div class="sec-title-shape mb-4">
                        <img src="assets/images/title-shape.svg" alt="">
                     </div>
                </div> <div class="checkout-wrapper">` + cartWrapper.innerHTML +
    ` </div>       </div>
        </div>    </p>
        <form class="order-form">
        <label for="fname">Your name: </label> <br>
        <input type="text" id="fname" name="fname" value="-"><br>
        <label for="daddress">Phone Number: </label> <br>
        <input type="tel" value=""> <br>
        <input type="radio" id="ppick" name="delivery-pickup" value="PickUp">
        <label for="ppick">Pick Up</label><br>
        <input type="radio" id="ddelivery" name="delivery-pickup" value="Delivery">
        <label for="ddelivery">Delivery</label><br> 
        <label for="dtime">Pickup or Delivery Time:</label>
        <input type="time" id="dtime" name="dtime" value=""><br>
        <label for="daddress">Address:</label><br>
        <input type="text" id="daddress" name="daddress size="80" value="-"><br>
        
      </form> </p>
      <p class="sec-sub-title mb-3" style="background-color:brown">Check Out</p> 
      <p class="sec-sub-title mb-3"><a href="#menu" onclick="order_more()">Order More | Go Back</a></p>
    </div>

    `
    }
    else
    {
        checkoutPage.innerHTML=
    `
    <div class="container"> 
        <div class="row">
            <div class="col-lg-12">
                <div class="sec-title text-center mb-5">
                    
                    <p class="sec-sub-title mb-3"><a href="#menu" onclick="order_more()">Order More | Go Back</a></p>
                    <h4 style = "text-align: center; color: blue;">
                        Nothing in your shopping bag ! </h4>
                </div>
            </div>            
        </div>
    </div>

    `
    }

    window.location.href = "#checkout"
}
    
function order_more(){
    const checkoutPage = document.getElementById('checkout')
        
    checkoutPage.innerHTML= ` <div class="checkout-wrapper"></div>`

    const footer_i = document.querySelector('.site-footer')
    const header_i = document.querySelector('.site-header')
    const banner_i = document.querySelector('.main-banner')
    const about_i = document.querySelector('.about-sec')
    const book_i = document.querySelector('.book-table')
    const menu_i = document.querySelector('.our-menu')
    const blog_i = document.querySelector('.blog-sec')

    footer_i.style.display = "inline"
    header_i.style.display = "inline"
    banner_i.style.display = "inline"
    about_i.style.display = "inline"
    book_i.style.display = "inline"
    menu_i.style.display = "inline"
    blog_i.style.display = "inline"
}

function hide_all() { 
    const footer_i = document.querySelector('.site-footer')
    const header_i = document.querySelector('.site-header')
    const banner_i = document.querySelector('.main-banner')
    const about_i = document.querySelector('.about-sec')
    const book_i = document.querySelector('.book-table')
    const menu_i = document.querySelector('.our-menu')
    const blog_i = document.querySelector('.blog-sec')

    footer_i.style.display = "none"
    header_i.style.display = "none"
    banner_i.style.display = "none"
    about_i.style.display = "none"
    book_i.style.display = "none"
    menu_i.style.display = "none"
    blog_i.style.display = "none"
}

function hide_cart() {
    wholeCartWindow.inWindow=0
    wholeCartWindow.classList.add('hide')
    
}

// Before unload, clear the cart

  // Add event listener for the beforeunload event
  window.addEventListener("beforeunload", (event) => {
    // Customize the confirmation message
    event.returnValue = "Are you sure you want to leave this page?"; // This will display a confirmation dialog
  });
  
  // Function to handle the user's response from the confirmation dialog
  function handleConfirmation(event) {
    // Check if the user confirmed leaving the page
    if (event.returnValue !== undefined) {
      console.log("User confirmed leaving the page.");
      localStorage.clear()
    } else {
      console.log("User decided to stay on the page.");
      // Add any additional actions you want to perform if the user stays on the page
    }
  }
  
  // Add event listener to the 'unload' event to handle the user's response
  window.addEventListener("unload", handleConfirmation);
  