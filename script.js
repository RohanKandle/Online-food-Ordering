/* ================= FOOD DATA ================= */
let foods = [
 {id:1,name:"Pizza",price:200,img:"pizza.jpg",flavors:["Cheese","Paneer","Veg"]},
 {id:2,name:"Burger",price:100,img:"burger.jpg",flavors:["Cheese","Spicy"]},
 {id:3,name:"Pasta",price:150,img:"pasta.jpg",flavors:["White Sauce","Red Sauce"]},
 {id:4,name:"Choco Lava Cake",price:180,img:"choco.jpg",flavors:["Chocolate","Dark"]},
 {id:5,name:"Momos",price:110,img:"momos.jpg",flavors:["Veg","Paneer","Fried"]}
];

/* ================= STORAGE ================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

/* ================= MENU ================= */
function loadMenu(items = foods){
 let menu = document.getElementById("menuItems");
 menu.innerHTML = "";

 items.forEach(food=>{
 let options = food.flavors.map(f=>`<option value="${f}">${f}</option>`).join("");

 menu.innerHTML += `
 <div class="card">
 <img src="${food.img}">
 <h3>${food.name}</h3>
 <p>₹${food.price}</p>

 <select id="food_${food.id}">
 ${options}
 </select><br>

 <button onclick="addToCart(${food.id})">Add</button>
 </div>`;
 });
}

/* ================= CART ================= */
function addToCart(id){
 let food = foods.find(f=>f.id === id);
 let flavor = document.getElementById("food_" + id).value;

 let item = cart.find(i=>i.id === id && i.flavor === flavor);

 if(item){
 item.qty++;
 } else {
 cart.push({
 id,
 name: food.name,
 price: food.price,
 flavor,
 qty: 1
 });
 }

 saveCart();
}

function saveCart(){
 localStorage.setItem("cart", JSON.stringify(cart));
 displayCart();
}

function displayCart(){
 let div = document.getElementById("cartItems");
 let total = 0;
 let count = 0;

 div.innerHTML = "";

 cart.forEach((item,i)=>{
 total += item.price * item.qty;
 count += item.qty;

 div.innerHTML += `
 <div class="cart-box">
 <b>${item.name} (${item.flavor})</b><br>
 ₹${item.price} × ${item.qty}<br>

 <button onclick="changeQty(${i},1)">+</button>
 <button onclick="changeQty(${i},-1)">-</button>
 </div>`;
 });

 document.getElementById("total").innerText = total;
 document.getElementById("cartCount").innerText = count;
 document.getElementById("payAmount").innerText = total;
}

function changeQty(i,val){
 cart[i].qty += val;

 if(cart[i].qty <= 0){
 cart.splice(i,1);
 }

 saveCart();
}

/* ================= SEARCH ================= */
function searchFood(){
 let val = document.getElementById("search").value.toLowerCase();

 let filtered = foods.filter(f =>
 f.name.toLowerCase().includes(val)
 );

 loadMenu(filtered);
}

/* ================= AUTH ================= */
function openAuth(){
 document.getElementById("authBox").style.display = "block";
}

function closeAuth(){
 document.getElementById("authBox").style.display = "none";
}

function signup(){
 let u = document.getElementById("authUser").value;
 let p = document.getElementById("authPass").value;

 if(!u || !p){
 alert("Fill all fields");
 return;
 }

 localStorage.setItem("user_" + u, p);

 alert("Registration successful");
}

function login(){
 let u = document.getElementById("authUser").value;
 let p = document.getElementById("authPass").value;

 let saved = localStorage.getItem("user_" + u);

 if(saved === p){
 localStorage.setItem("user", u);

 document.getElementById("userName").innerText = "👋 " + u;

 closeAuth();

 alert("Login successful");
 } else {
 alert("Invalid credentials");
 }
}

function logout(){
 localStorage.removeItem("user");
 document.getElementById("userName").innerText = "";

 alert("Logged out");

 openAuth();
}

/* ================= PAYMENT ================= */
function showPayment(){
 if(cart.length === 0){
 alert("Cart empty");
 return;
 }

 if(!localStorage.getItem("user")){
 alert("Please login first");
 return;
 }

 document.getElementById("paymentBox").style.display = "block";
}

function closePayment(){
 document.getElementById("paymentBox").style.display = "none";
}

/* ================= ORDER ================= */
function placeOrder(){
 let name = document.getElementById("name").value;
 let address = document.getElementById("address").value;
 let phone = document.getElementById("phone").value;

 if(!name || !address || !phone){
 alert("Fill all details");
 return;
 }

 let order = {
 name,
 address,
 phone,
 items: cart,
 total: cart.reduce((s,i)=>s + i.price * i.qty, 0),
 date: new Date().toLocaleString()
 };

 history.push(order);
 localStorage.setItem("history", JSON.stringify(history));

 cart = [];
 saveCart();
 showHistory();

 closePayment();

 document.getElementById("msg").innerText = "Order Placed Successfully!";
}

/* ================= HISTORY ================= */
function showHistory(){
 let div = document.getElementById("historyList");
 div.innerHTML = "";

 history.forEach(o=>{
 let items = o.items.map(i =>
 `${i.name}(${i.flavor}) x${i.qty}`
 ).join(", ");

 div.innerHTML += `
 <div class="history-box">
 <b>${o.name}</b><br>
 ${o.address}<br>
 ${o.phone}<br>
 ${items}<br>
 ₹${o.total}<br>
 ${o.date}
 </div>`;
 });
}

/* ================= INIT ================= */
window.onload = function(){
 loadMenu();
 displayCart();
 showHistory();

 let user = localStorage.getItem("user");

 if(user){
 document.getElementById("userName").innerText = "👋 " + user;
 }
};