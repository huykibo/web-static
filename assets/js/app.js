
const products = [
 {id:1,name:"Performance Training T-Shirt",price:38,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",rating:5,cat:"men"},
 {id:2,name:"Essential Gym Shorts",price:42,image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85",rating:5,cat:"men"},
 {id:3,name:"Heavyweight Oversized Tee",price:48,old:58,image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",rating:4,cat:"men",sale:true},
 {id:4,name:"Flex Training Joggers",price:64,image:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=85",rating:5,cat:"men"},
 {id:5,name:"Women's Sculpt Leggings",price:58,image:"https://images.unsplash.com/photo-1506629905607-d9f3f1f0a1f6?auto=format&fit=crop&w=900&q=85",rating:5,cat:"women"},
 {id:6,name:"Women's Performance Crop Top",price:39,old:45,image:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85",rating:5,cat:"women",sale:true},
 {id:7,name:"Seamless Training Tank",price:34,image:"https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=85",rating:4,cat:"women"},
 {id:8,name:"Performance Hoodie",price:78,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",rating:5,cat:"men"},
 {id:9,name:"Velocity Training Tee",price:44,image:"https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=85",rating:5,cat:"men"},
 {id:10,name:"Core Training Tank",price:36,image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",rating:4,cat:"women"}
];

function money(v){return "$"+v.toFixed(2)}
function stars(n=5){return "★★★★★".slice(0,n)}
function card(p){
 return `<article class="product">
   <div class="product-image">
    ${p.sale?'<span class="badge">Sale</span>':''}
    <button class="wishlist" aria-label="Add to wishlist" onclick="wish(this)">♡</button>
    <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
   </div>
   <div class="product-info">
    <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
    <div class="meta"><span class="price">${money(p.price)}${p.old?` <span class="old">${money(p.old)}</span>`:""}</span><span class="stars">${stars(p.rating)}</span></div>
    <div class="quick-add"><button class="btn btn-primary" onclick="addToCart(${p.id})">Quick Add</button></div>
   </div>
  </article>`;
}
function renderProducts(selector,list=products){const el=document.querySelector(selector);if(el)el.innerHTML=list.map(card).join("")}
function getCart(){return JSON.parse(localStorage.getItem("ironfit-cart")||"[]")}
function saveCart(c){localStorage.setItem("ironfit-cart",JSON.stringify(c));updateCartCount()}
function addToCart(id){
 const c=getCart(); const found=c.find(x=>x.id===id);
 if(found)found.qty++; else c.push({id,qty:1});
 saveCart(c); toast("Added to cart");
}
function removeCart(id){saveCart(getCart().filter(x=>x.id!==id));renderCart()}
function changeQty(id,d){
 const c=getCart();const x=c.find(x=>x.id===id);if(!x)return;x.qty+=d;if(x.qty<1)x.qty=1;saveCart(c);renderCart()
}
function updateCartCount(){const n=getCart().reduce((s,x)=>s+x.qty,0);document.querySelectorAll(".cart-count b").forEach(e=>e.textContent=n)}
function wish(btn){btn.textContent=btn.textContent==="♡"?"♥":"♡";toast(btn.textContent==="♥"?"Added to wishlist":"Removed from wishlist")}
function toast(msg){let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
function renderCart(){
 const el=document.querySelector("#cart-items");if(!el)return;const c=getCart();
 if(!c.length){el.innerHTML='<div style="padding:50px 0;text-align:center"><h2>Your cart is empty.</h2><p style="margin:12px 0 25px;color:#777">Add something from the collection.</p><a class="btn btn-primary" href="shop.html">Shop Now</a></div>';document.querySelector("#cart-summary")?.remove();return}
 el.innerHTML=`<table class="cart-table"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th></th></tr></thead><tbody>${
 c.map(x=>{const p=products.find(p=>p.id===x.id);return `<tr><td><div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><strong>${p.name}</strong><small style="display:block;color:#777">${money(p.price)}</small></div></div></td><td><div class="quantity"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></td><td><strong>${money(p.price*x.qty)}</strong></td><td><button onclick="removeCart(${p.id})" style="border:0;background:none;font-size:20px">×</button></td></tr>`}).join("")}</tbody></table>`;
 const total=c.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
 let box=document.querySelector("#cart-summary");if(!box){box=document.createElement("div");box.id="cart-summary";box.className="cart-summary";el.parentNode.appendChild(box)}
 box.innerHTML=`<h3>Order Summary</h3><div class="row-total"><span>Subtotal</span><strong>${money(total)}</strong></div><div class="row-total"><span>Shipping</span><span>Calculated at checkout</span></div><hr style="border:0;border-top:1px solid #ddd;margin:8px 0"><div class="row-total"><strong>Total</strong><strong>${money(total)}</strong></div><button class="btn btn-primary add-wide" onclick="toast('Demo checkout — connect your payment provider here')">Checkout</button>`;
}
function setupMobile(){
 const btn=document.querySelector(".menu-btn"),nav=document.querySelector(".mobile-nav");if(btn&&nav)btn.addEventListener("click",()=>nav.classList.toggle("open"))
}
function setupNewsletter(){
 document.querySelectorAll("[data-newsletter]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();toast("Welcome to IRONFIT — your 10% code is on its way.")}))
}
function setupContact(){
 document.querySelectorAll("[data-contact]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();toast("Thanks — your message has been received.")}))
}
function setupFilters(){
 const grid=document.querySelector("#shop-grid");if(!grid)return;
 const checks=[...document.querySelectorAll("[data-cat]")],search=document.querySelector("#shop-search"),sort=document.querySelector("#sort");
 function run(){
  let arr=[...products],term=(search?.value||"").toLowerCase();
  const cats=checks.filter(x=>x.checked).map(x=>x.value);
  if(cats.length)arr=arr.filter(p=>cats.includes(p.cat));
  if(term)arr=arr.filter(p=>p.name.toLowerCase().includes(term));
  if(sort?.value==="low")arr.sort((a,b)=>a.price-b.price); if(sort?.value==="high")arr.sort((a,b)=>b.price-a.price);
  renderProducts("#shop-grid",arr);
 }
 checks.forEach(x=>x.addEventListener("change",run));search?.addEventListener("input",run);sort?.addEventListener("change",run);run();
}
function setupProduct(){
 const box=document.querySelector("#product-detail");if(!box)return;
 const id=Number(new URLSearchParams(location.search).get("id")||1),p=products.find(x=>x.id===id)||products[0];
 box.innerHTML=`<div class="gallery"><img src="${p.image}" alt="${p.name}"><img src="${p.image}" alt="${p.name} alternate view"><img src="${p.image}" alt="${p.name} detail"><img src="${p.image}" alt="${p.name} back view"></div>
 <div class="detail-info"><div class="stars">${stars(p.rating)} <span style="color:#777">4.9 (128 reviews)</span></div><h1>${p.name}</h1><div class="detail-price">${money(p.price)}</div><p class="detail-desc">Premium performance fabric with a comfortable athletic fit, breathable construction, and durable finish designed for hard training and everyday movement.</p>
 <strong>Choose size</strong><div class="size-list">${["XS","S","M","L","XL"].map((s,i)=>`<button class="${i===2?"active":""}" onclick="this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('active'));this.classList.add('active')">${s}</button>`).join("")}</div>
 <div class="quantity"><button onclick="changeDetailQty(-1)">−</button><span id="detail-qty">1</span><button onclick="changeDetailQty(1)">+</button></div>
 <button class="btn btn-primary add-wide" onclick="addDetail()">Add to Cart — ${money(p.price)}</button>
 <div class="info-list"><div class="info-row"><strong>Shipping</strong><br>Free worldwide shipping on orders over $100.</div><div class="info-row"><strong>Details</strong><br>Performance stretch fabric · Athletic fit · Machine washable</div><div class="info-row"><strong>Returns</strong><br>30-day easy returns on unworn items.</div></div></div>`;
 window.detailProduct=p;
}
function changeDetailQty(d){let e=document.querySelector("#detail-qty");e.textContent=Math.max(1,Number(e.textContent)+d)}
function addDetail(){const p=window.detailProduct,q=Number(document.querySelector("#detail-qty").textContent);const c=getCart();const x=c.find(x=>x.id===p.id);if(x)x.qty+=q;else c.push({id:p.id,qty:q});saveCart(c);toast("Added to cart")}
document.addEventListener("DOMContentLoaded",()=>{
 updateCartCount();setupMobile();setupNewsletter();setupContact();setupFilters();setupProduct();renderCart();
 document.querySelectorAll("[data-products]").forEach(e=>renderProducts(`[data-products="${e.dataset.products}"]`,products.slice(0,Number(e.dataset.limit||8))));
});
