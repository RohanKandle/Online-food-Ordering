// FOOD DATA
let foods = [
    { name: "Pizza", price: 200, img: "pizza.jpg", flavors: ["Cheese","Paneer","Veggie","Spicy"] },
    { name: "Burger", price: 100, img: "burger.jpg", flavors: ["Cheese","Double Patty","Spicy"] },
    { name: "Pasta", price: 150, img: "pasta.jpg", flavors: ["White Sauce","Red Sauce"] },
    { name: "Choco Lava Cake", price: 180, img: "choco.jpg", flavors: ["Chocolate","Dark Chocolate"] },
    { name: "Momos", price: 110, img: "momos.jpg", flavors: ["Veg","Paneer","Fried"] }
];

// STORAGE
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let isRegistered = localStorage.getItem("registered") || false;

/* ================= MENU ================= */
function loadMenu(items = foods){
    let menu = document.getElementById("menuItems");
    menu.innerHTML = "";

    items.forEach(food=>{
        let options = food.flavors.map(f => `<option value="${f}">${f}</option>`).join("");

        menu.innerHTML += `
        <div class="card">
            <img src="${food.img}">
            <div class="card-content">
                <h3>${food.name}</h3>
                <p>₹${food.price}</p>

                <select id="${food.name}">
                    ${options}
                </select><br>

                <button onclick="addToCart('${food.name}',${food.price})">Add</button>
            </div>
        </div>`;
    });
}

/* ================= CART ================= */
function addToCart(name,price){
    let flavor = document.getElementById(name).value;

    let item = cart.find(i=>i.name===name && i.flavor===flavor);

    if(item) item.qty++;
    else cart.push({name,price,flavor,qty:1});

    saveCart();
}

function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function displayCart(){
    let div = document.getElementById("cartItems");
    let total = 0, items = 0;
    div.innerHTML = "";

    if(cart.length===0){
        div.innerHTML = "<p>Your cart is empty</p>";
    }

    cart.forEach((item,i)=>{
        total += item.price * item.qty;
        items += item.qty;

        div.innerHTML += `
        <div class="cart-box">
            <b>${item.name} (${item.flavor})</b><br>
            ₹${item.price} × ${item.qty}<br>
            <button onclick="changeQty(${i},1)">+</button>
            <button onclick="changeQty(${i},-1)">-</button>
        </div>`;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("totalItems").innerText = items;
    document.getElementById("payAmount").innerText = total;
    document.getElementById("cartCount").innerText = items;
}

function changeQty(i,val){
    cart[i].qty += val;
    if(cart[i].qty<=0) cart.splice(i,1);
    saveCart();
}

function clearCart(){
    cart = [];
    saveCart();
}

/* ================= SEARCH ================= */
function searchFood(){
    let val = document.getElementById("search").value.toLowerCase();
    let filtered = foods.filter(f=>f.name.toLowerCase().includes(val));
    loadMenu(filtered);
}

/* ================= PAYMENT ================= */
function showPayment(){
    if(cart.length===0){
        alert("Cart empty!");
        return;
    }

    if(!localStorage.getItem("user")){
        alert("Please login first!");
        return;
    }

    document.getElementById("paymentBox").style.display="block";
}

function closePayment(){
    document.getElementById("paymentBox").style.display="none";
}

/* ================= ORDER ================= */
function placeOrder(){
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let phone = document.getElementById("phone").value;

    if(name=="" || address=="" || phone==""){
        alert("Fill all details!");
        return;
    }

    closePayment();
    document.getElementById("loader").style.display="block";

    setTimeout(()=>{
        document.getElementById("loader").style.display="none";

        let order = {
            name, address, phone,
            items: cart,
            total: cart.reduce((sum,i)=>sum+i.price*i.qty,0),
            date: new Date().toLocaleString()
        };

        history.push(order);
        localStorage.setItem("history", JSON.stringify(history));

        cart = [];
        saveCart();
        showHistory();

        document.getElementById("msg").innerText = "✅ Order Placed!";
    },1500);
}

/* ================= HISTORY ================= */
function showHistory(){
    let div = document.getElementById("historyList");
    div.innerHTML="";

    history.forEach(order=>{
        let itemsHTML = order.items.map(i=>`${i.name} (${i.flavor}) x${i.qty}`).join(", ");

        div.innerHTML += `
        <div class="history-box">
            <b>${order.name}</b><br>
            📍 ${order.address}<br>
            📞 ${order.phone}<br>
            🧾 ${itemsHTML}<br>
            💰 ₹${order.total}<br>
            🕒 ${order.date}
        </div>`;
    });
}

/* ================= THEME ================= */
function toggleTheme(){
    document.body.classList.toggle("light");
}

/* ================= AUTH ================= */
function openAuth(){
    document.getElementById("authBox").style.display="block";
}

function closeAuth(){
    document.getElementById("authBox").style.display="none";
}

function signup(){
    let u = document.getElementById("authUser").value;
    let p = document.getElementById("authPass").value;

    if(u=="" || p==""){
        alert("Fill all fields!");
        return;
    }

    localStorage.setItem("user_"+u, p);
    localStorage.setItem("registered", true);

    alert("Registration successful! Now login.");

    document.getElementById("authUser").value = "";
    document.getElementById("authPass").value = "";
}

function login(){
    let u = document.getElementById("authUser").value;
    let p = document.getElementById("authPass").value;

    let saved = localStorage.getItem("user_"+u);

    if(saved === p){
        localStorage.setItem("user", u);
        document.getElementById("userName").innerText = "👋 " + u;

        alert("Login successful!");
        closeAuth();
    } else {
        alert("Invalid login!");
    }
}

/* ================= 🔥 FIRST PAGE FLOW ================= */
window.onload = function(){

    let user = localStorage.getItem("user");

    if(!isRegistered){
        document.getElementById("authBox").style.display = "block";
        document.getElementById("msg").innerText = "⚠️ Please register first";
    }
    else if(!user){
        document.getElementById("authBox").style.display = "block";
        document.getElementById("msg").innerText = "🔐 Please login";
    }
    else{
        document.getElementById("userName").innerText = "👋 " + user;
    }

    loadMenu();
    displayCart();
    showHistory();
};